"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ColecaoVerao() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const produtos = [
    { id: 3, nome: "Moranguito", img: "/moranguito.png" },
    { id: 4, nome: "Tesouro Tropical", img: "/tesouro-tropical.png" }
  ];

  if (loading) return null; 

  return (
    <div style={{ backgroundColor: '#76BA5B', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Link href="/">
          <img src="/seta-voltar.png" alt="Voltar" style={{ width: '60px', height: '60px' }} />
        </Link>
        <div style={{ backgroundColor: 'white', padding: '10px 25px', borderRadius: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontFamily: 'serif' }}>Coleção Verão 2026</h2>
        </div>
        <div style={{ width: '60px' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {produtos.map((prod) => (
          <Link href={`/produto/${prod.id}`} key={prod.id} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '15px', textAlign: 'center', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <img src={prod.img} alt={prod.nome} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
              <p style={{ color: '#333', fontWeight: 'bold', margin: '10px 0 0 0' }}>{prod.nome}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}