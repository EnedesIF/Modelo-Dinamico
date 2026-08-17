import { describe, expect, it } from "vitest";
import { projectGroupProgress } from "../shared/groupProgress";

describe("projectGroupProgress", () => {
  it("expõe apenas indicadores agregados e identifica o grupo conectado", () => {
    const result = projectGroupProgress([{ id: 7, name: "Grupo Atlas", progress: 62, qualityScore: 70, qualityLevel: "Consistente", lastSavedAt: new Date("2026-08-14T12:00:00Z"), metaReports: [{ metaIndex: 0, progress: 80, score: 74 }] }], 7);

    expect(result[0]).toEqual({ isCurrentGroup: true, name: "Grupo Atlas", progress: 62, qualityScore: 70, qualityLevel: "Consistente", lastSavedAt: new Date("2026-08-14T12:00:00Z"), metaReports: [{ metaIndex: 0, progress: 80, score: 74 }] });
    expect(Object.keys(result[0]!)).not.toContain("members");
    expect(Object.keys(result[0]!)).not.toContain("document");
  });
});
