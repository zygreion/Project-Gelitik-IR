/**
 * Shared search domain types.
 *
 * The wire format below is the PROVISIONAL contract agreed with the backend
 * team. The service layer normalises incoming payloads so the UI keeps
 * working if the IR model returns slightly different field names
 * (e.g. `media` instead of `source`, `text` instead of `content`).
 */

export interface SearchRequest {
  query: string;
  top_k?: number;
}

/** A single ranked document, as rendered by the results list. */
export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  source?: string;
  author?: string;
  date?: string;
  url?: string;
  score?: number;
  topic?: string;
}

/** A document opened from the results list. */
export interface DocumentDetail {
  id: string;
  title: string;
  content: string;
  source?: string;
  author?: string;
  date?: string;
  url?: string;
  topic?: string;
}

export interface SearchResponse {
  query: string;
  total_results: number;
  results: SearchResult[];
}

/**
 * A record in the demo corpus. It mirrors the project corpus schema
 * (`doc_id, title, date, media, topic, url, author, text`) so the demo data
 * and the live API stay aligned.
 */
export interface MockDocument {
  id: string;
  title: string;
  date: string;
  media: string;
  topic: string;
  url: string;
  author: string;
  text: string;
}

export interface RawMockDocument {
  doc_id: string;
  title: string;
  date: string;
  media: string;
  topic: string;
  url: string;
  author: string;
  text: string[];
}

export interface SearchFilters {
  sort: SortOption;
  sources: string[];
}

export type SortOption = 'relevance' | 'newest' | 'oldest';

export const DEFAULT_TOP_K = 10;

/** Normalised error surfaced to the UI by the service layer. */
export class SearchError extends Error {
  readonly status?: number;
  readonly isNetworkError: boolean;

  constructor(message: string, options: { status?: number; isNetworkError?: boolean } = {}) {
    super(message);
    this.name = 'SearchError';
    this.status = options.status;
    this.isNetworkError = options.isNetworkError ?? false;
  }
}
