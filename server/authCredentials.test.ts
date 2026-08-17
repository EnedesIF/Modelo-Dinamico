import { describe, expect, it } from "vitest";
import { hasValidPasswordLoginCredentials } from "../shared/authCredentials";

describe("credenciais de login da professora", () => {
  it("aceita e-mail válido e senha com pelo menos seis caracteres", () => {
    expect(hasValidPasswordLoginCredentials("professora@instituicao.edu.br", "senha-segura")).toBe(true);
  });

  it("recusa e-mail inválido ou senha curta", () => {
    expect(hasValidPasswordLoginCredentials("professora", "senha-segura")).toBe(false);
    expect(hasValidPasswordLoginCredentials("professora@instituicao.edu.br", "12345")).toBe(false);
  });
});
