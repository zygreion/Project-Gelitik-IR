import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Pencarian gagal dijalankan',
  description = 'Terjadi kesalahan saat menghubungi server pencarian. Silakan coba kembali.',
  onRetry,
  retryLabel = 'Coba lagi',
}: ErrorStateProps) {
  return (
    <div className="state" role="alert">
      <div className="state__icon state__icon--error">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{description}</p>
      {onRetry && (
        <div className="state__actions">
          <button type="button" className="btn btn--primary" onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            {retryLabel}
          </button>
        </div>
      )}
    </div>
  );
}
