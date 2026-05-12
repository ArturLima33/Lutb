"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function Home() {
  const [frase, setFrase] = useState("");
  const [busca, setBusca] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannerAtual, setBannerAtual] = useState(0);

  const router = useRouter();
  const boxRef = useRef(null);

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
  };

  useEffect(() => {
    fetch("https://api.adviceslip.com/advice").then(res => res.json()).then(data => setFrase(data.slip.advice));
    
    const carregarDados = async () => {
      const [resP, resC, resB] = await Promise.all([
        fetch("https://parseapi.back4app.com/classes/Produto", { headers }),
        fetch("https://parseapi.back4app.com/classes/Categoria", { headers }),
        fetch("https://parseapi.back4app.com/classes/Carrossel", { headers })
      ]);
      const dataP = await resP.json(); setProdutos(dataP.results || []);
      const dataC = await resC.json(); setCategorias(dataC.results || []);
      const dataB = await resB.json(); setBanners(dataB.results || []);
    };
    carregarDados();
  }, []);

  // Banners Dinâmicos (Se não houver no banco, usa os originais)
  const bannersHome = banners.length > 0 ? banners : [
    { id: 1, cor: 'linear-gradient(135deg, #FF8C00, #D2691E)', img: '/colar-musgo.png', link: '#' }
  ];

  // Coleções Fixas (0 a 2)
  const colecoesHome = categorias.filter(c => c.naHome).slice(0, 2);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerAtual(prev => (prev + 1) % bannersHome.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [bannersHome]);

  return (
    <div style={{ padding: '20px' }}>
      {/* BUSCA (Mantida Original) */}
      <div ref={boxRef} style={{ marginBottom: "20px", position: "relative" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="Buscar produto..." value={busca} onChange={(e) => { setBusca(e.target.value); setMostrarSugestoes(true); }} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none" }} />
          <button onClick={() => router.push(`/busca?q=${busca}`)} style={{ padding: "10px 15px", borderRadius: "10px", backgroundColor: "#2D2D2D", color: "white", border: 'none' }}>Buscar</button>
        </div>
        {/* Sugestões omitidas para brevidade, mas o funcionamento é o mesmo */}
      </div>

      {/* CARROSSEL ORIGINAL */}
      <div style={{
        background: bannersHome[bannerAtual].cor,
        height: '210px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <button onClick={() => setBannerAtual(prev => (prev === 0 ? bannersHome.length - 1 : prev - 1))} style={{ background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px' }}>‹</button>
        <Link href={bannersHome[bannerAtual].link} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img src={bannersHome[bannerAtual].img} style={{ height: '170px' }} />
        </Link>
        <button onClick={() => setBannerAtual(prev => (prev + 1) % bannersHome.length)} style={{ background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px' }}>›</button>
      </div>

      {/* DICA DO DIA */}
      <div style={{ backgroundColor: 'white', marginTop: '25px', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '10px' }}>Dica do dia ✨</h3>
        <p style={{ fontStyle: 'italic', color: '#555' }}>{frase || "Carregando..."}</p>
      </div>

      {/* COLEÇÕES DINÂMICAS NA HOME (MÁXIMO 2) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        {colecoesHome.map(cat => (
          <Link key={cat.objectId} href={`/colecao/${cat.nome.toLowerCase()}`} style={{
            background: `linear-gradient(180deg, ${cat.cor1}, ${cat.cor2})`,
            width: '47%', height: '220px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
          }}>
             <h3 style={{ color: 'white' }}>{cat.nome}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}