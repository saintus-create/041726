'use client';

import { useMemo } from 'react';
import { studies, getStudyStats, topCountsBy } from '@/lib/studies';

export function StudiesVisualizations() {
  const stats = getStudyStats();
  const countryData = useMemo(() => topCountsBy(studies, (s) => s.country, 40), []);
  const yearData = useMemo(() => {
    const years: Record<number, number> = {};
    studies.forEach((s) => {
      if (s.year) years[s.year] = (years[s.year] || 0) + 1;
    });
    return Object.entries(years).sort(([a], [b]) => Number(a) - Number(b));
  }, []);
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    studies.forEach((s) => {
      const cat = s.subject?.split(' ')[0] || 'Other';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { value: stats.total, label: 'Total Studies' },
          { value: stats.countries, label: 'Countries' },
          { value: `${stats.yearMin}–${stats.yearMax}`, label: 'Year Range' },
          { value: stats.withCitation, label: 'With DOI' },
        ].map(({ value, label }) => (
          <div key={label} style={{
            padding: 20,
            border: '1px solid var(--color-border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-fg)', letterSpacing: '-0.02em' }}>
              {value}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)', marginTop: 4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 12, color: 'var(--color-fg)' }}>
          Studies by Country
        </h3>
        <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
          {countryData.map(({ label, count }) => {
            const max = Math.max(...countryData.map((d) => d.count));
            const height = (count / max) * 100;
            return (
              <div
                key={label}
                title={`${label}: ${count}`}
                style={{
                  flex: 1,
                  background: 'var(--color-fg)',
                  height: `${height}%`,
                  minWidth: 6,
                  cursor: 'default',
                }}
              />
            );
          })}
        </div>
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
          {countryData.slice(0, 10).map(({ label }) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 12, color: 'var(--color-fg)' }}>
          Research Over Time
        </h3>
        <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          {yearData.map(([year, count]) => {
            const max = Math.max(...yearData.map(([, c]) => c));
            const height = (count / max) * 100;
            return (
              <div
                key={year}
                title={`${year}: ${count} studies`}
                style={{
                  flex: 1,
                  background: 'var(--color-fg)',
                  height: `${height}%`,
                  cursor: 'default',
                }}
              />
            );
          })}
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
          <span>{yearData[0]?.[0]}</span>
          <span>{yearData[yearData.length - 1]?.[0]}</span>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 12, color: 'var(--color-fg)' }}>
          Evidence by Category
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {categoryData.slice(0, 12).map(({ label, count }) => {
            const max = categoryData[0]?.count || 1;
            const width = (count / max) * 100;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 120, fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
                <div style={{ flex: 1, height: 20, background: 'var(--color-selection)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--color-fg)', width: `${width}%` }} />
                </div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)', width: 28, textAlign: 'right' }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
