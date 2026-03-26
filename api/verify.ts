import { supabase } from "../lib/supabase";

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
  creadaEn?: string; // ✅ Cambiado a string (ISO 8601 / timestamptz)
}

export async function saveFunda(funda: Funda): Promise<void> {
  const { error } = await supabase
    .from("fundas")
    .upsert([funda], { onConflict: "codigo" }); // ✅ upsert en vez de insert

  if (error) {
    console.error("Error guardando funda:", error);
    throw error;
  }
}

export async function verifyQR(code: string): Promise<VerifyResponse> {
  const { data, error } = await supabase
    .from("fundas")
    .select("*")
    .eq("codigo", code)
    .single();

  // ✅ PGRST116 = no rows found (no es un error real, simplemente no existe)
  if (error) {
    if (error.code === "PGRST116") {
      return { valido: false };
    }
    console.error("Error consultando funda:", error);
    throw error;
  }

  if (!data) return { valido: false };

  return {
    valido: true,
    modelo: data.modelo,
    material: data.material,
    proteccion: data.proteccion,
    compatibilidad: data.compatibilidad,
  };
}