# GELITIK — Google Politik

Antarmuka depan (frontend) untuk proyek Information Retrieval **GELITIK**: mesin
pencari informasi politik yang menyajikan dokumen relevan berdasarkan
peringkat relevansi dari model IR.

Frontend ini **tidak** menjalankan model IR dan **tidak** terhubung langsung ke
basis data. Seluruh komunikasi ke sisi server berlangsung melalui lapisan
layanan API (`src/services/searchService.ts`).

---

## 1. Tumpukan Teknologi

| Komponen | Versi / Keterangan |
| --- | --- |
| React | 19 (TypeScript) |
| Vite | 8 |
| TypeScript | 7 |
| React Router | 7 (`react-router-dom`) |
| Lucide React | ikon SVG |
| CSS | CSS biasa dengan design token di `src/styles/globals.css` |

---

## 2. Instalasi

```bash
npm install
```

Buat berkas `.env` dari contoh yang disediakan:

```bash
cp .env.example .env      # Windows PowerShell: copy .env.example .env
```

---

## 3. Menjalankan Proyek

```bash
npm run dev       # server pengembangan (http://localhost:5173)
npm run build     # build produksi ke folder dist/
npm run preview   # menjalankan hasil build
npm run lint      # pemeriksaan statis (oxlint)
```

---

## 4. Mode Demo vs Mode API Nyata

Pemilihan sumber data ditentukan oleh variabel lingkungan
`VITE_USE_MOCK_DATA`, dibaca satu kali di `src/services/searchService.ts`.

| `VITE_USE_MOCK_DATA` | Perilaku |
| --- | --- |
| `true` (nilai bawaan) | Hasil diambil dari korpus demo lokal. Skor relevansi dihitung di peramban dengan kemiripan kosinus TF-IDF sehingga nilainya **dihitung**, bukan dikarang. Banner "Mode demo aktif" selalu tampil di bagian atas. |
| `false` | Permintaan dikirim ke API backend IR sungguhan melalui `VITE_API_BASE_URL`. |

**Aturan penting:** ketika mode API aktif dan permintaan gagal, antarmuka
menampilkan halaman kesalahan dengan tombol *Coba lagi*. Data demo **tidak
pernah** digunakan sebagai pengganti. Mengganti mode cukup mengubah `.env`
lalu menjalankan ulang `npm run dev` — tidak ada komponen UI yang perlu diubah.

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_DATA=false
```

> Basis URL API harus menuju endpoint `POST /api/search`. Jika backend Anda
> membawakan prefiks lain (misalnya `/ir`), sesuaikan nilainya di sini.

---

## 5. Kontrak API Backend (PROVISIONAL)

Kontrak berikut masih perlu dikonfirmasi bersama pengembang backend/model IR
sebelum integrasi produksi.

### 5.1 Pencarian

```http
POST /api/search
Content-Type: application/json

