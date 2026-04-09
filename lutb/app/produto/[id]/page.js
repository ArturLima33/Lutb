"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      const produtosFixos = [
        { id: "1", nome: "Colar Bolhas", preco: "25,00", img: "/colar-bolhas.png", desc: "Inspirado na pureza das águas." },
        { id: "2", nome: "Colar Musgo", preco: "35,00", img: "/colar-musgo.png", desc: "Representando a natureza." },
        { id: "3", nome: "Moranguito", preco: "25,00", img: "/moranguito.png", desc: "Feito à mão com pedras selecionadas." },
        { id: "4", nome: "Tesouro Tropical", preco: "35,00", img: "/tesouro-tropical.png", desc: "Explosão de cores tropicais." }
      ];

      const res = await fetch("https://parseapi.back4app.com/classes/Produto", {
        headers: {
          "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
          "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
        },
      });
      const data = await res.json();
      
      const produtosAdmin = (data.results || []).map((p) => ({
        ...p,
        id: p.objectId,
        preco: p.preco || null,
        img: p.img && p.img !== "" ? p.img : "/logo(lutb).png",
        desc: p.desc || "Lorem ipsum dolor sit amet."
      }));

      const todos = [...produtosFixos, ...produtosAdmin];
      const encontrado = todos.find((p) => String(p.id) === String(id));
      setProduto(encontrado);
    };

    carregarDados();
  }, [id]);

  if (!produto) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none' }}>
          <img src="/seta-voltar.png" style={{ width: '70px' }} />
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white', borderRadius: '35px', padding: '40px', width: '90%', maxWidth: '380px', 
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <img src={produto.img} style={{ width: '100%', maxHeight: '280px', objectFit: 'contain' }} />
        <h2 style={{ marginTop: '20px' }}>{produto.nome}</h2>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>{produto.desc}</p>
      </div>

      <div style={{ 
        background: 'linear-gradient(180deg, #9ACD32, #228B22)', 
        width: '90%', maxWidth: '380px', borderRadius: '20px', padding: '15px', marginTop: '30px', textAlign: 'center'
      }}>
        <span style={{ fontSize: '36px', fontWeight: 'bold' }}>
          {produto.preco ? `R$ ${produto.preco}` : "Preço indisponível"}
        </span>
      </div>
    </div>
  );
}