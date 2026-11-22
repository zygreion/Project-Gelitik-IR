interface LoadingStateProps {
  /** Number of skeleton cards to render. */
  count?: number;
  label?: string;
}

export function LoadingState({ count = 5, label = 'Memuat hasil pencarian…' }: LoadingStateProps) {
  return (
    <div aria-busy="true" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index} aria-hidden="true">
          <div className="skeleton skeleton-line skeleton-line--short" />
          <div className="skeleton skeleton-line skeleton-line--title" />
          <div className="skeleton skeleton-line skeleton-line--body" />
          <div className="skeleton skeleton-line skeleton-line--body" />
        </div>
      ))}
    </div>
  );
}
