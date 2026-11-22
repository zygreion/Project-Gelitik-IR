import { useId, useState } from 'react';
import { AlertCircle, Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  size?: 'lg' | 'md';
  autoFocus?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  size = 'md',
  autoFocus = false,
  isLoading = false,
  placeholder = 'Cari informasi politik…',
}: SearchBarProps) {
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    const query = value.trim();
    if (!query) {
      setError('Masukkan kata kunci pencarian terlebih dahulu.');
      return;
    }
    setError(null);
    onSubmit(query);
  };

  return (
    <div style={{ width: "100%" }}>
      <form
        className={[
          "searchbar",
          size === "lg" ? "searchbar--lg" : "",
          error ? "searchbar--invalid" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="search"
        onSubmit={handleSubmit}
        noValidate
      >
        <Search className="searchbar__icon" size={20} aria-hidden="true" />

        <label className="sr-only" htmlFor={inputId}>
          Kata kunci pencarian
        </label>
        <input
          id={inputId}
          className="searchbar__input"
          // type="search"
          type="text"
          value={value}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder={placeholder}
          onChange={(event) => {
            setError(null);
            onChange(event.target.value);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />

        {value && (
          <button
            type="button"
            className="searchbar__clear"
            onClick={() => onChange("")}
            aria-label="Hapus kata kunci"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          className="searchbar__submit"
          disabled={isLoading}
        >
          <Search size={17} aria-hidden="true" />
          <span>Cari</span>
        </button>
      </form>

      {error && (
        <p className="searchbar__error" id={`${inputId}-error`} role="alert">
          <AlertCircle size={15} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
