import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { SearchResultList } from '../components/results/SearchResultList';
import { SearchFilters } from '../components/results/SearchFilters';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { useSearchResults } from '../hooks/useSearchResults';
import { tokenize } from '../data/mockResults';
import { toIsoDate } from '../utils/format';
import type { SearchFilters as Filters } from '../types/search';

const DEFAULT_FILTERS: Filters = { sort: 'relevance', sources: [] };

export function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [inputValue, setInputValue] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const { status, data, error, retry } = useSearchResults(query);

  // Keep the input in sync with the URL query without an extra render pass.
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setInputValue(query);
  }

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

  const visibleResults = useMemo(() => {
    if (!data) return [];

    const filtered =
      filters.sources.length > 0
        ? data.results.filter((result) => result.source && filters.sources.includes(result.source))
        : data.results;

    if (filters.sort === 'relevance') return filtered;

    const withDate = [...filtered].sort((a, b) => {
      const dateA = toIsoDate(a.date) ?? '';
      const dateB = toIsoDate(b.date) ?? '';
      if (dateA === dateB) return 0;
      return filters.sort === 'newest' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
    });

    return withDate;
  }, [data, filters]);

  const sourceList = data?.results ?? [];

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
                title="Tidak ada hasil yang cocok dengan penyaring"
                description={
                  data.results.length > 0
                    ? 'Semua hasil disembunyikan oleh penyaring yang aktif. Coba longgarkan kriteria sumber.'
                    : 'Tidak ada dokumen yang cocok dengan kata kunci tersebut. Coba gunakan istilah yang lebih umum.'
                }
              >
                {data.results.length > 0 && (
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                  >
                    Atur ulang penyaring
                  </button>
                )}
              </EmptyState>
            )}
          </div>

          <div className="results-layout__aside">
            {status === 'success' && sourceList.length > 0 && (
              <SearchFilters results={sourceList} filters={filters} onChange={setFilters} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
