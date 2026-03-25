import { openDB } from "idb";

export interface VerifyResponse {
  valido: boolean;
  modelo?: string;
  material?: string;
  proteccion?: string;
  compatibilidad?: string;
}

export interface Funda {
  codigo: string;
  modelo: string;
  material?: string;
  proteccion?: string;
  compatibilidad?: string;
  creadaEn?: number;
}

// ── DB ────────────────────────────────────────────────────────
const DB_NAME = import.meta.env.VITE_DB_NAME;
const STORE = import.meta.env.VITE_DB_STORE;

function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "codigo" });
      }
    },
  });
}

// ── CRUD ──────────────────────────────────────────────────────

export async function saveFunda(funda: Funda): Promise<void> {
  const db = await getDB();
  await db.put(STORE, { ...funda, creadaEn: Date.now() });
}

export async function getFundas(): Promise<Funda[]> {
  const db = await getDB();
  return db.getAll(STORE);
}

export async function deleteFunda(codigo: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, codigo);
}

// ── VERIFY ────────────────────────────────────────────────────

export async function verifyQR(code: string): Promise<VerifyResponse> {
  const db = await getDB();
  const funda: Funda | undefined = await db.get(STORE, code);

  if (!funda) return { valido: false };

  return {
    valido: true,
    modelo: funda.modelo,
    material: funda.material,
    proteccion: funda.proteccion,
    compatibilidad: funda.compatibilidad,
  };
}
