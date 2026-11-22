import { Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <Logo size={30} />
            <p className="site-footer__desc">
              GELITIK (Google Politik) adalah mesin pencari informasi politik yang
              menyajikan dokumen relevan hasil pemeringkatan model Information
              Retrieval.
            </p>
          </div>

          <div>
            <h2 className="site-footer__title">Navigasi</h2>
            <ul className="site-footer__links">
              <li>
                <Link to="/">Beranda</Link>
              </li>
              <li>
                <Link to="/#tentang">Tentang GELITIK</Link>
              </li>
              <li>
                <Link to="/#cara-kerja">Cara Kerja</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="site-footer__title">Sumber Data</h2>
            <p className="site-footer__desc" style={{ marginTop: 0 }}>
              Dokumen pada korpus uji dikumpulkan dari pemberitaan ANTARA dan
              diindeks oleh model IR proyek. Skor relevansi ditampilkan apa
              adanya sesuai keluaran model, bukan estimasi antarmuka.
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>GELITIK — Proyek Information Retrieval, Semester 7.</span>
          <span>Antarmuka demonstrasi, bukan produk berskala.</span>
        </div>
      </div>
    </footer>
  );
}
