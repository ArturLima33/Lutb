"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function Home() {
  const [frase, setFrase] = useState("");
  const [busca, setBusca] = useState("");
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
    // Frase da API
    fetch("https://api.adviceslip.com/advice").then(res => res.json()).then(data => setFrase(data.slip.advice));
    
    // Carregar dados do Back4App
    const carregarDados = async () => {
      try {
        const [resP, resC, resB] = await Promise.all([
          fetch("https://parseapi.back4app.com/classes/Produto", { headers }),
          fetch("https://parseapi.back4app.com/classes/Categoria", { headers }),
          fetch("https://parseapi.back4app.com/classes/Carrossel", { headers })
        ]);
        const dataP = await resP.json(); setProdutos(dataP.results || []);
        const dataC = await resC.json(); setCategorias(dataC.results || []);
        const dataB = await resB.json(); setBanners(dataB.results || []);
      } catch (e) { console.error(e); }
    };
    carregarDados();
  }, []);

  // Lógica dos Banners: Se o banco estiver vazio, usa os seus padrões para não sumir nada
  const bannersParaExibir = banners.length > 0 ? banners : [
    { id: 'fixo1', cor: 'linear-gradient(135deg, #FF8C00, #D2691E)', img: '/colar-musgo.png', link: '#' },
    { id: 'fixo2', cor: 'linear-gradient(135deg, #FF4500, #8B0000)', img: '/moranguito.png', link: '#' }
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerAtual(prev => (prev + 1) % bannersParaExibir.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [bannersParaExibir]);

  // Coleções fixadas (máximo 2 na home)
  const colecoesHome = categorias.filter(c => c.naHome).slice(0, 2);

  return (
    <div style={{ padding: '20px' }}>
      {/* BUSCA */}
      <div ref={boxRef} style={{ marginBottom: "20px", position: "relative" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="Buscar produto..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none" }} />
          <button onClick={() => router.push(`/busca?q=${busca}`)} style={{ padding: "10px 15px", borderRadius: "10px", border: "none", backgroundColor: "#2D2D2D", color: "white" }}>Buscar</button>
        </div>
      </div>

      {/* CARROSSEL (ESTRUTURA ORIGINAL PRESERVADA) */}
      <div style={{
        background: bannersParaExibir[bannerAtual].cor,
        height: '210px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <button onClick={() => setBannerAtual(prev => (prev === 0 ? bannersParaExibir.length - 1 : prev - 1))} style={btnSeta}>‹</button>
        <Link href={bannersParaExibir[bannerAtual].link || "#"} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={bannersParaExibir[bannerAtual].img} style={{ height: '85%' }} alt="Banner" />
        </Link>
        <button onClick={() => setBannerAtual(prev => (prev + 1) % bannersParaExibir.length)} style={btnSeta}>›</button>
      </div>

      {/* DICA DO DIA */}
      <div style={{ backgroundColor: 'white', marginTop: '25px', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '10px' }}>Dica do dia ✨</h3>
        <p style={{ fontStyle: 'italic', color: '#555' }}>{frase || "Carregando..."}</p>
      </div>

      {/* COLEÇÕES (DINÂMICAS) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        {colecoesHome.map((cat) => (
          <Link key={cat.objectId} href={`/colecao/${cat.nome.toLowerCase()}`} style={{
            background: `linear-gradient(180deg, ${cat.cor1 || '#987317'}, ${cat.cor2 || '#cebb4b'})`,
            width: '47%', height: '220px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
          }}>
            <h3 style={{ color: 'white' }}>{cat.nome}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

const btnSeta = { background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px' };