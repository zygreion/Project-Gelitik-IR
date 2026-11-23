import { Link } from 'react-router-dom';
import { ExternalLink, Gauge } from 'lucide-react';
import { HighlightedText } from '../common/HighlightedText';
import { formatDate, formatScore, prettyUrl } from '../../utils/format';
import type { SearchResult } from '../../types/search';

interface SearchResultCardProps {
  result: SearchResult;
  terms: string[];
  query: string;
}

export function SearchResultCard({ result, terms, query }: SearchResultCardProps) {
  const meta = [result.source, result.author, result.topic].filter(Boolean);
  const documentHref = `/document/${encodeURIComponent(result.id)}?${new URLSearchParams({ q: query })}`;

  return (
    <article className="result-item">
      <p className="result-item__source">
        {result.source && <strong>{result.source}</strong>}
        {result.author && (
          <>
            {meta.length > 0 && <span className="result-item__dot">·</span>}
            <span>{result.author}</span>
          </>
        )}
        {result.date && (
          <>
            {meta.length > 0 && <span className="result-item__dot">·</span>}
            <span>{formatDate(result.date)}</span>
          </>
        )}
      </p>

      <h2 className="result-item__title">
        <Link to={documentHref}>{result.title}</Link>
      </h2>

      <p className="result-item__snippet">
        <HighlightedText text={result.snippet} terms={terms} />
      </p>

      <div className="result-item__footer">
        {typeof result.score === 'number' && (
          <span
            className="score-badge"
            title="Skor relevansi dari model Information Retrieval"
          >
            <Gauge size={13} aria-hidden="true" />
            {formatScore(result.score)}
          </span>
        )}

        {result.topic && <span className="result-item__source">{result.topic}</span>}

        {result.url && (
          <a
            className="result-item__link"
            href={result.url}
            target="_blank"
            rel="noreferrer noopener"
            title={result.url}
          >
            <ExternalLink size={13} aria-hidden="true" />
            {prettyUrl(result.url)}
          </a>
        )}
      </div>
    </article>
  );
}
