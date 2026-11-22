import { SearchResultCard } from './SearchResultCard';
import type { SearchResult } from '../../types/search';

interface SearchResultListProps {
  results: SearchResult[];
  terms: string[];
  query: string;
}

export function SearchResultList({ results, terms, query }: SearchResultListProps) {
  return (
    <div className="results-list">
      {results.map((result) => (
        <SearchResultCard key={result.id} result={result} terms={terms} query={query} />
      ))}
    </div>
  );
}
