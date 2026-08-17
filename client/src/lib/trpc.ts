import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, supabaseConfigured } from "./supabase";

type QueryOptions = { enabled?: boolean; retry?: boolean | number; refetchInterval?: number; staleTime?: number; refetchOnWindowFocus?: boolean };
type MutationOptions<T> = { onSuccess?: (data: T) => void; onError?: (error: Error) => void };

async function request<T>(action: string, input?: unknown): Promise<T> {
  if (!supabaseConfigured) throw new Error("A conexão com o Supabase ainda não foi configurada.");
  const session = await supabase.auth.getSession();
  const response = await fetch(`/api/collaboration?action=${encodeURIComponent(action)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(session.data.session?.access_token ? { Authorization: `Bearer ${session.data.session.access_token}` } : {}) },
    body: JSON.stringify(input ?? {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error ?? "Não foi possível concluir esta operação.");
  return payload.data as T;
}

function queryService<T>(action: string) {
  return { useQuery: (input?: unknown, options?: QueryOptions) => useQuery<T, Error>({ queryKey: ["collaboration", action, input ?? null], queryFn: () => request<T>(action, input), enabled: options?.enabled ?? true, retry: options?.retry, refetchInterval: options?.refetchInterval, staleTime: options?.staleTime, refetchOnWindowFocus: options?.refetchOnWindowFocus }) };
}

function mutationService<T>(action: string) {
  return { useMutation: (options?: MutationOptions<T>) => useMutation<T, Error, unknown>({ mutationFn: input => request<T>(action, input), onSuccess: data => options?.onSuccess?.(data), onError: error => options?.onError?.(error) }) };
}

export const trpc = {
  useUtils: () => {
    const client = useQueryClient();
    const invalidate = (action: string) => () => client.invalidateQueries({ queryKey: ["collaboration", action] });
    return { collaboration: { activity: { invalidate: invalidate("activity") }, teacherDashboard: { invalidate: invalidate("teacherDashboard") }, workspace: { invalidate: invalidate("workspace") }, groupProgress: { invalidate: invalidate("groupProgress") } } };
  },
  collaboration: {
    activity: queryService<any>("activity"), workspace: queryService<any>("workspace"), groupProgress: queryService<any>("groupProgress"), registerGroup: mutationService<any>("registerGroup"), saveWorkspace: mutationService<any>("saveWorkspace"), teacherDashboard: queryService<any>("teacherDashboard"), updateActivity: mutationService<any>("updateActivity"),
  },
};
