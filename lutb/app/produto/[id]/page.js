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

  useEffect(() => {
    const carregar = async () => {
      // carrega produto principal
      const { data } = await supabase
        .from("Produto")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) return;

      // carrega imagens adicionais
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

      // busca sugestões por coleção
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

      // se não achou por coleção, tenta por categoria
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

      // se ainda não achou, pega 2 produtos aleatórios
      if (idsSugeridos.length === 0) {
        const { data: aleatorios } = await supabase
          .from("Produto")
          .select("*")
          .neq("id", id)
          .limit(2);

        setSugestoes(aleatorios || []);
        return;
      }

      // embaralha e pega só 2
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

  if (!produto) return (
    <p style={{ textAlign: "center", marginTop: "50px" }}>
      Carregando...
    </p>
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

        {/* MÍDIA PRINCIPAL */}
        <div style={{
          width: "100%",
          height: "280px",
          borderRadius: "20px",
          overflow: "hidden",
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Midia
            url={todasImagens[imgAtual]}
            isMain={true}
            style={{ width: "100%", height: "100%" }}
          />
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

        {/* MINIATURAS */}
        {todasImagens.length > 1 && (
          <div style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            {todasImagens.map((url, i) => (
              <Midia
                key={i}
                url={url}
                onClick={() => setImgAtual(i)}
                style={{
                  width: "60px",
                  height: "60px",
                  border: imgAtual === i
                    ? "2px solid #E63946"
                    : "2px solid transparent",
                  borderRadius: "10px",
                  opacity: imgAtual === i ? 1 : 0.6
                }}
              />
            ))}
          </div>
        )}
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

      {/* PRODUTOS QUE TALVEZ GOSTE */}
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
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}>
            {sugestoes.map(s => (
              <Link
                key={s.id}
                href={`/produto/${s.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "25px",
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
                }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "15px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#f5f5f5"
                  }}>
                    <Midia
                      url={s.img || "/logo(lutb).png"}
                      isMain={false}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: "0 0 5px 0",
                      fontFamily: "serif",
                      color: "#E63946",
                      fontSize: "17px"
                    }}>
                      {s.nome}
                    </h4>
                    <p style={{
                      margin: 0,
                      fontWeight: "bold",
                      color: "#2D2D1A",
                      fontSize: "15px"
                    }}>
                      {s.preco ? `R$ ${s.preco}` : "Preço indisponível"}
                    </p>
                  </div>

                  <span style={{
                    fontSize: "22px",
                    color: "#ccc"
                  }}>
                    ›
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}