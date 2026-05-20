"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BuscaConteudo() {

  const searchParams = useSearchParams();

  const router = useRouter();

  const query = searchParams.get("q") || "";

  const [itensBusca, setItensBusca] =
    useState([]);

  const [resultados, setResultados] =
    useState([]);

  // =========================================
  // PRODUTOS FIXOS
  // =========================================

  const produtosFixos = [
    {
      id: "1",
      nome: "Colar Bolhas",
      descricao:
        "colar com bolhas delicadas",

      imagem: "/colar-bolhas.png",

      tipo: "produto",

      link: "/produto/1"
    },

    {
      id: "2",
      nome: "Colar Musgo",
      descricao:
        "inspiração natural verde musgo",

      imagem: "/colar-musgo.png",

      tipo: "produto",

      link: "/produto/2"
    },

    {
      id: "3",
      nome: "Moranguito",
      descricao:
        "colar com pedra vermelha delicada",

      imagem: "/moranguito.png",

      tipo: "produto",

      link: "/produto/3"
    },

    {
      id: "4",
      nome: "Tesouro Tropical",
      descricao:
        "cores vibrantes tropicais",

      imagem: "/tropical.png",

      tipo: "produto",

      link: "/produto/4"
    }
  ];

  // =========================================
  // CARREGAR TUDO
  // =========================================

  useEffect(() => {

    const carregarTudo = async () => {

      try {

        const res = await fetch(
          "https://parseapi.back4app.com/classes/Produto",
          {
            headers: {
              "X-Parse-Application-Id":
                "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",

              "X-Parse-REST-API-Key":
                "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
            },
          }
        );

        const data = await res.json();

        // =========================================
        // PRODUTOS ADMIN
        // =========================================

        const produtosAdmin =
          (data.results || []).map(p => ({
            id: p.objectId,

            nome: p.nome || "",

            descricao: p.desc || "",

            imagem:
              p.img && p.img !== ""
                ? p.img
                : "/logo(lutb).png",

            tipo: "produto",

            link:
              `/produto/${p.objectId}`
          }));

        // =========================================
        // CATEGORIAS
        // =========================================

        const categorias =
          JSON.parse(
            localStorage.getItem("categorias")
          ) || [];

        const categoriasFormatadas =
          categorias.map(c => ({
            id: c.id,

            nome: c.nome || "",

            descricao:
              c.produtos
                ?.map(p => p.nome)
                .join(" ") || "",

            imagem:
              c.imagem ||
              "/logo(lutb).png",

            tipo: "categoria",

            link:
              `/categoria/${c.nome.toLowerCase()}`
          }));

        // =========================================
        // COLEÇÕES
        // =========================================

        const colecoes =
          JSON.parse(
            localStorage.getItem("colecoes")
          ) || [];

        const colecoesFormatadas =
          colecoes.map(c => ({
            id: c.id,

            nome: c.nome || "",

            descricao:
              c.produtos
                ?.map(p => p.nome)
                .join(" ") || "",

            imagem:
              c.imagem ||
              "/logo(lutb).png",

            tipo: "coleção",

            link:
              `/colecao/${c.nome.toLowerCase()}`
          }));

        // =========================================
        // JUNTAR TUDO
        // =========================================

        setItensBusca([

          ...produtosFixos,

          ...produtosAdmin,

          ...categoriasFormatadas,

          ...colecoesFormatadas

        ]);

      } catch (err) {

        console.error(
          "Erro ao carregar itens:",
          err
        );
      }
    };

    carregarTudo();

  }, []);

  // =========================================
  // BUSCA
  // =========================================

  useEffect(() => {

    if (
      !query ||
      itensBusca.length === 0
    ) {

      setResultados([]);

      return;
    }

    const termo =
      query.toLowerCase().trim();

    const comecaNome = [];

    const contemNome = [];

    const contemDescricao = [];

    itensBusca.forEach(item => {

      const nome =
        item.nome.toLowerCase();

      const desc =
        item.descricao.toLowerCase();

      // =========================================
      // PRIORIDADE 1
      // =========================================

      if (nome.startsWith(termo)) {

        comecaNome.push(item);
      }

      // =========================================
      // PRIORIDADE 2
      // =========================================

      else if (
        nome.includes(termo)
      ) {

        contemNome.push(item);
      }

      // =========================================
      // PRIORIDADE 3
      // Apenas produtos pela descrição
      // =========================================

      else if (
        item.tipo === "produto" &&
        desc.includes(termo)
      ) {

        contemDescricao.push(item);
      }
    });

    setResultados([

      ...comecaNome,

      ...contemNome,

      ...contemDescricao

    ]);

  }, [query, itensBusca]);

  return (
    <div style={{ padding: "20px" }}>

      {/* VOLTAR */}

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

      <h2>
        Resultados para: "{query}"
      </h2>

      {/* SEM RESULTADOS */}

      {resultados.length === 0 ? (

        <div style={{
          marginTop: "40px",
          textAlign: "center",
          color: "#777"
        }}>
          <img
            src="/empty.png"
            style={{
              width: "150px",
              opacity: 0.6
            }}
          />

          <p>
            Nenhum resultado encontrado 😢
          </p>
        </div>

      ) : (

        <div style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "15px"
        }}>

          {resultados.map(item => (

            <div
              key={`${item.tipo}-${item.id}`}

              onClick={() =>
                router.push(item.link)
              }

              style={{
                background: "white",
                borderRadius: "15px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.1)",

                cursor: "pointer",

                overflow: "hidden"
              }}
            >

              <img
                src={item.imagem}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "contain"
                }}
              />

              <div style={{
                padding: "10px"
              }}>

                <div style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "10px"
                }}>

                  <h3>
                    {item.nome}
                  </h3>

                  <span style={{
                    fontSize: "11px",
                    fontStyle: "italic",
                    color: "#777"
                  }}>
                    {item.tipo}
                  </span>

                </div>

                <p style={{
                  fontSize: "14px",
                  color: "#555"
                }}>
                  {item.descricao}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}