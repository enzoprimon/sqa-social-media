import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";
import PostCard from "@/components/PostCard";
import Header from "@/components/Header";

it("PostCard deve renderizar título, corpo do post e botão de curtir", () => {
  const post = {
    id: 1,
    title: "Título do Post",
    body: "Conteúdo do post.",
    liked: false,
    reactions: { likes: 10, dislikes: 2 },
  };

  render(<PostCard post={post} isAuthenticated={true} onLike={jest.fn()} />);

  expect(screen.getByText("Título do Post")).toBeInTheDocument();
  expect(screen.getByText("Conteúdo do post.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /curtir/i })).toBeInTheDocument();
});

it("PostCard deve exibir o número de curtidas e descurtidas do post", () => {
  const post = {
    id: 2,
    title: "Post com Reações",
    body: "Corpo do post.",
    liked: false,
    reactions: { likes: 42, dislikes: 7 },
  };

  render(<PostCard post={post} isAuthenticated={false} onLike={jest.fn()} />);

  expect(screen.getByTestId("likes-count")).toHaveTextContent("42");
  expect(screen.getByTestId("dislikes-count")).toHaveTextContent("7");
});

it("Header deve exibir botões 'Entrar' e 'Criar Conta' quando não autenticado", () => {
  (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, logout: jest.fn() });

  render(<Header />);

  expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
});
