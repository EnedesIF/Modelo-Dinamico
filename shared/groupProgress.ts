/** Projeta somente indicadores comparáveis para a visão coletiva dos grupos. */
export type MetaProgress = { metaIndex: number; progress: number; score: number };
export type GroupProgressSource = { id: number; name: string; progress: number; qualityScore: number; qualityLevel: string; lastSavedAt: Date | null; metaReports: MetaProgress[] };

export function projectGroupProgress(groups: GroupProgressSource[], currentGroupId: number) {
  return groups.map(group => ({
    isCurrentGroup: group.id === currentGroupId,
    name: group.name,
    progress: group.progress,
    qualityScore: group.qualityScore,
    qualityLevel: group.qualityLevel,
    lastSavedAt: group.lastSavedAt,
    metaReports: group.metaReports.map(report => ({ metaIndex: report.metaIndex, progress: report.progress, score: report.score })),
  }));
}
