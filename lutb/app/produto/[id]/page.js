"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function DetalheCompra() {
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
    <div style={{ backgroundColor: '#76BA5B', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/seta-voltar.png" style={{ width: '70px', height: '70px' }} />
        </button>
        <img src="/logo(lutb).png" style={{ width: '80px', borderRadius: '50%' }} />
        <div style={{ width: '70px' }}></div>
      </div>

      <div style={{ 
        backgroundColor: 'white', borderRadius: '35px', padding: '40px', width: '85%', maxWidth: '400px', 
        marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <img src={produto.img} style={{ width: '100%', maxHeight: '250px', objectFit: 'contain' }} />
        <h2 style={{ marginTop: '20px', color: '#333', fontFamily: 'serif' }}>{produto.nome}</h2>
      </div>

      <div style={{ 
        background: 'linear-gradient(180deg, #9ACD32 0%, #228B22 100%)', width: '90%', maxWidth: '400px', 
        borderRadius: '20px', padding: '20px', marginTop: '30px', textAlign: 'center' 
      }}>
        <span style={{ fontSize: '40px', fontWeight: 'bold' }}>R$ {produto.preco}</span>
      </div>
    </div>
  );
}