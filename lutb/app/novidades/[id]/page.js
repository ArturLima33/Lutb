"use client";
import { useParams, useRouter } from "next/navigation";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const router = useRouter();

  const produtos = {
    "1": { nome: "Colar Bolhas", preco: "25,00", img: "/colar-bolhas.png" },
    "2": { nome: "Colar Musgo 2", preco: "35,00", img: "/colar-musgo.png" },
    "3": { nome: "Moranguito", preco: "25,00", img: "/moranguito.png" },
    "4": { nome: "Tesouro Tropical", preco: "35,00", img: "/tesouro-tropical.png" }
  };

  const produto = produtos[id] || produtos["1"];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <img src="/seta-voltar.png" alt="Voltar" style={{ width: '70px', height: '70px' }} />
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white', borderRadius: '35px', padding: '40px', width: '90%', maxWidth: '380px', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <img src={produto.img} alt={produto.nome} style={{ width: '100%', maxHeight: '280px', objectFit: 'contain' }} />
        <h2 style={{ marginTop: '20px', color: '#333', fontSize: '24px', fontFamily: 'serif' }}>{produto.nome}</h2>
      </div>

      <div style={{ 
        background: 'linear-gradient(180deg, #9ACD32 0%, #228B22 100%)', width: '90%', maxWidth: '380px', 
        borderRadius: '20px', padding: '15px', marginTop: '30px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
      }}>
        <span style={{ fontSize: '36px', fontWeight: 'bold', color: 'black' }}>R$ {produto.preco}</span>
      </div>
    </div>
  );
}