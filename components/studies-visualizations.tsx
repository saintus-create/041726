'use client';

import { useMemo, useState } from 'react';
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
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg text-center">
          <div className="text-3xl font-semibold">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Studies</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-3xl font-semibold">{stats.countries}</div>
          <div className="text-sm text-gray-500">Countries</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-3xl font-semibold">{stats.yearMin}–{stats.yearMax}</div>
          <div className="text-sm text-gray-500">Year Range</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-3xl font-semibold">{stats.withCitation}</div>
          <div className="text-sm text-gray-500">With DOI</div>
        </div>
      </div>

      {/* Country Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Studies by Country</h3>
        <div className="h-64 flex items-end gap-1">
          {countryData.map(({ label, count }) => {
            const max = Math.max(...countryData.map((d) => d.count));
            const height = (count / max) * 100;
            return (
              <div
                key={label}
                className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer group relative"
                style={{ height: `${height}%`, minWidth: 8 }}
              >
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  {label}: {count}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-1 text-xs text-gray-500">
          {countryData.slice(0, 10).map(({ label }) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Research Over Time</h3>
        <div className="h-48 flex items-end gap-2">
          {yearData.map(([year, count]) => {
            const max = Math.max(...yearData.map(([, c]) => c));
            const height = (count / max) * 100;
            return (
              <div
                key={year}
                className="flex-1 bg-emerald-500 rounded-t hover:bg-emerald-600 transition-colors cursor-pointer group relative"
                style={{ height: `${height}%` }}
              >
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  {year}: {count} studies
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>{yearData[0]?.[0]}</span>
          <span>{yearData[yearData.length - 1]?.[0]}</span>
        </div>
      </div>

      {/* Category Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Evidence by Category</h3>
        <div className="space-y-2">
          {categoryData.slice(0, 12).map(({ label, count }) => {
            const max = categoryData[0]?.count || 1;
            const width = (count / max) * 100;
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="w-32 text-sm text-gray-600 truncate">{label}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}