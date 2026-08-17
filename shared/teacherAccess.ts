/** Determina quem pode configurar ou acompanhar uma turma já assumida. */
export function canManageActivity(ownerId: number | null, requesterId: number, requesterIsAdmin: boolean) {
  return ownerId === null || ownerId === requesterId || requesterIsAdmin;
}
