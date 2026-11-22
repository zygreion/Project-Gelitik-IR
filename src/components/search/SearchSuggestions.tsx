interface SearchSuggestionsProps {
  queries: string[];
  onSelect: (query: string) => void;
  label?: string;
}

/**
 * Static example queries. These are curated examples for demonstration and
 * are NOT live trending data.
 */
export function SearchSuggestions({
  queries,
  onSelect,
  label = 'Contoh pencarian',
}: SearchSuggestionsProps) {
  return (
    <div className="home__suggestions">
      <p className="home__suggestions-label">{label}</p>
      <div className="chips">
        {queries.map((query) => (
          <button
            key={query}
            type="button"
            className="chip"
            onClick={() => onSelect(query)}
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
