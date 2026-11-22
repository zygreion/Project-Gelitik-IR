import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ExternalLink, FileText, Hash, Landmark, User } from 'lucide-react';
import { ErrorState } from '../components/common/ErrorState';
import { fetchDocument } from '../services/searchService';
import { SearchError, type DocumentDetail } from '../types/search';
import { formatDate, toParagraphs } from '../utils/format';

interface DocumentState {
  id: string;
  status: 'loading' | 'success' | 'error';
  document: DocumentDetail | null;
  error: string | null;
}

export function DocumentPage() {
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [state, setState] = useState<DocumentState | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetchDocument(id, controller.signal)
      .then((result) => {
        if (!active) return;
        setState({ id, status: 'success', document: result, error: null });
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        setState({
          id,
          status: 'error',
          document: null,
          error:
            err instanceof SearchError
              ? err.message
              : 'Dokumen tidak dapat dimuat karena terjadi kesalahan.',
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  const status = state?.id === id ? state.status : 'loading';
  const document = state?.id === id ? state.document : null;

  const backTo = query ? `/search?q=${encodeURIComponent(query)}` : '/search';

  return (
    <main className="document">
      <div className="container">
        <Link className="document__back" to={backTo}>
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke hasil pencarian
        </Link>

        {status === 'loading' && (
          <div aria-busy="true" aria-live="polite">
            <span className="sr-only">Memuat dokumen…</span>
            <div className="skeleton skeleton-line skeleton-line--short" />
            <div className="skeleton skeleton-line skeleton-line--title" />
            <div className="skeleton skeleton-line skeleton-line--body" />
            <div className="skeleton skeleton-line skeleton-line--body" />
          </div>
        )}

        {status === 'error' && (
          <ErrorState
            title="Dokumen tidak dapat dimuat"
            description={state?.error ?? undefined}
            onRetry={() => window.location.reload()}
            retryLabel="Muat ulang"
          />
        )}

        {status === 'success' && document && (
          <div className="document__layout">
            <article>
              <h1 className="document__title">{document.title}</h1>

              <div className="document__meta">
                {document.source && (
                  <span className="document__meta-item">
                    <Landmark size={15} aria-hidden="true" />
                    <strong>{document.source}</strong>
                  </span>
                )}
                {document.author && (
                  <span className="document__meta-item">
                    <User size={15} aria-hidden="true" />
                    <strong>{document.author}</strong>
                  </span>
                )}
                {document.date && (
                  <span className="document__meta-item">
                    <CalendarDays size={15} aria-hidden="true" />
                    <strong>{formatDate(document.date)}</strong>
                  </span>
                )}
              </div>

              <div className="document__body">
                {toParagraphs(document.content).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}

                {!document.content.trim() && (
                  <p>
                    Isi lengkap dokumen tidak tersedia pada endpoint ini. Buka dokumen
                    asli pada tautan di samping untuk membaca naskah lengkap.
                  </p>
                )}
              </div>
            </article>

            <aside className="document__aside" aria-label="Informasi dokumen">
              <h2 className="document__aside-title">Detail dokumen</h2>

              <div className="document__aside-row">
                <span>ID</span>
                <span>
                  <Hash size={12} aria-hidden="true" style={{ display: 'inline' }} />{' '}
                  {document.id}
                </span>
              </div>

              {document.topic && (
                <div className="document__aside-row">
                  <span>Topik</span>
                  <span>{document.topic}</span>
                </div>
              )}

              {document.source && (
                <div className="document__aside-row">
                  <span>Penerbit</span>
                  <span>{document.source}</span>
                </div>
              )}

              {document.date && (
                <div className="document__aside-row">
                  <span>Tanggal</span>
                  <span>{formatDate(document.date)}</span>
                </div>
              )}

              {document.url && (
                <a
                  className="btn btn--primary"
                  style={{ marginTop: 14, width: '100%' }}
                  href={document.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <ExternalLink size={15} aria-hidden="true" />
                  Buka dokumen asli
                </a>
              )}

              {query && (
                <p className="document__query">
                  <FileText size={12} aria-hidden="true" style={{ display: 'inline' }} />{' '}
                  Ditemukan melalui kueri <strong>&ldquo;{query}&rdquo;</strong>
                </p>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
