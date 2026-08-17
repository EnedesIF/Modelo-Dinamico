export type SupabaseEnvironment = Record<string, string | undefined>;

export function missingSupabaseVariables(env: SupabaseEnvironment) {
  return ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"].filter(key => !env[key]?.trim());
}

export function assertSupabaseVariables(env: SupabaseEnvironment) {
  const missing = missingSupabaseVariables(env);
  if (missing.length) throw new Error(`A conexão com o Supabase ainda não foi configurada. Faltam: ${missing.join(", ")}.`);
}
