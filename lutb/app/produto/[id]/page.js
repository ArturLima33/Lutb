"use client";
import { useRouter, useParams } from "next/navigation";

export default function TelaCompra() {
  const router = useRouter();
  const params = useParams();

  const produtos = {
    "1": {
      nome: "Colar Bolhas",
      img: "/colar-bolhas.png",
      preco: "R$ 25,00"
    },
    "2": {
      nome: "Colar Musgo",
      img: "/colar-musgo.png",
      preco: "R$ 35,00"
    },
    "3": {
      nome: "Moranguito",
      img: "/moranguito.png",
      preco: "R$ 25,00"
    },
    "4": {
      nome: "Tesouro Tropical",
      img: "/tesouro-tropical.png",
      preco: "R$ 35,00"
    }
  };

  const produto = produtos[params.id];

  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none' }}>
          <img src="/seta-voltar.png" style={{ width: '70px' }} />
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '40px', padding: '40px', width: '85%', marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={produto.img} style={{ width: '100%', maxWidth: '250px' }} />
        <h2 style={{ marginTop: '20px' }}>{produto.nome}</h2>
      </div>

      <div style={{ background: 'linear-gradient(180deg, #9ACD32 0%, #228B22 100%)', width: '90%', borderRadius: '20px', padding: '20px', marginTop: '30px', textAlign: 'center' }}>
        <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{produto.preco}</span>
      </div>
    </div>
  );
}