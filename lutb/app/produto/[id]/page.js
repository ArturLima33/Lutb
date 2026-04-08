"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProdutoDetalhe() {
  const { id } = useParams();

  const produtos = {
    "1": { nome: "Colar Bolhas", preco: "25,00", img: "/colar-bolhas.png" },
    "2": { nome: "Colar Musgo 2", preco: "35,00", img: "/colar-musgo.png" },
    "3": { nome: "Moranguito", preco: "25,00", img: "/moranguito.png" },
    "4": { nome: "Colar Tesouro Tropical", preco: "35,00", img: "/tesouro-tropical.png" }, 
  };

  const produto = produtos[id];

  if (!produto) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Produto não encontrado</div>;

  return (
    <div style={{ backgroundColor: '#76BA5B', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <Link href="/catalogo">
          <img src="/seta-voltar.png" alt="Voltar" style={{ width: '80px', height: '70px' }} />
        </Link>
      </div>

      <div style={{ 
        backgroundColor: 'white', borderRadius: '35px', padding: '30px', width: '90%', maxWidth: '350px', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)', marginBottom: '40px', aspectRatio: '1 / 1.3', justifyContent: 'space-between'
      }}>
        <div style={{ width: '100%', height: '65%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={produto.img} alt={produto.nome} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
        </div>
        <h3 style={{ fontSize: '22px', color: '#333', fontWeight: 'bold', fontFamily: 'serif' }}>{produto.nome}</h3>
      </div>

      <div style={{ 
        background: 'linear-gradient(180deg, #9ACD32 0%, #228B22 100%)', width: '95%', maxWidth: '350px', 
        borderRadius: '25px', padding: '20px 10px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        <div style={{ color: 'black', fontSize: '48px', fontWeight: 'bold' }}>R$ {produto.preco}</div>
      </div>
    </div>
  );
}