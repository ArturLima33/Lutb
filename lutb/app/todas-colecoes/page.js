"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TodasColecoes() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const produtosFixos = [
        { id: "3", nome: "Moranguito", cor: "#E63946", img: "/moranguito.png", desc: "Feito à mão com pedras míticas encontradas no topo do Evereste." },
        { id: "4", nome: "Tesouro Tropical", cor: "#1E90FF", img: "/tesouro-tropical.png", desc: "Feito à mão com pérolas encontradas em um baú de pirata." },
        { id: "1", nome: "Colar Bolhas", cor: "#333", img: "/colar-bolhas.png", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
        { id: "2", nome: "Colar Musgo", cor: "#333", img: "/colar-musgo.png", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
      ];

      try {
        const res = await fetch("https://parseapi.back4app.com/classes/Produto", {
          headers: {
            "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
            "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
          },
        });
        const data = await res.json();
        const produtosAdmin = (data.results || []).map(p => ({
          id: p.objectId,
          nome: p.nome,
          desc: p.desc,
          cor: p.cor || "#333",
          img: p.imagemUrl || "/placeholder.png"
        }));
        setProdutos([...produtosFixos, ...produtosAdmin]);
      } catch (err) {
        setProdutos(produtosFixos);
      }
    };
    fetchProdutos();
  }, []);

  return (
    <div style={{ padding: '0 20px 40px 20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '10px 25px', width: 'fit-content', margin: '0 auto 30px auto' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#2D2D1A' }}>Todas as Coleções</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {produtos.map((p) => (
          <Link href={`/produto/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src={p.img} alt={p.nome} style={{ width: '150px', marginBottom: '10px' }} />
              <h3 style={{ color: p.cor, fontSize: '24px', margin: '5px 0', fontFamily: 'serif' }}>{p.nome}</h3>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.4', margin: 0 }}>{p.desc}</p>
            </div>
          </Link>
        ))}
        <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '40px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', fontFamily: 'serif' }}>Novo Colar</h3>
          <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>Em breve novidades...</p>
        </div>
      </div>
    </div>
  );
}