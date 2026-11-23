import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { SearchResultList } from '../components/results/SearchResultList';
import { SearchFilters } from '../components/results/SearchFilters';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { useSearchResults } from '../hooks/useSearchResults';
import { tokenize } from '../data/mockResults';
import type { SearchFilters as Filters } from '../types/search';

const DEFAULT_FILTERS: Filters = { sort: 'relevance', year: 'all', sources: [] };

export function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const urlYear = searchParams.get('year') ?? 'all';

  const [inputValue, setInputValue] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    year: searchParams.get('year') ?? 'all',
  }));

  const { status, data, error, retry } = useSearchResults(query, filters);

  // Keep the input in sync with the URL query without an extra render pass.
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setInputValue(query);
  }

  // Keep filters.year in sync with URL if changed externally (e.g. back/forward button)
  if (filters.year !== urlYear) {
    setFilters((prev) => ({ ...prev, year: urlYear }));
  }

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    const nextParams = new URLSearchParams(searchParams);
    if (newFilters.year && newFilters.year !== 'all') {
      nextParams.set('year', newFilters.year);
    } else {
      nextParams.delete('year');
    }
    setSearchParams(nextParams);
  };

  useEffect(() => {
    if (searchParams.has('q')) {
      window.document.title = `GELITIK - ${searchParams.get('q')}`;
    } else {
      window.document.title = 'GELITIK — Pencarian';
    }

    return () => {
      window.document.title = 'GELITIK — Pencarian';
    };
  }, [searchParams]);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setFilters(DEFAULT_FILTERS);
    setSearchParams({ q: trimmed });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const terms = useMemo(() => tokenize(query), [query]);

  const visibleResults = data?.results ?? [];

  const isDefaultFilters =
    filters.sort === 'relevance' &&
    (!filters.year || filters.year === 'all') &&
    filters.sources.length === 0;

  return (
    <main>
      <section className="results-header">
        <div className="container">
          <div className="results-header__row">
            <SearchBar
              value={inputValue}
              onChange={setInputValue}
              onSubmit={submit}
              isLoading={status === 'loading'}
            />
          </div>

          {query && (
            <p className="results-header__meta">
              {status === 'success' && data ? (
                <>
                  Menampilkan <strong>{visibleResults.length}</strong> dari{' '}
                  <strong>{data.total_results}</strong> hasil untuk{' '}
                  <strong>&ldquo;{query}&rdquo;</strong>
                </>
              ) : status === 'loading' ? (
                <>Mencari &ldquo;{query}&rdquo;…</>
              ) : (
                <>Kueri: <strong>&ldquo;{query}&rdquo;</strong></>
              )}
            </p>
          )}
        </div>
      </section>

      <div className="container">
        <div className="results-layout">
          <div>
            {status === 'loading' && <LoadingState />}

            {status === 'error' && <ErrorState description={error ?? undefined} onRetry={retry} />}

            {status === 'idle' && (
              <EmptyState
                title="Masukkan kata kunci pencarian"
                description="Ketik topik yang ingin Anda cari pada kolom di atas, lalu tekan tombol Cari."
              />
            )}

            {status === 'success' && data && visibleResults.length > 0 && (
              <SearchResultList results={visibleResults} terms={terms} query={query} />
            )}

            {status === 'success' && data && visibleResults.length === 0 && (
              <EmptyState
                title="Tidak ada hasil yang cocok"
                description={
                  !isDefaultFilters
                    ? 'Tidak ada dokumen yang cocok dengan kombinasi kata kunci dan penyaring yang aktif. Coba longgarkan kriteria penyaring.'
                    : 'Tidak ada dokumen yang cocok dengan kata kunci tersebut. Coba gunakan istilah yang lebih umum.'
                }
              >
                {!isDefaultFilters && (
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => handleFiltersChange(DEFAULT_FILTERS)}
                  >
                    Atur ulang penyaring
                  </button>
                )}
              </EmptyState>
            )}
          </div>

          <div className="results-layout__aside">
            {Boolean(query) && (
              <SearchFilters filters={filters} onChange={handleFiltersChange} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
