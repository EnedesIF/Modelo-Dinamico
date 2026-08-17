import { supabase, supabaseConfigured } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!supabaseConfigured) { setLoading(false); return; }
    const current = await supabase.auth.getUser();
    setUser(current.data.user ?? null);
    setError(current.error ? new Error(current.error.message) : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const listener = supabase.auth.onAuthStateChange((_event: unknown, session: { user?: unknown } | null) => { setUser(session?.user ?? null); setLoading(false); });
    return () => listener.data.subscription.unsubscribe();
  }, [refresh]);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    if (!supabaseConfigured) throw new Error("A conexão com o Supabase ainda não foi configurada.");
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) throw new Error(result.error.message);
  }, []);

  const logout = useCallback(async () => {
    if (!supabaseConfigured) return;
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { user, loading, error, isAuthenticated: Boolean(user), refresh, logout, loginWithPassword };
}
