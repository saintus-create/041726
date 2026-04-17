import rawData from '@/data/studies.json';

export type StudySource = 'clinical_facts' | 'international_studies' | 'us_ldx_studies';

type RawStudy = {
  _id: string;
  _creationTime: number;
  author?: string;
  citation?: string;
  country?: string;
  doi?: string;
  domain?: string;
  journal?: string;
  source?: StudySource;
  subject?: string;
  summary?: string;
  year?: number | null;
};

type RawStudiesFile = {
  status: 'success';
  value: RawStudy[];
};

export type Study = {
  id: string;
  createdAt: number;
  author?: string;
  citation?: string;
  country?: string;
  doi?: string;
  domain?: string;
  journal?: string;
  source: StudySource;
  subject?: string;
  summary?: string;
  year?: number;
};

const sourceLabels: Record<StudySource, string> = {
  clinical_facts: 'Clinical facts',
  international_studies: 'International studies',
  us_ldx_studies: 'US LDX studies',
};

function normalizeText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeYear(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return Math.round(value);
}

function normalizeStudy(study: RawStudy): Study {
  return {
    id: study._id,
    createdAt: study._creationTime,
    author: normalizeText(study.author),
    citation: normalizeText(study.citation),
    country: normalizeText(study.country),
    doi: normalizeText(study.doi),
    domain: normalizeText(study.domain),
    journal: normalizeText(study.journal),
    source: study.source ?? 'international_studies',
    subject: normalizeText(study.subject),
    summary: normalizeText(study.summary),
    year: normalizeYear(study.year),
  };
}

function compareStudies(a: Study, b: Study) {
  return (
    (b.year ?? 0) - (a.year ?? 0) ||
    (a.country ?? '').localeCompare(b.country ?? '') ||
    (a.journal ?? '').localeCompare(b.journal ?? '') ||
    (a.subject ?? '').localeCompare(b.subject ?? '') ||
    a.id.localeCompare(b.id)
  );
}

const studiesFile = rawData as RawStudiesFile;

export const studies = studiesFile.value.map(normalizeStudy).sort(compareStudies);

function uniqueValues(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

export function getSourceLabel(source: StudySource) {
  return sourceLabels[source] ?? source;
}

export function getStudyStats(items: Study[] = studies) {
  const years = items.map((item) => item.year).filter((item): item is number => typeof item === 'number');
  const countries = new Set(items.map((item) => item.country).filter(Boolean));
  const withCitation = items.filter((item) => item.citation).length;

  return {
    total: items.length,
    countries: countries.size,
    yearMin: years.length > 0 ? Math.min(...years) : undefined,
    yearMax: years.length > 0 ? Math.max(...years) : undefined,
    withCitation,
  };
}

export function getFilterOptions(items: Study[] = studies) {
  return {
    countries: uniqueValues(items.map((item) => item.country)),
    journals: uniqueValues(items.map((item) => item.journal)),
    sources: Object.entries(sourceLabels).map(([value, label]) => ({
      value: value as StudySource,
      label,
    })),
    yearMin: getStudyStats(items).yearMin,
    yearMax: getStudyStats(items).yearMax,
  };
}

export function topCountsBy(items: Study[], selector: (study: Study) => string | undefined, limit = 8) {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = selector(item);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function getStudyLink(study: Study) {
  if (!study.doi) return undefined;
  if (study.doi.startsWith('10.')) return 'https://doi.org/' + study.doi;
  if (study.doi.startsWith('http://') || study.doi.startsWith('https://')) return study.doi;
  return undefined;
}

export function getStudyTitle(study: Study) {
  return [study.year, study.country, study.subject].filter(Boolean).join(' · ');
}
