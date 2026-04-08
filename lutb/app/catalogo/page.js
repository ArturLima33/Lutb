"use client";
import Link from "next/link";

export default function Catalogo() {
  const produtos = [
    { id: 1, nome: "Colar Bolhas", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", img: "/colar-bolhas.png" },
    { id: 2, nome: "Colar Musgo", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", img: "/colar-musgo.png" },
    { id: 3, nome: "Moranguito", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", img: "/moranguito.png" },
    { id: 4, nome: "Colar Tesouro Tropical", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", img: "/tesouro-tropical.png" },
  ];

  return (
    <div style={{ 
      backgroundColor: '#76BA5B',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center', // Centraliza a grade inteira na horizontal
      padding: '20px'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', // Trava em 2 colunas fixas [ ] [ ]
        gap: '20px', // Espaço entre os quadradinhos
        maxWidth: '400px', // Controla a largura máxima da grade para não espalhar muito
        width: '100%',
        alignContent: 'start' 
      }}>
        {produtos.map((produto) => (
          <Link href={`/produto/${produto.id}`} key={produto.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '35px', // Bordas bem arredondadas como você pediu
              padding: '15px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              aspectRatio: '1 / 1', // Força o formato de "quadradinho"
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ width: '100%', height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
                <img src={produto.img} alt={produto.nome} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '14px', margin: '0 0 4px 0', color: '#333', fontWeight: 'bold' }}>{produto.nome}</h3>
              <p style={{ fontSize: '8px', color: '#666', margin: 0, lineHeight: '1.2', padding: '0 5px' }}>{produto.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}