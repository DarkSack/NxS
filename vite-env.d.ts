// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_ADMIN_USER: string;
  readonly VITE_ADMIN_PASS: string;
  readonly VITE_DB_NAME: string;
  readonly VITE_DB_STORE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}