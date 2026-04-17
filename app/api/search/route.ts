import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, mode } = await req.json();
    
    if (!process.env.EXA_API_KEY) {
      return NextResponse.json({ error: 'EXA_API_KEY not configured' }, { status: 500 });
    }

    const exaResponse = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        mode: mode || 'fast',
        num_results: 10,
        include_domains: ['pubmed.ncbi.nlm.nih.gov', 'cochranelibrary.org', 'sciencedirect.com', 'jamanetwork.com', 'nejm.org'],
        exclude_domains: ['facebook.com', 'twitter.com', 'reddit.com'],
      }),
    });

    if (!exaResponse.ok) {
      throw new Error(`Exa API error: ${exaResponse.status}`);
    }

    const data = await exaResponse.json();
    
    const results = data.results?.map((result: any) => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet,
      score: result.score,
    })) || [];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}