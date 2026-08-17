import { describe, expect, it } from "vitest";
import { isActivityReleased } from "../shared/activity";

describe("liberação da atividade pelo professor", () => {
  it("bloqueia inscrições enquanto não houver professor responsável", () => {
    expect(isActivityReleased({ ownerId: null, isActive: 1 })).toBe(false);
  });

  it("bloqueia inscrições quando o professor ainda mantém a atividade em rascunho", () => {
    expect(isActivityReleased({ ownerId: 7, isActive: 0 })).toBe(false);
  });

  it("libera grupos apenas após configuração e publicação docente", () => {
    expect(isActivityReleased({ ownerId: 7, isActive: 1 })).toBe(true);
  });
});
