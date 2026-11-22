import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../brand/Logo';

const NAV_ITEMS = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang', to: '/#tentang' },
  { label: 'Cara Kerja', to: '/#cara-kerja' },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" aria-label="GELITIK — beranda">
          <Logo size={32} withTag />
        </Link>

        <nav className="site-nav" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => {
            const isActive = item.to === '/' && pathname === '/';
            return (
              <Link
                key={item.label}
                to={item.to}
                className={isActive ? 'is-active' : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
