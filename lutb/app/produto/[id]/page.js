"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [imgAtual, setImgAtual] = useState(0);

  useEffect(() => {
    const carregarProduto = async () => {
      const { data } = await supabase.from("Produto").select("*").eq("id", id).single();
      if (data) {
        setProduto({
          ...data,
          img: data.img && data.img !== "" ? data.img : "/logo(lutb).png",
          descricao: data.descricao || "Descrição não informada.",
        });
        const { data: imgs } = await supabase.from("produto_imagem").select("url").eq("produto_id", id).order("ordem");
        setImagens((imgs || []).map(i => i.url));
      }
    };
    carregarProduto();
  }, [id]);

  if (!produto) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando...</p>;

  const todasImagens = [produto.img, ...imagens].filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none' }}>
          <img src="/seta-voltar.png" style={{ width: '70px' }} />
        </button>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '35px', padding: '40px', width: '90%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={todasImagens[imgAtual]} style={{ width: '100%', maxHeight: '280px', objectFit: 'contain' }} />
        <h2 style={{ marginTop: '20px', fontFamily: 'serif', textAlign: 'center' }}>{produto.nome}</h2>
        <p style={{ textAlign: 'center', marginTop: '10px', color: '#555' }}>{produto.descricao}</p>
        {todasImagens.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {todasImagens.map((url, i) => (
              <img key={i} src={url} onClick={() => setImgAtual(i)} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', border: imgAtual === i ? '2px solid #E63946' : '2px solid transparent', opacity: imgAtual === i ? 1 : 0.6 }} />
            ))}
          </div>
        )}
      </div>
      <div style={{ background: 'linear-gradient(180deg, #9ACD32, #228B22)', width: '90%', maxWidth: '380px', borderRadius: '20px', padding: '15px', marginTop: '30px', textAlign: 'center' }}>
        <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{produto.preco ? `R$ ${produto.preco}` : "Preço indisponível"}</span>
      </div>
    </div>
  );
}