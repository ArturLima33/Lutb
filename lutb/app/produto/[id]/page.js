"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Midia from "../../components/Midia";
import BotaoAdicionarCarrinho from "../../components/BotaoAdicionarCarrinho";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState(null);
  const [todasImagens, setTodasImagens] = useState([]);
  const [imgAtual, setImgAtual] = useState(0);
  const [sugestoes, setSugestoes] = useState([]);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from("Produto")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) return;

      const { data: imgs } = await supabase
        .from("produto_imagem")
        .select("url")
        .eq("produto_id", id)
        .order("ordem");

      const lista = [
        data.img,
        ...(imgs || []).map(i => i.url)
      ].filter(Boolean);

      setProduto(data);
      setTodasImagens(lista);
      setImgAtual(0);

      // sugestões por coleção
      const { data: vinculosCol } = await supabase
        .from("produto_colecao")
        .select("colecao_id")
        .eq("produto_id", id);

      let idsSugeridos = [];

      if (vinculosCol && vinculosCol.length > 0) {
        const colecaoId = vinculosCol[0].colecao_id;
        const { data: outrosCol } = await supabase
          .from("produto_colecao")
          .select("produto_id")
          .eq("colecao_id", colecaoId)
          .neq("produto_id", id);
        idsSugeridos = (outrosCol || []).map(v => v.produto_id);
      }

      // fallback por categoria
      if (idsSugeridos.length === 0) {
        const { data: vinculosCat } = await supabase
          .from("produto_categoria")
          .select("categoria_id")
          .eq("produto_id", id);

        if (vinculosCat && vinculosCat.length > 0) {
          const categoriaId = vinculosCat[0].categoria_id;
          const { data: outrosCat } = await supabase
            .from("produto_categoria")
            .select("produto_id")
            .eq("categoria_id", categoriaId)
            .neq("produto_id", id);
          idsSugeridos = (outrosCat || []).map(v => v.produto_id);
        }
      }

      // fallback aleatório
      if (idsSugeridos.length === 0) {
        const { data: aleatorios } = await supabase
          .from("Produto")
          .select("*")
          .neq("id", id)
          .limit(2);
        setSugestoes(aleatorios || []);
        return;
      }

      const embaralhados = idsSugeridos
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      const { data: produtosSugeridos } = await supabase
        .from("Produto")
        .select("*")
        .in("id", embaralhados);

      setSugestoes(produtosSugeridos || []);
    };

    carregar();
  }, [id]);

  const irParaAnterior = () => {
    setImgAtual(prev => (prev === 0 ? todasImagens.length - 1 : prev - 1));
  };

  const irParaProxima = () => {
    setImgAtual(prev => (prev === todasImagens.length - 1 ? 0 : prev + 1));
  };

  if (!produto) return (
    <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando...</p>
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px"
    }}>

      {/* VOLTAR */}
      <button
        onClick={() => router.back()}
        style={{
          border: "none",
          background: "none",
          alignSelf: "flex-start",
          cursor: "pointer"
        }}
      >
        <img src="/seta-voltar.png" style={{ width: "50px" }} alt="Voltar" />
      </button>

      {/* CARD PRINCIPAL */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "35px",
        padding: "20px",
        width: "100%",
        maxWidth: "380px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>

        {/* MÍDIA COM SETAS */}
        <div style={{ position: "relative", width: "100%", height: "280px" }}>

          {/* IMAGEM CLICÁVEL */}
          <div
            onClick={() => setLightbox(true)}
            style={{
              width: "100%",
              height: "280px",
              borderRadius: "20px",
              overflow: "hidden",
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "zoom-in"
            }}
          >
            <Midia
              url={todasImagens[imgAtual]}
              isMain={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* SETAS — só aparecem se tiver mais de uma imagem */}
          {todasImagens.length > 1 && (
            <>
              <button
                onClick={irParaAnterior}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.45)",
                  border: "none",
                  color: "white",
                  fontSize: "22px",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2
                }}
              >
                ←
              </button>

              <button
                onClick={irParaProxima}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.45)",
                  border: "none",
                  color: "white",
                  fontSize: "22px",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2
                }}
              >
                →
              </button>

              {/* INDICADOR DE POSIÇÃO */}
              <div style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "6px",
                zIndex: 2
              }}>
                {todasImagens.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setImgAtual(i)}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: i === imgAtual
                        ? "white"
                        : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <h2 style={{
          marginTop: "20px",
          fontFamily: "serif",
          textAlign: "center"
        }}>
          {produto.nome}
        </h2>

        <p style={{
          textAlign: "center",
          color: "#555",
          marginTop: "10px"
        }}>
          {produto.descricao || ""}
        </p>
      </div>

      {/* PREÇO */}
      <div style={{
        background: "linear-gradient(180deg, #9ACD32, #228B22)",
        width: "100%",
        maxWidth: "380px",
        borderRadius: "20px",
        padding: "15px",
        marginTop: "30px",
        textAlign: "center"
      }}>
        <span style={{ fontSize: "36px", fontWeight: "bold" }}>
          {produto.preco ? `R$ ${produto.preco}` : "Preço indisponível"}
        </span>
      </div>

      {/* BOTÃO CARRINHO */}
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <BotaoAdicionarCarrinho produto={produto} />
      </div>

      {/* SUGESTÕES — lado a lado */}
      {sugestoes.length > 0 && (
        <div style={{
          width: "100%",
          maxWidth: "380px",
          marginTop: "40px"
        }}>
          <h3 style={{
            fontFamily: "serif",
            color: "#2D2D1A",
            fontSize: "20px",
            marginBottom: "15px",
            textAlign: "center"
          }}>
            Você também pode gostar
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px"
          }}>
            {sugestoes.map(s => (
              <Link
                key={s.id}
                href={`/produto/${s.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column"
                }}>

                  {/* IMAGEM */}
                  <div style={{
                    width: "100%",
                    aspectRatio: "1",
                    background: "#f5f5f5",
                    overflow: "hidden"
                  }}>
                    <Midia
                      url={s.img || "/logo(lutb).png"}
                      isMain={false}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>

                  {/* TEXTO */}
                  <div style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}>
                    <span style={{
                      fontFamily: "serif",
                      color: "#E63946",
                      fontSize: "15px",
                      fontWeight: "bold",
                      lineHeight: "1.3"
                    }}>
                      {s.nome}
                    </span>
                    <span style={{
                      color: "#2D2D1A",
                      fontSize: "14px",
                      fontWeight: "bold"
                    }}>
                      {s.preco ? `R$ ${s.preco}` : "Indisponível"}
                    </span>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "20px"
          }}
        >
          {/* BOTÃO FECHAR */}
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              fontSize: "24px",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ×
          </button>

          {/* SETA ESQUERDA */}
          {todasImagens.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); irParaAnterior(); }}
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "white",
                fontSize: "28px",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ←
            </button>
          )}

          <img
            src={todasImagens[imgAtual]}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              borderRadius: "15px",
              objectFit: "contain"
            }}
          />

          {/* SETA DIREITA */}
          {todasImagens.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); irParaProxima(); }}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "white",
                fontSize: "28px",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              →
            </button>
          )}
        </div>
      )}

    </div>
  );
}