"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BuscaConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [produtos, setProdutos] = useState([]);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    fetch("/api/produtos") // ou sua API atual
      .then(res => res.json())
      .then(data => setProdutos(data));
  }, []);

  useEffect(() => {
    if (!query) return;

    const termo = query.toLowerCase();

    const nomeMatch = produtos.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );

    const descricaoMatch = produtos.filter(p =>
      p.descricao?.toLowerCase().includes(termo) &&
      !p.nome.toLowerCase().includes(termo)
    );

    setResultados([...nomeMatch, ...descricaoMatch]);
  }, [query, produtos]);

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔙 BOTÃO VOLTAR */}
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: "15px",
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        ← Voltar
      </button>

      <h2>Resultados para: "{query}"</h2>

      {resultados.length === 0 ? (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <img src="/empty.png" style={{ width: "150px", opacity: 0.6 }} />
          <p style={{ marginTop: "10px" }}>Nenhum produto encontrado...</p>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {resultados.map(produto => (
            <Link key={produto.id} href={`/produto/${produto.id}`} style={{
              display: "block",
              padding: "10px",
              borderBottom: "1px solid #eee",
              textDecoration: "none",
              color: "black"
            }}>
              <strong>{produto.nome}</strong>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {produto.descricao}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}