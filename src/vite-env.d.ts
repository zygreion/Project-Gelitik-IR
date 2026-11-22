/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the IR backend, e.g. "http://localhost:8000/api". */
  readonly VITE_API_BASE_URL?: string;
  /** "true" serves the local demo corpus, "false" calls the real IR API. */
  readonly VITE_USE_MOCK_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
