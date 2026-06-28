import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(() => ({ isAuthenticated: false, login: jest.fn(), logout: jest.fn() })),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: { signIn: jest.fn(), signUp: jest.fn() },
}));

// eslint-disable-next-line react/display-name
jest.mock("@/components/Header", () => () => <div data-testid="mock-header" />);

import SignIn from "@/app/signin/page";
import SignUp from "@/app/signup/page";

it("SignIn deve exibir 'Email é obrigatório' ao submeter formulário com e-mail vazio", async () => {
  render(<SignIn />);

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
  });

  await waitFor(() => {
    expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
  });
});

it("SignUp deve exibir 'As senhas não coincidem' quando as senhas são diferentes", async () => {
  render(<SignUp />);

  fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
    target: { value: "usuario@example.com" },
  });

  const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
  fireEvent.change(passwordInput, { target: { value: "ValidPass1@!" } });
  fireEvent.change(confirmInput, { target: { value: "OutraSenha1@!" } });

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));
  });

  await waitFor(() => {
    expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();
  });
});
