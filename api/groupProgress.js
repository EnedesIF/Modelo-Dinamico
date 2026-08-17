export function projectGroupProgress(groups, currentGroupId) {
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
