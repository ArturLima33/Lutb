"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Midia from "../../components/Midia";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState(null);
  const [todasImagens, setTodasImagens] = useState([]);
  const [imgAtual, setImgAtual] = useState(0);

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase.from("Produto").select("*").eq("id", id).single();
      if (!data) return;
      const { data: imgs } = await supabase.from("produto_imagem").select("url").eq("produto_id", id).order("ordem");
      const lista = [data.img, ...(imgs || []).map(i => i.url)].filter(Boolean);
      setProduto(data);
      setTodasImagens(lista);
    };
    carregar();
  }, [id]);

  if (!produto) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <button onClick={() => router.back()} style={{ border: "none", background: "none", alignSelf: "flex-start", cursor: "pointer" }}>
        <img src="/seta-voltar.png" style={{ width: "50px" }} />
      </button>
      <div style={{ backgroundColor: "white", borderRadius: "35px", padding: "20px", width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", height: "280px", borderRadius: "20px", overflow: "hidden", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Midia url={todasImagens[imgAtual]} isMain={true} style={{ width: "100%", height: "100%" }} />
        </div>
        <h2 style={{ marginTop: "20px", fontFamily: "serif", textAlign: "center" }}>{produto.nome}</h2>
        <p style={{ textAlign: "center", color: "#555", marginTop: "10px" }}>{produto.descricao || ""}</p>
        {todasImagens.length > 1 && (
          <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap", justifyContent: "center" }}>
            {todasImagens.map((url, i) => (
              <Midia
                key={i}
                url={url}
                onClick={() => setImgAtual(i)}
                style={{
                  width: "60px",
                  height: "60px",
                  border: imgAtual === i ? "2px solid #E63946" : "2px solid transparent",
                  borderRadius: "10px",
                  opacity: imgAtual === i ? 1 : 0.6
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div style={{ background: "linear-gradient(180deg, #9ACD32, #228B22)", width: "100%", maxWidth: "380px", borderRadius: "20px", padding: "15px", marginTop: "30px", textAlign: "center" }}>
        <span style={{ fontSize: "36px", fontWeight: "bold" }}>
          {produto.preco ? `R$ ${produto.preco}` : "Preço indisponível"}
        </span>
      </div>
    </div>
  );
}