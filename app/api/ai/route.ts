import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const exaApiKey = process.env.EXA_API_KEY;
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!exaApiKey || !openRouterApiKey) {
      return NextResponse.json({ 
        error: 'API keys not configured' 
      }, { status: 500 });
    }

    // Step 1: Search with Exa for relevant context
    let context = '';
    try {
      const exaResponse = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${exaApiKey}`,
        },
        body: JSON.stringify({
          query: message,
          mode: 'fast',
          num_results: 5,
          include_domains: ['pubmed.ncbi.nlm.nih.gov', 'cochranelibrary.org', 'sciencedirect.com', 'jamanetwork.com', 'nejm.org', 'fda.gov'],
        }),
      });

      if (exaResponse.ok) {
        const data = await exaResponse.json();
        if (data.results?.length > 0) {
          context = data.results.map((r: any) => 
            `- ${r.title}: ${r.url}`
          ).join('\n');
        }
      }
    } catch (exaError) {
      console.error('Exa search error:', exaError);
    }

    // Step 2: Get AI response from OpenRouter
    const systemPrompt = `You are a medical research assistant for the FDA FAERS Pharmacovigilance Analysis site.
Your role is to help users understand ADHD stimulant safety data from FDA adverse event reports.

CONTEXT ABOUT THIS SITE:
- This site contains FDA adverse event reports for ADHD stimulants (Adderall, Vyvanse, Ritalin, etc.)
- Data shows 1.46% of all FDA adverse event reports are from ADHD stimulants
- The data includes Reporting Odds Ratio (ROR) analysis for various adverse events
- Key findings: stimulants show lower rates of most common adverse events vs other drugs
- Expected signals include drug abuse (ROR 19.4), anxiety (ROR 3.0), depression (ROR 3.8)

${context ? `RELEVANT RESEARCH FINDINGS:\n${context}` : ''}

Instructions:
- Keep responses concise (under 200 words)
- Be factual and data-driven
- If citing specific numbers, reference the source
- If you don't know something, say so
- Don't provide medical advice - direct users to consult healthcare providers`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://fda-faers-analysis.vercel.app',
        'X-Title': 'FDA FAERS Analysis',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []).map((m: any) => ({ 
            role: m.role === 'user' ? 'user' : 'assistant', 
            content: m.content 
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 
      'I apologize, but I could not generate a response.';

    return NextResponse.json({ response: assistantMessage });
  } catch (error: any) {
    console.error('AI API error:', error);
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}