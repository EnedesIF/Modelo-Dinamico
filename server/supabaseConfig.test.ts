import { describe, expect, it } from "vitest";
import { assertSupabaseVariables, missingSupabaseVariables } from "../shared/supabaseConfig";

describe("configuração do Supabase", () => {
  it("identifica cada variável obrigatória ausente", () => {
    expect(missingSupabaseVariables({ VITE_SUPABASE_URL: "https://example.supabase.co" })).toEqual([
      "VITE_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
  });

  it("aceita a configuração completa", () => {
    expect(() => assertSupabaseVariables({
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "server-only",
    })).not.toThrow();
  });

  it("considera credenciais com apenas espaços como ausentes", () => {
    expect(missingSupabaseVariables({
      VITE_SUPABASE_URL: "   ",
      VITE_SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
    })).toEqual(["VITE_SUPABASE_URL"]);
  });
});
