import { Calendar } from 'lucide-react';
import type { SearchFilters, SearchResult } from '../../types/search';

interface SearchFiltersProps {
  results?: SearchResult[];
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

/* const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevansi' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
]; */

const YEAR_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Semua Tahun' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];

/* const SOURCE_OPTIONS = ['ANTARA', 'IDN Times', 'Kompas']; */

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  /* const handleSort = (sort: SortOption) => onChange({ ...filters, sort }); */
  const handleYear = (year: string) => onChange({ ...filters, year });

  /* const toggleSource = (source: string) => {
    const active = filters.sources.includes(source);
    onChange({
      ...filters,
      sources: active ? filters.sources.filter((entry) => entry !== source) : [...filters.sources, source],
    });
  }; */

  const isDefault =
    filters.sort === 'relevance' &&
    (!filters.year || filters.year === 'all') &&
    filters.sources.length === 0;

  return (
    <aside className="filters" aria-label="Penyaring hasil">
      {/* <div className="filters__group">
        <h2 className="filters__title">
          <ArrowDownUp size={12} aria-hidden="true" style={{ display: 'inline', marginRight: 6 }} />
          Urutkan
        </h2>
        {SORT_OPTIONS.map((option) => (
          <label className="filters__option" key={option.value}>
            <input
              type="radio"
              name="sort"
              value={option.value}
              checked={filters.sort === option.value}
              onChange={() => handleSort(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div> */}

      <div className="filters__group">
        <h2 className="filters__title">
          <Calendar size={12} aria-hidden="true" style={{ display: 'inline', marginRight: 6 }} />
          Tahun
        </h2>
        {YEAR_OPTIONS.map((option) => (
          <label className="filters__option" key={option.value}>
            <input
              type="radio"
              name="year"
              value={option.value}
              checked={(filters.year ?? 'all') === option.value}
              onChange={() => handleYear(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      {/* <div className="filters__group">
        <h2 className="filters__title">
          <Landmark size={12} aria-hidden="true" style={{ display: 'inline', marginRight: 6 }} />
          Sumber
        </h2>
        {SOURCE_OPTIONS.map((source) => (
          <label className="filters__option" key={source}>
            <input
              type="checkbox"
              name="source"
              checked={filters.sources.includes(source)}
              onChange={() => toggleSource(source)}
            />
            <span>{source}</span>
          </label>
        ))}
      </div> */}

      {!isDefault && (
        <button
          type="button"
          className="filters__reset"
          onClick={() => onChange({ sort: 'relevance', year: 'all', sources: [] })}
        >
          Atur ulang penyaring
        </button>
      )}
    </aside>
  );
}
