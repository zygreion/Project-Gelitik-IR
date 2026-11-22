import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { ScrollToHash } from './components/layout/ScrollToHash';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { DocumentPage } from './pages/DocumentPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { IS_MOCK_MODE } from './services/searchService';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>

      {IS_MOCK_MODE && <DemoBanner />}
      <Header />

      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<ResultsPage />} />
          <Route path="/document/:id" element={<DocumentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}
