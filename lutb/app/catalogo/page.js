"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Midia from "../components/Midia";
import BotaoAdicionarCarrinho from "../components/BotaoAdicionarCarrinho";

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [ordenacao, setOrdenacao] = useState("");

  useEffect(() => {
    const carregarProdutos = async () => {
      const { data } = await supabase.from("Produto").select("*").order("created_at", { ascending: false });
      setProdutos(data || []);
    };
    carregarProdutos();
  }, []);

  const getPrecoNumero = (preco) => {
    if (!preco) return Infinity;
    const numero = parseFloat(preco.toString().replace(",", "."));
    return isNaN(numero) ? Infinity : numero;
  };

  const produtosOrdenados = [...produtos].sort((a, b) => {
    const precoA = getPrecoNumero(a.preco);
    const precoB = getPrecoNumero(b.preco);
    if (ordenacao === "preco-asc") return precoA !== precoB ? precoA - precoB : new Date(b.created_at) - new Date(a.created_at);
    if (ordenacao === "preco-desc") return precoA !== precoB ? precoB - precoA : new Date(b.created_at) - new Date(a.created_at);
    if (ordenacao === "novo") return new Date(b.created_at) - new Date(a.created_at);
    if (ordenacao === "antigo") return new Date(a.created_at) - new Date(b.created_at);
    return 0;
  });

  return (
    <div style={{ padding: "0 20px 40px 20px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "10px 30px", width: "fit-content", margin: "0 auto 20px auto", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ margin: 0, fontSize: "20px", color: "#2D2D1A", textAlign: "center" }}>Catálogo</h2>
      </div>
      <div style={{ marginBottom: "25px", display: "flex", justifyContent: "center" }}>
        <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} style={{ padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "#2D2D2D", color: "white", cursor: "pointer" }}>
          <option value="">Ordenar por</option>
          <option value="preco-asc">Preço: menor → maior</option>
          <option value="preco-desc">Preço: maior → menor</option>
          <option value="novo">Mais recentes</option>
          <option value="antigo">Mais antigos</option>
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {produtosOrdenados.map((p) => (
          <div key={p.id} style={{ backgroundColor: "white", borderRadius: "35px", padding: "25px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}>
            <Link href={`/produto/${p.id}`} style={{ textDecoration: "none", color: "inherit", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "180px", height: "180px", marginBottom: "15px", borderRadius: "15px", overflow: "hidden" }}>
                <Midia url={p.img || "/logo(lutb).png"} isMain={false} style={{ width: "180px", height: "180px" }} />
              </div>
              <h3 style={{ color: "#E63946", fontSize: "26px", margin: "5px 0", fontWeight: "bold", fontFamily: "serif" }}>{p.nome}</h3>
              <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.5", margin: "10px 0 0 0", maxWidth: "280px" }}>{p.descricao || "Descrição não informada."}</p>
              <p style={{ marginTop: "10px", fontWeight: "bold", color: "#2D2D1A" }}>{p.preco ? `R$ ${p.preco}` : "Preço indisponível"}</p>
            </Link>
            <BotaoAdicionarCarrinho produto={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
