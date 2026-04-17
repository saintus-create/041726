import Link from 'next/link';
import { getStudyStats } from '@/lib/studies';
import { appName } from '@/lib/shared';

const stats = getStudyStats();

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: 'var(--space-10) var(--space-6)'
      }}>
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            marginBottom: 'var(--space-2)',
            color: 'var(--color-fg)',
            letterSpacing: '-0.025em'
          }}>
            {appName}
          </h1>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-fg-muted)'
          }}>
            FDA FAERS Pharmacovigilance Analysis
          </p>
        </header>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Link href="/docs" style={{
            display: 'block',
            padding: 'var(--space-4)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            textDecoration: 'none',
            color: 'var(--color-fg)',
            transition: 'border-color 0.15s, background 0.15s'
          }}>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-base)' }}>Overview</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)', marginTop: 4 }}>
              {stats.total} records · {stats.yearMin}–{stats.yearMax}
            </div>
          </Link>
          
          <Link href="/docs/explorer" style={{
            display: 'block',
            padding: 'var(--space-4)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            textDecoration: 'none',
            color: 'var(--color-fg)',
            transition: 'border-color 0.15s, background 0.15s'
          }}>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-base)' }}>Explorer</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)', marginTop: 4 }}>
              Browse records
            </div>
          </Link>
          
          <Link href="/docs/methodology" style={{
            display: 'block',
            padding: 'var(--space-4)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            textDecoration: 'none',
            color: 'var(--color-fg)',
            transition: 'border-color 0.15s, background 0.15s'
          }}>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-base)' }}>Methodology</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)', marginTop: 4 }}>
              How this site was built
            </div>
          </Link>
        </nav>
        
        <footer style={{
          marginTop: 'var(--space-10)',
          textAlign: 'center',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-fg-subtle)'
        }}>
          Data source: FDA FAERS 2024
        </footer>
      </div>
    </main>
  );
}