import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({
  title = 'Tidak ada hasil ditemukan',
  description = 'Tidak ada dokumen yang cocok dengan kata kunci tersebut. Coba gunakan istilah yang lebih umum.',
  children,
}: EmptyStateProps) {
  return (
    <div className="state">
      <div className="state__icon">
        <SearchX size={24} aria-hidden="true" />
      </div>
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{description}</p>
      {children && <div className="state__actions">{children}</div>}
    </div>
  );
}
