"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Catalogo() {

  const produtosFixos = [
    { id: "1", nome: "Colar Bolhas", preco: "25,00", img: "/colar-bolhas.png", desc: "Inspirado na pureza das águas, com detalhes em pérolas." },
    { id: "2", nome: "Colar Musgo", preco: "35,00", img: "/colar-musgo.png", desc: "Representando o renascimento e a força da natureza." },
    { id: "3", nome: "Moranguito", preco: "25,00", img: "/moranguito.png", desc: "Feito à mão com pedras selecionadas e pingente temático." },
    { id: "4", nome: "Tesouro Tropical", preco: "35,00", img: "/tesouro-tropical.png", desc: "Uma explosão de cores que remete ao paraíso tropical." }
  ];

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const dados = localStorage.getItem("produtos");

    let produtosAdmin = [];

    if (dados) {
      produtosAdmin = JSON.parse(dados).map((p) => ({
        ...p,
        id: String(p.id),
        preco: p.preco || null, // 🔥 aqui muda
        img: p.img && p.img !== "" ? p.img : "/logo(lutb).png",
        desc: p.desc || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      }));
    }

    const todos = [...produtosFixos, ...produtosAdmin];

    const unicos = todos.filter(
      (produto, index, self) =>
        index === self.findIndex((p) => p.id === produto.id)
    );

    setProdutos(unicos);
  }, []);

  return (
    <div style={{ padding: '0 20px 40px 20px' }}>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '15px', 
        padding: '10px 30px', 
        width: 'fit-content', 
        margin: '0 auto 30px auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#2D2D1A', textAlign: 'center' }}>
          Catálogo
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {produtos.map((p) => (
          <Link href={`/produto/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '35px', 
              padding: '25px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
            }}>
              
              <img 
                src={p.img} 
                alt={p.nome} 
                style={{ width: '180px', height: '180px', objectFit: 'contain', marginBottom: '15px' }} 
              />

              <h3 style={{ 
                color: '#E63946', 
                fontSize: '26px', 
                margin: '5px 0', 
                fontWeight: 'bold',
                fontFamily: 'serif'
              }}>
                {p.nome}
              </h3>

              <p style={{ 
                color: '#555', 
                fontSize: '14px', 
                lineHeight: '1.5', 
                margin: '10px 0 0 0',
                maxWidth: '280px'
              }}>
                {p.desc}
              </p>

              {/* 🔥 NOVO: preço inteligente */}
              <p style={{ 
                marginTop: '10px', 
                fontWeight: 'bold', 
                color: '#2D2D1A' 
              }}>
                {p.preco ? `R$ ${p.preco}` : "Preço indisponível"}
              </p>

            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}