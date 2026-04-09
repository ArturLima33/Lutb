"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ColecaoVerao() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const produtos = [
    { 
      id: 3, 
      nome: "Moranguito", 
      desc: "Feito à mão com pedras selecionadas e pingente temático.",
      img: "/moranguito.png" 
    },
    { 
      id: 4, 
      nome: "Tesouro Tropical", 
      desc: "Uma explosão de cores que remete ao paraíso tropical.",
      img: "/tesouro-tropical.png" 
    }
  ];

  if (loading) return null;

  return (
    <div style={{ backgroundColor: '#76BA5B', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '15px 30px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#2D2D1A' }}>
            Coleção Verão 2026
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {produtos.map((p) => (
          <Link href={`/produto/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '30px', 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
            }}>
              <img src={p.img} alt={p.nome} style={{ width: '180px', marginBottom: '15px' }} />
              <h2 style={{ fontSize: '22px', margin: '0 0 10px 0', color: '#333' }}>
                {p.nome}
              </h2>
              <p style={{ fontSize: '14px', textAlign: 'center', color: '#555', lineHeight: '1.4' }}>
                {p.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}