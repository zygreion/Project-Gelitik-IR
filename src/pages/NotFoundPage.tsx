import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <main className="container" style={{ padding: '80px 24px' }}>
      <div className="state">
        <div className="state__icon">
          <Compass size={24} aria-hidden="true" />
        </div>
        <h1 className="state__title">Halaman tidak ditemukan</h1>
        <p className="state__text">
          Alamat yang Anda tuju tidak tersedia pada GELITIK.
        </p>
        <div className="state__actions">
          <Link className="btn btn--primary" to="/">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
