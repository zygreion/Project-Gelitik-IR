/**
 * Mock search engine used while VITE_USE_MOCK_DATA=true.
 *
 * The scores produced here are COMPUTED from the demo corpus with a local
 * TF-IDF cosine similarity — they are not hard-coded numbers. Once the real
 * IR backend is connected the same interface is served by the HTTP API and
 * no UI component needs to change.
 */

import { DEMO_CORPUS } from './demoCorpus';
import type {
  DocumentDetail,
  SearchRequest,
  SearchResponse,
  SearchResult,
} from '../types/search';

const STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'pada', 'adalah', 'ini', 'itu',
  'oleh', 'akan', 'dalam', 'tidak', 'juga', 'telah', 'agar', 'atau', 'sudah', 'masih',
  'bisa', 'dapat', 'kembali', 'usai', 'kata', 'saat', 'demi', 'karena', 'sehingga', 'itu',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) ?? 0) + 1);
  }
  return tf;
}

function cosineSimilarity(
  queryTf: Map<string, number>,
  docTf: Map<string, number>,
  idf: Map<string, number>,
): number {
  let dot = 0;
  let queryNorm = 0;
  let docNorm = 0;

  for (const [term, count] of queryTf) {
    const weight = count * (idf.get(term) ?? 1);
    queryNorm += weight * weight;
    const docCount = docTf.get(term);
    if (docCount) {
      dot += weight * docCount * (idf.get(term) ?? 1);
    }
  }
  for (const [term, count] of docTf) {
    const weight = count * (idf.get(term) ?? 1);
    docNorm += weight * weight;
  }

  if (queryNorm === 0 || docNorm === 0) return 0;
  return dot / (Math.sqrt(queryNorm) * Math.sqrt(docNorm));
}

function buildIdf(docTokens: string[][]): Map<string, number> {
  const df = new Map<string, number>();
  for (const tokens of docTokens) {
    for (const term of new Set(tokens)) {
      df.set(term, (df.get(term) ?? 0) + 1);
    }
  }
  const n = docTokens.length;
  const idf = new Map<string, number>();
  for (const [term, freq] of df) {
    idf.set(term, Math.log(1 + n / freq));
  }
  return idf;
}

const DOC_TOKENS = DEMO_CORPUS.map((doc) => [
  ...tokenize(doc.title),
  ...tokenize(doc.text),
]);
const IDF = buildIdf(DOC_TOKENS);

/** Builds a snippet centred on the densest cluster of query terms. */
export function buildSnippet(text: string, terms: string[], length = 260): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (!terms.length) {
    return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat;
  }

  const lower = flat.toLowerCase();
  const positions = terms
    .map((term) => lower.indexOf(term))
    .filter((position) => position >= 0);

  if (!positions.length) {
    return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat;
  }

  const anchor = Math.min(...positions);
  const start = Math.max(0, anchor - Math.floor(length / 3));
  const end = Math.min(flat.length, start + length);
  const snippet = flat.slice(start, end).trim();

  return `${start > 0 ? '…' : ''}${snippet}${end < flat.length ? '…' : ''}`;
}

/** Runs the local ranking over the demo corpus. */
export function runMockSearch(request: SearchRequest): SearchResponse {
  const query = request.query.trim();
  const topK = request.top_k ?? 10;
  const terms = Array.from(new Set(tokenize(query)));

  const queryTf = termFrequency(terms);

  const ranked = DEMO_CORPUS.map((doc, index) => {
    const titleTf = termFrequency(tokenize(doc.title));
    const bodyTf = termFrequency(tokenize(doc.text));

    // Title matches are weighted higher, mirroring standard field weighting.
    const combined = new Map<string, number>();
    for (const [term, count] of bodyTf) combined.set(term, count);
    for (const [term, count] of titleTf) {
      combined.set(term, (combined.get(term) ?? 0) + count * 3);
    }

    return {
      doc,
      score: cosineSimilarity(queryTf, combined, IDF),
      index,
    };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, topK);

  const results: SearchResult[] = ranked.map(({ doc, score }) => ({
    id: doc.id,
    title: doc.title,
    snippet: buildSnippet(doc.text, terms),
    source: doc.media,
    author: doc.author || undefined,
    date: doc.date,
    url: doc.url,
    topic: doc.topic,
    score: Number(score.toFixed(4)),
  }));

  return {
    query,
    total_results: results.length,
    results,
  };
}

/** Looks up a single document in the demo corpus. */
export function getMockDocument(id: string): DocumentDetail | null {
  const doc = DEMO_CORPUS.find((entry) => entry.id === id);
  if (!doc) return null;

  return {
    id: doc.id,
    title: doc.title,
    content: doc.text,
    source: doc.media,
    author: doc.author || undefined,
    date: doc.date,
    url: doc.url,
    topic: doc.topic,
  };
}
