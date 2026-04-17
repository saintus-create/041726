'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/cn';
import {
  getFilterOptions,
  getSourceLabel,
  getStudyLink,
  getStudyStats,
  getStudyTitle,
  studies,
  topCountsBy,
} from '@/lib/studies';

const stats = getStudyStats();
const filterOptions = getFilterOptions();
const inputClassName =
  'mt-1 flex h-10 w-full rounded-md border border-fd-border bg-fd-background px-3 text-sm text-fd-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fd-ring';
const smallMetaClassName =
  'rounded-md border border-fd-border bg-fd-muted px-2 py-1 text-xs text-fd-muted-foreground';

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col text-sm text-fd-muted-foreground">
      <span>{label}</span>
      {children}
    </label>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-fd-border bg-fd-card p-3">
      <dt className="text-xs text-fd-muted-foreground">{label}</dt>
      <dd className="text-sm text-fd-foreground">{value}</dd>
    </div>
  );
}

function RankList({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; count: number }>;
}) {
  const max = items[0]?.count ?? 1;

  return (
    <Card title={title}>
      <ol className="not-prose flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-fd-foreground">{item.label}</span>
              <span className="text-fd-muted-foreground">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-fd-muted">
              <div
                className="h-2 rounded-full bg-fd-primary"
                style={{ width: String(Math.max((item.count / max) * 100, 8)) + '%' }}
              />
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function ResearchExplorer() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('all');
  const [journal, setJournal] = useState('all');
  const [source, setSource] = useState('all');
  const [yearFrom, setYearFrom] = useState(String(filterOptions.yearMin ?? ''));
  const [yearTo, setYearTo] = useState(String(filterOptions.yearMax ?? ''));
  const deferredSearch = useDeferredValue(search);

  const filteredStudies = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const from = Number(yearFrom);
    const to = Number(yearTo);

    return studies.filter((study) => {
      if (query) {
        const haystack = [
          study.author,
          study.country,
          study.journal,
          study.subject,
          study.summary,
          study.citation,
          study.doi,
          study.domain,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      if (country !== 'all' && study.country !== country) return false;
      if (journal !== 'all' && study.journal !== journal) return false;
      if (source !== 'all' && study.source !== source) return false;
      if (Number.isFinite(from) && study.year && study.year < from) return false;
      if (Number.isFinite(to) && study.year && study.year > to) return false;

      return true;
    });
  }, [country, deferredSearch, journal, source, yearFrom, yearTo]);

  const filteredStats = useMemo(() => getStudyStats(filteredStudies), [filteredStudies]);
  const topCountries = useMemo(() => topCountsBy(filteredStudies, (study) => study.country), [filteredStudies]);
  const topJournals = useMemo(() => topCountsBy(filteredStudies, (study) => study.journal), [filteredStudies]);
  const topSubjects = useMemo(() => topCountsBy(filteredStudies, (study) => study.subject), [filteredStudies]);

  function resetFilters() {
    setSearch('');
    setCountry('all');
    setJournal('all');
    setSource('all');
    setYearFrom(String(filterOptions.yearMin ?? ''));
    setYearTo(String(filterOptions.yearMax ?? ''));
  }

  return (
    <section className="not-prose flex flex-col gap-6">
      <div className="grid grid-cols-1 border-t border-b border-fd-border md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-fd-border w-full mb-8">
        <div className="flex flex-col p-6 gap-2 bg-transparent">
          <span className="text-3xl font-medium tracking-tight text-fd-foreground">{stats.total}</span>
          <h3 className="text-base font-medium text-fd-foreground">Total records</h3>
          <p className="text-sm text-fd-muted-foreground leading-relaxed mt-auto pt-4">Stored locally in this repository. {stats.yearMin} to {stats.yearMax}.</p>
        </div>
        <div className="flex flex-col p-6 gap-2 bg-transparent">
          <span className="text-3xl font-medium tracking-tight text-fd-foreground">{filteredStats.total}</span>
          <h3 className="text-base font-medium text-fd-foreground">Search results</h3>
          <p className="text-sm text-fd-muted-foreground leading-relaxed mt-auto pt-4">Updates dynamically as filters change. {filteredStats.countries} countries in view.</p>
        </div>
        <div className="flex flex-col p-6 gap-2 bg-transparent">
          <span className="text-3xl font-medium tracking-tight text-fd-foreground">{stats.countries}</span>
          <h3 className="text-base font-medium text-fd-foreground">Countries</h3>
          <p className="text-sm text-fd-muted-foreground leading-relaxed mt-auto pt-4">Global geographic coverage. Citations available for {stats.withCitation} records.</p>
        </div>
        <div className="flex flex-col p-6 gap-2 bg-transparent">
          <span className="text-3xl font-medium tracking-tight text-fd-foreground">{filterOptions.sources.length}</span>
          <h3 className="text-base font-medium text-fd-foreground">Source groups</h3>
          <p className="text-sm text-fd-muted-foreground leading-relaxed mt-auto pt-4 text-balance">Categories preserved: {filterOptions.sources.map((item) => item.label).join(', ')}.</p>
        </div>
      </div>

      <div className="rounded-xl border border-fd-border bg-fd-card p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Search">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Author, journal, subject, summary, DOI"
              className={inputClassName}
            />
          </Field>

          <Field label="Country">
            <select value={country} onChange={(event) => setCountry(event.target.value)} className={inputClassName}>
              <option value="all">All countries</option>
              {filterOptions.countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Source">
            <select value={source} onChange={(event) => setSource(event.target.value)} className={inputClassName}>
              <option value="all">All source groups</option>
              {filterOptions.sources.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Journal">
            <select value={journal} onChange={(event) => setJournal(event.target.value)} className={inputClassName}>
              <option value="all">All journals</option>
              {filterOptions.journals.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Year from">
            <input
              value={yearFrom}
              onChange={(event) => setYearFrom(event.target.value)}
              inputMode="numeric"
              className={inputClassName}
            />
          </Field>

          <Field label="Year to">
            <input
              value={yearTo}
              onChange={(event) => setYearTo(event.target.value)}
              inputMode="numeric"
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            onClick={resetFilters}
          >
            Reset filters
          </button>
          <span className="text-sm text-fd-muted-foreground">
            The explorer runs on a local static dataset and does not call the original backend at runtime.
          </span>
        </div>
      </div>

      <Tabs items={['Browse records', 'Patterns']} defaultIndex={0}>
        <Tab>
          {filteredStudies.length === 0 ? (
            <Card title="No matching records" description="Adjust the filters or broaden the search terms." />
          ) : (
            <>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={smallMetaClassName}>Results: {filteredStudies.length}</span>
                <span className={smallMetaClassName}>
                  Years: {String(filteredStats.yearMin)} to {String(filteredStats.yearMax)}
                </span>
                <span className={smallMetaClassName}>
                  Countries: {String(filteredStats.countries)}
                </span>
              </div>

              <Accordions type="single" collapsible className="mt-4">
                {filteredStudies.map((study) => {
                  const href = getStudyLink(study);
                  const title = getStudyTitle(study) || study.journal || study.author || study.id;

                  return (
                    <Accordion key={study.id} title={title}>
                      <div className="flex flex-col gap-4 pb-1">
                        <div className="flex flex-wrap gap-2">
                          <span className={smallMetaClassName}>{getSourceLabel(study.source)}</span>
                          {study.country ? <span className={smallMetaClassName}>{study.country}</span> : null}
                          {study.journal ? <span className={smallMetaClassName}>{study.journal}</span> : null}
                          {study.year ? <span className={smallMetaClassName}>{study.year}</span> : null}
                        </div>

                        <dl className="grid gap-3 md:grid-cols-2">
                          <DetailRow label="Subject" value={study.subject} />
                          <DetailRow label="Author" value={study.author} />
                          <DetailRow label="Journal" value={study.journal} />
                          <DetailRow label="Research area" value={study.domain} />
                          <DetailRow label="Summary" value={study.summary} />
                          <DetailRow label="Citation" value={study.citation} />
                          <DetailRow
                            label="DOI"
                            value={
                              href ? (
                                <a href={href} target="_blank" rel="noreferrer" className="underline">
                                  {study.doi}
                                </a>
                              ) : (
                                study.doi
                              )
                            }
                          />
                        </dl>
                      </div>
                    </Accordion>
                  );
                })}
              </Accordions>
            </>
          )}
        </Tab>

        <Tab>
          <Cards className="grid-cols-1 lg:grid-cols-3">
            <RankList title="Top countries" items={topCountries} />
            <RankList title="Top journals" items={topJournals} />
            <RankList title="Top subjects" items={topSubjects} />
          </Cards>
        </Tab>
      </Tabs>
    </section>
  );
}
