"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProdutoDetalhe() {
  const { id } = useParams();

  const produtos = {
    "1": { nome: "Colar Bolhas", preco: "25,00", img: "/colar-bolhas.png" },
    "2": { nome: "Colar Musgo", preco: "35,00", img: "/colar-musgo.png" },
    "3": { nome: "Moranguito", preco: "25,00", img: "/moranguito.png" },
    "4": { nome: "Colar Tesouro Tropical", preco: "35,00", img: "/tesouro-tropical.png" },
  };

  const produto = produtos[id];

  if (!produto) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Produto não encontrado</div>;

  return (
    <div style={{ 
      backgroundColor: '#FFFFFF', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="/catalogo" style={{ textDecoration: 'none' }}>
          <img src="/seta-voltar.png" alt="Voltar" style={{ width: '25px' }} />
        </Link>
        <Link href="/">
          <img src="/logo(lutb).png" alt="Logo" style={{ width: '70px', borderRadius: '50%' }} />
        </Link>
        <div style={{ width: '25px' }}></div>
      </div>

      <div style={{ 
        backgroundColor: '#F9F9F9', 
        borderRadius: '25px', 
        padding: '15px', 
        width: '85%', 
        maxWidth: '260px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <img src={produto.img} alt={produto.nome} style={{ width: '100%', objectFit: 'contain' }} />
      </div>

      <div style={{ 
        background: 'linear-gradient(180deg, #9ACD32 0%, #228B22 100%)',
        width: '90%',
        maxWidth: '300px',
        borderRadius: '25px',
        padding: '15px 10px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ color: '#1A1A1A', margin: '0 0 5px 0', fontSize: '20px', fontWeight: '600' }}>{produto.nome}</h2>
        <div style={{ color: 'black', fontSize: '38px', fontWeight: 'bold' }}>
          R$ {produto.preco}
        </div>
      </div>
    </div>
  );
}