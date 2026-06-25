/**
 * Testes Unitários — Funções Puras (Jest)
 * Arquivo: src/Test/unit/functions/functions.test.ts
 *
 * Teste 1 (SUCESSO) : isEmailValid retorna true para e-mail válido.
 * Teste 2 (BUG ❌)  : isPasswordValid rejeita senha com exatamente 8 caracteres.
 *                     Bug em password.ts linha 2 — usa `<= 8` em vez de `< 8`.
 */

import { isEmailValid } from "@/utils/email";
import { isPasswordValid } from "@/utils/password";

// TESTE 1 — SUCESSO
it("isEmailValid deve retornar true para um e-mail válido", () => {
  expect(isEmailValid("usuario@example.com")).toBe(true);
});

// TESTE 2 — BUG (FALHA ESPERADA)
// Bug: password.ts usa `password.length <= 8`, rejeitando senhas com
// exatamente 8 caracteres, que deveriam ser válidas ("mínimo de 8 caracteres").
// Correção: trocar `<= 8` por `< 8`.
it("BUG ❌ isPasswordValid deve retornar true para senha com exatamente 8 caracteres", () => {
  // "Abc123@!" tem 8 chars, maiúscula, minúscula, número e especial — válida.
  // Este teste FALHARÁ: isPasswordValid retorna false por causa do `<= 8`.
  expect(isPasswordValid("Abc123@!")).toBe(true);
});
