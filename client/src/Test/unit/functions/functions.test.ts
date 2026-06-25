import { isEmailValid } from "@/utils/email";
import { isPasswordValid } from "@/utils/password";

// TESTE 1 — SUCESSO
it("isEmailValid deve retornar true para um e-mail válido", () => {
  expect(isEmailValid("usuario@example.com")).toBe(true);
});

it("BUG ❌ isPasswordValid deve retornar true para senha com exatamente 8 caracteres", () => {
  expect(isPasswordValid("Abc123@!")).toBe(true);
});
