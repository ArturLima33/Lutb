"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NovidadesDetalhe() {
  const { id } = useParams();

  const produtos = {
    "3": { nome: "Moranguito", img: "/moranguito.png" },
    "2": { nome: "Colar Musgo 2", img: "/colar-musgo.png" },
  };

  const produto = produtos[id];

  if (!produto) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Conteúdo não encontrado</div>;

  return (
    <div style={{ backgroundColor: '#EBEBEB', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <Link href="/">
          <img src="/seta-voltar.png" alt="Voltar" style={{ width: '30px' }} />
        </Link>
        <img src="/logo(lutb).png" alt="Logo" style={{ width: '70px', borderRadius: '50%' }} />
        <div style={{ width: '30px' }}></div>
      </div>

      <h1 style={{ fontFamily: 'serif', fontSize: '42px', color: '#B5C400', marginBottom: '30px', fontWeight: 'bold', fontStyle: 'italic' }}>
        Novidades!
      </h1>

      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '30px', width: '85%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <img src={produto.img} alt={produto.nome} style={{ width: '100%', marginBottom: '20px', objectFit: 'contain' }} />
        <h2 style={{ fontFamily: 'serif', fontSize: '24px', color: '#333', margin: 0 }}>{produto.nome}</h2>
      </div>
    </div>
  );
}