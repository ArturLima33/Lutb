"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BuscaConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [produtos, setProdutos] = useState([]);
  const [resultados, setResultados] = useState([]);

  const produtosFixos = [
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

  // 🔥 CARREGA PRODUTOS DINÂMICOS
  useEffect(() => {
    const carregar = async () => {
      const res = await fetch("https://parseapi.back4app.com/classes/Produto", {
        headers: {
          "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
          "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
        },
      });

      const data = await res.json();

      const dinamicos = (data.results || []).map(p => ({
        id: p.objectId,
        nome: p.nome || "",
        descricao: p.desc || "",
        imagem: p.img && p.img !== "" ? p.img : "/logo(lutb).png"
      }));

      setProdutos([...produtosFixos, ...dinamicos]);
    };

    carregar();
  }, []);

  // 🔍 BUSCA INTELIGENTE
  useEffect(() => {
    if (!query || produtos.length === 0) {
      setResultados([]);
      return;
    }

    const termo = query.toLowerCase().trim();

    const nomeMatch = [];
    const descricaoMatch = [];

    produtos.forEach(p => {
      const nome = p.nome.toLowerCase();
      const desc = p.descricao.toLowerCase();

      if (nome.includes(termo)) {
        nomeMatch.push(p);
      } else if (desc.includes(termo)) {
        descricaoMatch.push(p);
      }
    });

    setResultados([...nomeMatch, ...descricaoMatch]);

  }, [query, produtos]);

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔙 VOLTAR BONITO */}
      <button
        onClick={() => router.back()}
        style={{
          background: "#2D2D2D",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer",
          marginBottom: "15px"
        }}
      >
        ←
      </button>

      <h2>Resultados para: "{query}"</h2>

      {resultados.length === 0 ? (
        <div style={{ marginTop: "40px", textAlign: "center", color: "#777" }}>
          <img src="/empty.png" style={{ width: "150px", opacity: 0.6 }} />
          <p>Nenhum produto encontrado 😢</p>
        </div>
      ) : (
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
                  objectFit: "contain" // 🔥 melhor que cover (sem zoom)
                }}
              />

              <div style={{ padding: "10px" }}>
                <h3>{p.nome}</h3>
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