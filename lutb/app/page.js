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
  const [bannerAtual, setBannerAtual] = useState(0);

  const router = useRouter();
  const boxRef = useRef(null);

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
  };

  useEffect(() => {
    fetch("https://api.adviceslip.com/advice").then(res => res.json()).then(data => setFrase(data.slip.advice));
    
    // Carregar Produtos e Categorias
    fetch("https://parseapi.back4app.com/classes/Produto", { headers }).then(res => res.json()).then(data => setProdutos(data.results || []));
    fetch("https://parseapi.back4app.com/classes/Categoria", { headers }).then(res => res.json()).then(data => setCategorias(data.results || []));
  }, []);

  // FILTRO DO CARROSSEL (Produtos marcados no admin)
  const banners = produtos.filter(p => p.noCarrossel).map(p => ({
    id: p.objectId,
    cor: `linear-gradient(135deg, ${p.cor}, #000)`, 
    img: p.img || "/placeholder.png",
    link: `/produto/${p.objectId}`
  }));

  // Caso não tenha banners no admin, ele usa os originais que você mandou
  const bannersExibicao = banners.length > 0 ? banners : [
    { id: 2, cor: 'linear-gradient(135deg, #FF8C00, #D2691E)', img: '/colar-musgo.png', link: '/produto/2' },
    { id: 3, cor: 'linear-gradient(135deg, #FF4500, #8B0000)', img: '/moranguito.png', link: '/produto/3' }
  ];

  // FILTRO DAS COLEÇÕES (Máximo 2 na home)
  const colecoesHome = categorias.filter(c => c.naHome).slice(0, 2);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerAtual(prev => (prev + 1) % bannersExibicao.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [bannersExibicao]);

  return (
    <div style={{ padding: '20px' }}>
      {/* BUSCA (Mantida Original) */}
      <div ref={boxRef} style={{ marginBottom: "20px", position: "relative" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="Buscar produto..." value={busca} onChange={(e) => { setBusca(e.target.value); setMostrarSugestoes(true); }} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none" }} />
          <button onClick={() => router.push(`/busca?q=${busca}`)} style={{ padding: "10px 15px", borderRadius: "10px", border: "none", backgroundColor: "#2D2D2D", color: "white" }}>Buscar</button>
        </div>
        {/* Lógica de sugestões omitida para brevidade, mas deve ser mantida como no seu original */}
      </div>

      {/* CARROSSEL (Design Original) */}
      <div style={{ background: bannersExibicao[bannerAtual].cor, height: '210px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <button onClick={() => setBannerAtual(prev => (prev === 0 ? bannersExibicao.length - 1 : prev - 1))} style={{ background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px' }}>‹</button>
        <Link href={bannersExibicao[bannerAtual].link} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={bannersExibicao[bannerAtual].img} style={{ height: '85%' }} />
        </Link>
        <button onClick={() => setBannerAtual(prev => (prev + 1) % bannersExibicao.length)} style={{ background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px' }}>›</button>
      </div>

      {/* DICA DO DIA (Original) */}
      <div style={{ backgroundColor: 'white', marginTop: '25px', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '10px' }}>Dica do dia ✨</h3>
        <p style={{ fontStyle: 'italic', color: '#555' }}>{frase || "Carregando..."}</p>
      </div>

      {/* COLEÇÕES FIXAS (Design Original - Agora dinâmicas) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        {colecoesHome.length > 0 ? (
          colecoesHome.map(cat => (
            <Link key={cat.objectId} href={`/colecao/${cat.nome.toLowerCase()}`} style={{ 
              background: cat.estilo, width: '47%', height: '220px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
            }}>
              <h3 style={{ color: 'white' }}>Coleção {cat.nome}</h3>
            </Link>
          ))
        ) : (
          <p>Nenhuma coleção fixada na home.</p>
        )}
      </div>
    </div>
  );
}