import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Gauge, Landmark } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { SearchBar } from '../components/search/SearchBar';
import { SearchSuggestions } from '../components/search/SearchSuggestions';

const EXAMPLE_QUERIES = [
  'Kebijakan publik Indonesia',
  'Pemilihan umum',
  'Partai politik',
  'Kebijakan pemerintah',
  'Parlemen Indonesia',
];

const FEATURES = [
  {
    icon: Gauge,
    title: 'Peringkatan relevansi',
    text: 'Hasil diurutkan berdasarkan skor relevansi yang dihasilkan model Information Retrieval, bukan urutan bawaan antarmuka.',
  },
  {
    icon: Database,
    title: 'Dokumen bersumber jelas',
    text: 'Setiap hasil mencantumkan penerbit, penulis, tanggal terbit, dan tautan ke dokumen aslinya untuk diverifikasi.',
  },
  {
    icon: Landmark,
    title: 'Konteks kueri',
    text: 'Dokumen yang dibuka dari daftar hasil tetap membawa kueri pencarian sebagai konteks penelusuran.',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="home">
      <div className="container">
        <section className="home__hero">
          <div className="home__logo">
            <Logo size={72} />
          </div>

          <h1 className="home__title">
            Discover <span>Political Information.</span>
          </h1>
          <p className="home__tagline">
            GELITIK menelusuri dokumen politik dan menyajikan yang paling relevan
            melalui model Information Retrieval.
          </p>

          <div className="home__search">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={runSearch}
              size="lg"
              autoFocus
              placeholder="Ketik kata kunci, misalnya: kebijakan subsidi BBM"
            />
          </div>

          <SearchSuggestions queries={EXAMPLE_QUERIES} onSelect={runSearch} />
        </section>

        <section className="home__features" id="cara-kerja" aria-labelledby="cara-kerja-title">
          <h2 id="cara-kerja-title" className="sr-only">
            Cara kerja GELITIK
          </h2>
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article className="feature" key={title}>
              <div className="feature__icon">
                <Icon size={19} aria-hidden="true" />
              </div>
              <h3 className="feature__title">{title}</h3>
              <p className="feature__text">{text}</p>
            </article>
          ))}
        </section>

        <section id="tentang" className="home__features" aria-labelledby="tentang-title">
          <h2 id="tentang-title" className="sr-only">
            Tentang GELITIK
          </h2>
          <article className="feature" style={{ gridColumn: '1 / -1' }}>
            <div className="feature__icon">
              <Landmark size={19} aria-hidden="true" />
            </div>
            <h3 className="feature__title">Tentang GELITIK</h3>
            <p className="feature__text">
              GELITIK (Google Politik) adalah proyek Information Retrieval yang
              mengindeks korpus pemberitaan politik berbahasa Indonesia. Antarmuka
              ini mengakses model IR melalui layanan API; saat mode demo aktif,
              pencytiran memakai korpus contoh proyek dan skor relevansi dihitung
              secara lokal sebagai perkiraan, bukan keluaran model final.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
