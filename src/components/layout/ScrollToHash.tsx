import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the element referenced by the URL hash after navigation. */
export function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return null;
}
