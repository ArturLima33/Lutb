"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BuscaConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [resultados, setResultados] = useState([]);

  // 🔹 PRODUTOS LOCAIS (garante funcionamento)
  const produtos = [
    {
      id: "1",
      nome: "Colar Bolhas",
      descricao: "colar com bolhas delicadas",
      imagem: "/colar-bolhas.png"
    },
    {
      id: "2",
      nome: "Colar Musgo",
      descricao: "inspiração natural verde musgo",
      imagem: "/colar-musgo.png"
    },
    {
      id: "3",
      nome: "Moranguito",
      descricao: "colar com pedra vermelha delicada",
      imagem: "/moranguito.png"
    },
    {
      id: "4",
      nome: "Tesouro Tropical",
      descricao: "cores vibrantes tropicais",
      imagem: "/tropical.png"
    }
  ];

  useEffect(() => {
    if (!query) {
      setResultados([]);
      return;
    }

    const termo = query.toLowerCase().trim();

    const nomeMatch = [];
    const descricaoMatch = [];

    produtos.forEach(p => {
      const nome = p.nome.toLowerCase();
      const descricao = p.descricao.toLowerCase();

      if (nome.includes(termo)) {
        nomeMatch.push(p);
      } else if (descricao.includes(termo)) {
        descricaoMatch.push(p);
      }
    });

    setResultados([...nomeMatch, ...descricaoMatch]);

  }, [query]);

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔙 VOLTAR (igual produto) */}
      <button
        onClick={() => router.back()}
        style={{
          background: "none",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          marginBottom: "10px"
        }}
      >
        ←
      </button>

      <h2>Resultados para: "{query}"</h2>

      {/* ❌ SEM RESULTADO */}
      {resultados.length === 0 ? (
        <div style={{
          marginTop: "40px",
          textAlign: "center",
          color: "#777"
        }}>
          <img src="/empty.png" style={{ width: "150px", opacity: 0.6 }} />
          <p>Nenhum produto encontrado 😢</p>
        </div>
      ) : (

        /* ✅ RESULTADOS */
        <div style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px"
        }}>
          {resultados.map(p => (
            <div
              key={p.id}
              onClick={() => router.push(`/produto/${p.id}`)}
              style={{
                background: "white",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                cursor: "pointer",
                overflow: "hidden"
              }}
            >

              <img
                src={p.imagem}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover"
                }}
              />

              <div style={{ padding: "10px" }}>
                <h3 style={{ margin: "5px 0" }}>{p.nome}</h3>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  {p.descricao}
                </p>
              </div>

            </div>
          ))}
        </div>

      )}
    </div>
  );
}