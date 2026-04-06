"use client";
import { usePathname } from "next/navigation";

export default function Produto() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const produtos = [
    { id: "musgo", nome: "Colar Musgo", descricao: "Inspirado na natureza" },
    { id: "bolhas", nome: "Colar Bolhas", descricao: "Leve e elegante" },
  ];

  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return <h1>Produto não encontrado</h1>;
  }

  return (
    <div>
      <h1>{produto.nome}</h1>
      <p>{produto.descricao}</p>

      <a href="/catalogo">
        <button>Voltar</button>
      </a>
    </div>
  );
}