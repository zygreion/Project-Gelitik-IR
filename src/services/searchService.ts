/**
 * Single point of contact between the UI and the IR backend.
 *
 * Components never call `fetch` directly. They call the functions exported
 * here, which decide whether to serve the local demo corpus or the live API
 * based on `VITE_USE_MOCK_DATA`.
 */

import { getMockDocument, runMockSearch } from '../data/mockResults';
import {
  DEFAULT_TOP_K,
  SearchError,
  type DocumentDetail,
  type SearchRequest,
  type SearchResponse,
  type SearchResult,
} from '../types/search';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '');

/**
 * Mock mode is the default so the app is usable straight after `npm install`.
 * The UI shows a persistent demo banner whenever it is active, and mock data
 * is NEVER substituted for a failed real API call.
 */
export const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

const MOCK_LATENCY_MS = 450;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asScore(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

/**
 * Maps a raw API payload onto our domain types. Field aliases are accepted so
 * the UI survives minor divergences from the provisional contract.
 */
function normaliseResult(raw: Record<string, unknown>, index: number): SearchResult {
  const id = raw.id ?? raw.doc_id ?? raw.document_id ?? `result-${index + 1}`;
  const body = asString(raw.text) ?? asString(raw.content) ?? asString(raw.body) ?? '';

  return {
    id: String(id),
    title: asString(raw.title) ?? 'Untitled document',
    snippet: asString(raw.snippet) ?? asString(raw.excerpt) ?? body.slice(0, 260),
    source: asString(raw.source) ?? asString(raw.media) ?? asString(raw.publisher),
    author: asString(raw.author),
    date: asString(raw.date) ?? asString(raw.published_at) ?? asString(raw.pub_date),
    url: asString(raw.url) ?? asString(raw.link),
    score: asScore(raw.score) ?? asScore(raw.relevance_score),
    topic: asString(raw.topic),
  };
}

function normaliseResponse(raw: unknown, fallbackQuery: string): SearchResponse {
  const payload = (raw ?? {}) as Record<string, unknown>;
  const rawResults = Array.isArray(payload.results)
    ? payload.results
    : Array.isArray(payload.documents)
      ? payload.documents
      : [];

  const results = rawResults
    .filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null)
    .map((entry, index) => normaliseResult(entry, index));

  const total = payload.total_results ?? payload.total ?? payload.count;

  return {
    query: asString(payload.query) ?? fallbackQuery,
    total_results: typeof total === 'number' ? total : results.length,
    results,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      ...init,
    });
  } catch {
    throw new SearchError(
      'Tidak dapat terhubung ke server pencarian. Periksa koneksi Anda lalu coba lagi.',
      { isNetworkError: true },
    );
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = typeof body?.detail === 'string' ? body.detail : '';
    } catch {
      detail = '';
    }
    throw new SearchError(
      detail || `Server pencarian merespons dengan status ${response.status}.`,
      { status: response.status },
    );
  }

  return (await response.json()) as T;
}

/**
 * Executes a search against either the demo corpus or the live IR API.
 */
export async function searchDocuments(
  query: string,
  topK: number = DEFAULT_TOP_K,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new SearchError('Kata kunci pencarian tidak boleh kosong.');
  }

  if (IS_MOCK_MODE) {
    await delay(MOCK_LATENCY_MS);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const request: SearchRequest = { query: trimmed, top_k: topK };
    return runMockSearch(request);
  }

  const payload = await request<unknown>('/search', {
    method: 'POST',
    body: JSON.stringify({ query: trimmed, top_k: topK }),
    signal,
  });

  return normaliseResponse(payload, trimmed);
}

/**
 * Fetches the full body of a single document.
 */
export async function fetchDocument(id: string, signal?: AbortSignal): Promise<DocumentDetail> {
  if (IS_MOCK_MODE) {
    await delay(MOCK_LATENCY_MS / 2);
    const doc = getMockDocument(id);
    if (!doc) {
      throw new SearchError(`Dokumen dengan id "${id}" tidak ditemukan.`, { status: 404 });
    }
    return doc;
  }

  const payload = (await request<unknown>(`/documents/${encodeURIComponent(id)}`, { signal })) as
    | Record<string, unknown>
    | undefined;
  const record = (payload?.document ?? payload ?? {}) as Record<string, unknown>;
  const normalised = normaliseResult(record, 0);

  return {
    id: normalised.id,
    title: normalised.title,
    content: asString(record.text) ?? asString(record.content) ?? asString(record.body) ?? '',
    source: normalised.source,
    author: normalised.author,
    date: normalised.date,
    url: normalised.url,
    topic: normalised.topic,
  };
}
