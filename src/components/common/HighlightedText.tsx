import { Fragment } from 'react';

interface HighlightedTextProps {
  text: string;
  terms: string[];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlights the query terms inside a snippet. Terms are matched
 * case-insensitively on word boundaries where possible.
 */
export function HighlightedText({ text, terms }: HighlightedTextProps) {
  const cleaned = terms.map((term) => term.trim()).filter((term) => term.length > 2);

  if (!cleaned.length) return <>{text}</>;

  const pattern = new RegExp(`(${cleaned.map(escapeRegExp).join('|')})`, 'gi');
  // Separate non-global pattern: a /g regex carries `lastIndex` state and
  // would make `test()` alternate between true and false.
  const isMatch = new RegExp(`^(?:${cleaned.map(escapeRegExp).join('|')})$`, 'i');

  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) =>
        isMatch.test(part) ? (
          <mark key={index}>{part}</mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
