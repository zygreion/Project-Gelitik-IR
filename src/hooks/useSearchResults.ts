import { useCallback, useEffect, useState } from 'react';
import { searchDocuments } from '../services/searchService';
import { SearchError, type SearchFilters, type SearchResponse } from '../types/search';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseSearchResults {
  status: SearchStatus;
  data: SearchResponse | null;
  error: string | null;
  retry: () => void;
}

interface SearchState {
  /** Identifies the request the state belongs to (query + filters + attempt). */
  key: string;
  status: SearchStatus;
  data: SearchResponse | null;
  error: string | null;
}

const EMPTY_STATE: SearchState = { key: '', status: 'idle', data: null, error: null };

/**
 * Runs a search whenever the query or filters change and exposes the loading, empty
 * and error states the UI needs. The status is derived from the request key
 * so a new query or filter immediately reads as "loading" without a cascading render.
 */
export function useSearchResults(query: string, filters?: SearchFilters): UseSearchResults {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<SearchState>(EMPTY_STATE);

  const trimmed = query.trim();
  const sourcesKey = filters?.sources ? [...filters.sources].sort().join(',') : '';
  const sortKey = filters?.sort ?? 'relevance';
  const yearKey = filters?.year ?? 'all';
  const key = [trimmed, attempt, sortKey, yearKey, sourcesKey].join('~');

  useEffect(() => {
    if (!trimmed) return;

    const controller = new AbortController();
    let active = true;

    searchDocuments(trimmed, filters, undefined, controller.signal)
      .then((response) => {
        if (!active) return;
        setState({ key, status: 'success', data: response, error: null });
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        const message =
          err instanceof SearchError
            ? err.message
            : 'Terjadi kesalahan yang tidak terduga saat menjalankan pencarian.';
        setState({ key, status: 'error', data: null, error: message });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [trimmed, key, filters]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  if (!trimmed) {
    return { status: 'idle', data: null, error: null, retry };
  }

  if (state.key !== key) {
    return { status: 'loading', data: null, error: null, retry };
  }

  return { status: state.status, data: state.data, error: state.error, retry };
}