{
  "query": "kebijakan subsidi BBM",
  "top_k": 10
}
```

Respons:

```json
{
  "query": "kebijakan subsidi BBM",
  "total_results": 2,
  "results": [
    {
      "id": 1,
      "title": "Contoh Dokumen",
      "snippet": "Cuplikan dokumen yang relevan…",
      "source": "Contoh Penerbit",
      "date": "2026-10-12",
      "url": "https://example.com/artikel",
      "score": 0.95
    }
  ]
}
```

### 5.2 Detail dokumen

```http
GET /api/documents/{id}
```

```json
{
  "document": {
    "id": 1,
    "title": "Contoh Dokumen",
    "text": "Isi lengkap dokumen…",
    "source": "Contoh Penerbit",
    "author": "Nama Penulis",
    "date": "2026-10-12",
    "url": "https://example.com/artikel",
    "topic": "Politik Indonesia"
  }
}
```

### 5.3 Toleransi terhadap perbedaan field

Lapisan layanan menormalisasi payload sebelum sampai ke komponen UI, sehingga
beberapa nama field alternatif tetap diterima:

| Field UI | Alias yang diterima |
| --- | --- |
| `source` | `media`, `publisher` |
| `snippet` | `excerpt`, atau `text`/`content` yang dipotong |
| `date` | `published_at`, `pub_date` |
| `score` | `relevance_score` |
| `id` | `doc_id`, `document_id` |
| `total_results` | `total`, `count` |

Tanggal dapat dikirim dalam format ISO (`2026-10-12`) maupun format korpus
proyek (`20-08-2026`); keduanya ditampilkan sebagai `20 Agustus 2026`.

### 5.4 Penanganan galat

- Galat jaringan → `SearchError` dengan pesan ramah pengguna.
- Status non-2xx → pesan dari `detail` bila tersedia.
- Halaman dokumen menampilkan status galat dengan aksi muat ulang.

---

## 6. Struktur Proyek

```
src/
  components/
    brand/Logo.tsx
    layout/          Header, Footer, DemoBanner, ScrollToHash
    search/          SearchBar, SearchSuggestions
    results/         SearchResultCard, SearchResultList, SearchFilters
    common/          LoadingState, EmptyState, ErrorState, HighlightedText
  hooks/
    useSearchResults.ts   siklus status: loading / success / error
  pages/
    HomePage.tsx, ResultsPage.tsx, DocumentPage.tsx, NotFoundPage.tsx
  services/
    searchService.ts      satu-satunya titik akses ke backend
  types/
    search.ts             tipe domain pencarian
  data/
    demoCorpus.ts         salinan korpus proyek (data demonstrasi)
    mockResults.ts        mesin peringkat lokal untuk mode demo
  utils/
    format.ts             format tanggal, skor, dan URL
  styles/
    globals.css           design token + seluruh gaya
```

Skema korpus proyek (`IR_C1_2310511141_antara_politik_indonesia.xlsx`) adalah
`doc_id, title, date, media, topic, url, author, text`, dan struktur tersebut
telah dipakai langsung pada tipe data frontend.

---

## 7. Fitur

### Sudah selesai

- Beranda dengan logo, deskripsi, kolom pencarian menonjol, dan kueri contoh statis.
- Halaman hasil pencarian: jumlah hasil, judul, penerbit, penulis, tanggal, cuplikan, skor relevansi, dan tautan dokumen asli.
- Halaman detail dokumen: isi dokumen lengkap, informasi metadata, tombol "Buka dokumen asli", dan konteks kueri.
- Navigasi antar halaman, termasuk tombol "Kembali ke hasil pencarian".
- Validasi input (kueri kosong ditolak dengan pesan galat).
- Status memuat, kosong, dan galat beserta aksi coba lagi.
- Penyaring di sisi peramban: urutan relevansi/terbaru/terlama dan filter penerbit.
- Mode demo dan mode API nyata, dipilih lewat `.env`.
- Tata letak responsif untuk desktop, tablet, dan ponsel.
- Komponen yang dapat dipakai ulang, tipe TypeScript yang lengkap, dan aksesibilitas dasar (label, `aria-*`, skip link, fokus terlihat).

### Menunggu integrasi backend

- Konfirmasi akhir bentuk respons API dan nama field.
- Endpoint detail dokumen `GET /api/documents/{id}` (belum ada di backend).
- Nilai `total_results` yang mencerminkan jumlah total dokumen, bukan hanya jumlah yang dikembalikan.
- Skor relevansi asli dari model IR (mode demo memakai perhitungan lokal sebagai perkiraan).
- Skema tanggal, pagination/`top_k` yang dapat diatur, dan parameter pencarian tambahan bila dibutuhkan.
- Penanganan CORS atau proxy pengembangan antara Vite dan backend.

---

## 8. Catatan

- Halaman "Cara Kerja" dan "Tentang" pada beranda menjelaskan peran antarmuka, model IR, dan perbedaan antara mode demo dan mode API nyata.
- Angka pada mode demo (jumlah hasil, skor) berasal dari korpus 20 dokumen dan dihitung ulang saat kueri berubah.
- `npm run lint` dijalankan sebagai pemeriksaan statis tambahan; pemeriksaan tipe penuh dijalankan oleh `npm run build` melalui `tsc -b`.
