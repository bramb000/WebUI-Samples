/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  /** Soft-gate password for Guild + Rocksmith deep case-study body. */
  readonly VITE_CASE_STUDY_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
