/** Regra de acesso da turma: somente o professor pode publicar a atividade. */
export function isActivityReleased(activity: { ownerId: number | null; isActive: number }) {
  return Boolean(activity.ownerId && activity.isActive);
}
