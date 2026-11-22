const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Formats a publication date. The corpus uses `dd-mm-yyyy` while the API
 * contract uses ISO `yyyy-mm-dd`, so both are accepted.
 */
export function formatDate(value?: string): string {
  if (!value) return 'Tanggal tidak tersedia';

  const trimmed = value.trim();

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    const [, year, month, day] = iso;
    return `${Number(day)} ${MONTHS_ID[Number(month) - 1]} ${year}`;
  }

  const dmy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(trimmed);
  if (dmy) {
    const [, day, month, year] = dmy;
    const monthIndex = Number(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${Number(day)} ${MONTHS_ID[monthIndex]} ${year}`;
    }
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getDate()} ${MONTHS_ID[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }

  return trimmed;
}

/** Returns an ISO `yyyy-mm-dd` string when the date can be parsed. */
export function toIsoDate(value?: string): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) return trimmed;

  const dmy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(trimmed);
  if (dmy) {
    const [, day, month, year] = dmy;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);

  return undefined;
}

/** Extracts the 4-digit year from a date string. */
export function extractYear(value?: string): string | undefined {
  if (!value) return undefined;
  const iso = toIsoDate(value);
  if (iso) return iso.slice(0, 4);
  const match = /\b(19\d\d|20\d\d)\b/.exec(value);
  return match ? match[1] : undefined;
}

/** Splits a document body into readable paragraphs. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Formats a relevance score for display. */
export function formatScore(score?: number): string {
  if (typeof score !== 'number' || !Number.isFinite(score)) return '—';
  if (score >= 1) return score.toFixed(2);
  return score.toFixed(4).replace(/0+$/, '').replace(/\.$/, '.0');
}

/** Trims a URL for display, keeping the host and the tail of the path. */
export function prettyUrl(url?: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const tail = parsed.pathname.replace(/\/$/, '').split('/').filter(Boolean).pop();
    return tail ? `${parsed.hostname}/…/${tail}` : parsed.hostname;
  } catch {
    return url;
  }
}
