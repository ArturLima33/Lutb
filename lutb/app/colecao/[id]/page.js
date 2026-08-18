"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Midia from "../../components/Midia";
import BotaoAdicionarCarrinho from "../../components/BotaoAdicionarCarrinho";

export default function ColecaoDinamica() {
  const { id } = useParams();
  const [colecao, setColecao] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [ordenacao, setOrdenacao] = useState("");

  useEffect(() => {
    const carregar = async () => {
      const { data: col } = await supabase
        .from("Colecao")
        .select("*")
        .eq("id", id)
        .single();
      setColecao(col);

      const { data: vinculos } = await supabase
        .from("produto_colecao")
        .select("produto_id")
        .eq("colecao_id", id);

      const ids = (vinculos || []).map(v => v.produto_id);
      if (ids.length === 0) return;

      const { data } = await supabase
        .from("Produto")
        .select("*")
        .in("id", ids);
      setProdutos(data || []);
    };
    carregar();
  }, [id]);

  const getPrecoNumero = (preco) => {
    if (!preco) return Infinity;
    const n = parseFloat(preco.toString().replace(",", "."));
    return isNaN(n) ? Infinity : n;
  };

  const produtosOrdenados = [...produtos].sort((a, b) => {
    const pA = getPrecoNumero(a.preco);
    const pB = getPrecoNumero(b.preco);
    if (ordenacao === "preco-asc") return pA - pB;
    if (ordenacao === "preco-desc") return pB - pA;
    if (ordenacao === "novo") return new Date(b.created_at) - new Date(a.created_at);
    if (ordenacao === "antigo") return new Date(a.created_at) - new Date(b.created_at);
    return 0;
  });

  return (
    <div style={{ backgroundColor: "#76BA5B", minHeight: "100vh", padding: "20px" }}>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "15px 30px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", color: "#2D2D1A" }}>
            {colecao?.nome || "Coleção"}
          </h1>
        </div>
      </div>

      {produtos.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <select
            value={ordenacao}
            onChange={e => setOrdenacao(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#2D2D2D",
              color: "white",
              cursor: "pointer"
            }}
          >
            <option value="">Ordenar por</option>
            <option value="preco-asc">Preço: menor → maior</option>
            <option value="preco-desc">Preço: maior → menor</option>
            <option value="novo">Mais recentes</option>
            <option value="antigo">Mais antigos</option>
          </select>
        </div>
      )}

      {produtosOrdenados.length === 0 ? (
        <div style={{ backgroundColor: "white", borderRadius: "25px", padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#555" }}>Nenhum produto nessa coleção ainda.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {produtosOrdenados.map((p) => (
            <div key={p.id} style={{ backgroundColor: "white", borderRadius: "30px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
              <Link href={`/produto/${p.id}`} style={{ textDecoration: "none", color: "inherit", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "180px", height: "180px", marginBottom: "15px", borderRadius: "15px", overflow: "hidden" }}>
                  <Midia url={p.img || "/logo(lutb).png"} isMain={false} style={{ width: "180px", height: "180px" }} />
                </div>
                <h2 style={{ fontSize: "22px", margin: "0 0 10px 0", color: "#333" }}>{p.nome}</h2>
                <p style={{ fontSize: "14px", textAlign: "center", color: "#555", lineHeight: "1.4" }}>{p.descricao || ""}</p>
                <p style={{ fontWeight: "bold", color: "#2D2D1A", marginTop: "8px" }}>
                  {p.preco ? `R$ ${p.preco}` : "Preço indisponível"}
                </p>
              </Link>
              <BotaoAdicionarCarrinho produto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}