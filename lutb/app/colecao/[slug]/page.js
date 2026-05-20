"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ColecaoDinamica() {

  const params = useParams();

  const [colecao, setColecao] = useState(null);

  const [modoVisualizacao, setModoVisualizacao] =
    useState("grid");

  useEffect(() => {

    const carregarColecao = async () => {

      const colecoes =
        JSON.parse(
          localStorage.getItem("colecoes")
        ) || [];

      const encontrada = colecoes.find(
        (c) =>
          c.nome.toLowerCase() ===
          decodeURIComponent(params.slug).toLowerCase()
      );

      if (!encontrada) {
        setColecao(null);
        return;
      }

      const produtosFixos = [
        {
          id: "1",
          nome: "Colar Bolhas",
          preco: "25,00",
          img: "/colar-bolhas.png"
        },
        {
          id: "2",
          nome: "Colar Musgo",
          preco: "35,00",
          img: "/colar-musgo.png"
        },
        {
          id: "3",
          nome: "Moranguito",
          preco: "25,00",
          img: "/moranguito.png"
        },
        {
          id: "4",
          nome: "Tesouro Tropical",
          preco: "35,00",
          img: "/tesouro-tropical.png"
        }
      ];

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

      const produtosAdmin =
        (data.results || []).map((p) => ({
          id: p.objectId,
          nome: p.nome,
          preco: p.preco,
          img:
            p.img && p.img !== ""
              ? p.img
              : "/logo(lutb).png"
        }));

      const todosProdutos = [
        ...produtosFixos,
        ...produtosAdmin
      ];

      const produtosCompletos =
        (encontrada.produtos || []).map((produtoSalvo) => {

          const completo = todosProdutos.find(
            (p) =>
              String(p.id) ===
              String(produtoSalvo.id)
          );

          return completo || produtoSalvo;
        });

      setColecao({
        ...encontrada,
        produtos: produtosCompletos
      });
    };

    carregarColecao();

  }, [params.slug]);

  if (!colecao) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center",
        color: "white"
      }}>
        Coleção não encontrada.
      </div>
    );
  }

  return (
    <div style={{
      padding: "40px 20px",
      minHeight: "100vh",
      backgroundColor: "#76BA5B"
    }}>

      <div style={{
        maxWidth: "1100px",
        margin: "0 auto"
      }}>

        <div style={{
          background: "white",
          borderRadius: "25px",
          padding: "25px",
          marginBottom: "25px"
        }}>

          <h1 style={{
            textAlign: "center",
            marginBottom: "10px"
          }}>
            {colecao.nome}
          </h1>

          <p style={{
            textAlign: "center",
            color: "#666"
          }}>
            {colecao.produtos?.length || 0} produto(s)
          </p>

          <p style={{
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "10px",
            fontWeight: "bold",
            color: "#333"
          }}>
            Modo de exibição
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px"
          }}>

            <button
              onClick={() =>
                setModoVisualizacao("grid")
              }
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                background:
                  modoVisualizacao === "grid"
                    ? "#D2691E"
                    : "#ddd",
                color:
                  modoVisualizacao === "grid"
                    ? "white"
                    : "black"
              }}
            >
              Grade
            </button>

            <button
              onClick={() =>
                setModoVisualizacao("lista")
              }
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                background:
                  modoVisualizacao === "lista"
                    ? "#D2691E"
                    : "#ddd",
                color:
                  modoVisualizacao === "lista"
                    ? "white"
                    : "black"
              }}
            >
              Lista
            </button>

          </div>
        </div>

        {!colecao.produtos ||
        colecao.produtos.length === 0 ? (

          <div style={{
            background: "white",
            borderRadius: "25px",
            padding: "30px",
            textAlign: "center"
          }}>
            Nenhum produto nesta coleção.
          </div>

        ) : modoVisualizacao === "grid" ? (

          <div style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}>

            {colecao.produtos.map((produto) => (

              <Link
                key={produto.id}
                href={`/produto/${produto.id}`}
                style={{
                  textDecoration: "none"
                }}
              >

                <div style={{
                  background: "white",
                  borderRadius: "25px",
                  padding: "20px",
                  height: "100%"
                }}>

                  <img
                    src={produto.img}
                    alt={produto.nome}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "contain"
                    }}
                  />

                  <h3 style={{
                    color: "#222",
                    marginTop: "15px"
                  }}>
                    {produto.nome}
                  </h3>

                  <p style={{
                    color: "#D2691E",
                    fontWeight: "bold",
                    fontSize: "20px"
                  }}>
                    {produto.preco
                      ? `R$ ${produto.preco}`
                      : "Preço indisponível"}
                  </p>

                </div>

              </Link>
            ))}

          </div>

        ) : (

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}>

            {colecao.produtos.map((produto) => (

              <Link
                key={produto.id}
                href={`/produto/${produto.id}`}
                style={{
                  textDecoration: "none"
                }}
              >

                <div style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px"
                }}>

                  <img
                    src={produto.img}
                    alt={produto.nome}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "contain"
                    }}
                  />

                  <div>

                    <h3 style={{
                      color: "#222",
                      marginBottom: "5px"
                    }}>
                      {produto.nome}
                    </h3>

                    <p style={{
                      color: "#D2691E",
                      fontWeight: "bold"
                    }}>
                      {produto.preco
                        ? `R$ ${produto.preco}`
                        : "Preço indisponível"}
                    </p>

                  </div>

                </div>

              </Link>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}