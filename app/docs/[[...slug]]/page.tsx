import Link from 'next/link';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getMDXComponents } from '@/components/mdx';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <aside style={{
        width: 220,
        borderRight: '1px solid var(--color-border)',
        background: '#fafafa',
        padding: 'var(--space-4)'
      }}>
        <Link href="/" style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--color-fg)',
          marginBottom: 'var(--space-5)',
          textDecoration: 'none'
        }}>
          ← Home
        </Link>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Link href="/docs" style={{
            display: 'block',
            padding: '6px var(--space-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-fg-muted)',
            borderRadius: 4,
            textDecoration: 'none'
          }}>Overview</Link>
          <Link href="/docs/explorer" style={{
            display: 'block',
            padding: '6px var(--space-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-fg-muted)',
            borderRadius: 4,
            textDecoration: 'none'
          }}>Explorer</Link>
          <Link href="/docs/methodology" style={{
            display: 'block',
            padding: '6px var(--space-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-fg-muted)',
            borderRadius: 4,
            textDecoration: 'none'
          }}>Methodology</Link>
        </nav>
      </aside>
      
      <main style={{
        flex: 1,
        maxWidth: 800,
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-6)'
      }}>
        <article className="prose">
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            marginBottom: 'var(--space-6)',
            paddingBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--color-border)',
            letterSpacing: '-0.025em',
            color: 'var(--color-fg)'
          }}>
            {page.data.title}
          </h1>
          <MDX components={getMDXComponents({})} />
        </article>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
  };
}