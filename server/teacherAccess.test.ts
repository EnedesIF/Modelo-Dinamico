import { describe, expect, it } from "vitest";
import { canManageActivity } from "../shared/teacherAccess";

describe("acesso docente inicial", () => {
  it("permite que o primeiro usuário autenticado assuma uma turma sem responsável", () => {
    expect(canManageActivity(null, 12, false)).toBe(true);
  });

  it("permite ao professor responsável editar sua própria turma", () => {
    expect(canManageActivity(12, 12, false)).toBe(true);
  });

  it("impede que outro usuário assuma uma turma já configurada", () => {
    expect(canManageActivity(12, 27, false)).toBe(false);
  });

  it("mantém o acesso excepcional de um administrador", () => {
    expect(canManageActivity(12, 27, true)).toBe(true);
  });
});
