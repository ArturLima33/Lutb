"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function Home() {
  const [frase, setFrase] = useState("");
  const [busca, setBusca] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [selecionado, setSelecionado] = useState(-1);
  const [produtos, setProdutos] = useState([]);
  const [bannerAtual, setBannerAtual] = useState(0);

  const router = useRouter();
  const boxRef = useRef(null);
  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
  };

  useEffect(() => {
    fetch("https://api.adviceslip.com/advice").then(res => res.json()).then(data => setFrase(data.slip.advice));
    
    const carregarTudo = async () => {
      const res = await fetch("https://parseapi.back4app.com/classes/Produto", { headers });
      const data = await res.json();
      setProdutos(data.results || []);
    };
    carregarTudo();
  }, []);

  const produtosCarrossel = produtos.filter(p => p.noCarrossel);
  const categoriasNaHome = [...new Set(produtos.map(p => p.categoria))].filter(c => c).slice(0, 2);

  useEffect(() => {
    if (!busca.trim()) { setSugestoes([]); return; }
    const resultado = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
    setSugestoes(resultado);
  }, [busca, produtos]);

  useEffect(() => {
    if (produtosCarrossel.length > 1) {
      const intervalo = setInterval(() => {
        setBannerAtual(prev => (prev + 1) % produtosCarrossel.length);
      }, 3000);
      return () => clearInterval(intervalo);
    }
  }, [produtosCarrossel]);

  return (
    <div style={{ padding: '20px' }}>
      <div ref={boxRef} style={{ marginBottom: "20px", position: "relative" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="Buscar produto..." value={busca} onChange={(e) => { setBusca(e.target.value); setMostrarSugestoes(true); }} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none" }} />
          <button onClick={() => router.push(`/busca?q=${busca}`)} style={{ padding: "10px 15px", borderRadius: "10px", border: "none", backgroundColor: "#2D2D2D", color: "white" }}>Buscar</button>
        </div>
        {mostrarSugestoes && busca && (
          <div style={{ position: "absolute", top: "45px", width: "100%", background: "white", borderRadius: "10px", zIndex: 10 }}>
            {sugestoes.map(p => (
              <div key={p.objectId} onClick={() => router.push(`/produto/${p.objectId}`)} style={{ padding: "10px", borderBottom: "1px solid #eee", cursor: 'pointer' }}>{p.nome}</div>
            ))}
          </div>
        )}
      </div>

      {produtosCarrossel.length > 0 && (
        <div style={{ background: produtosCarrossel[bannerAtual].cor || '#333', height: '210px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', position: 'relative' }}>
          <button onClick={() => setBannerAtual(prev => (prev === 0 ? produtosCarrossel.length - 1 : prev - 1))} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', fontSize: '30px', borderRadius: '50%', width: '45px', height: '45px' }}>‹</button>
          <Link href={`/produto/${produtosCarrossel[bannerAtual].objectId}`} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={produtosCarrossel[bannerAtual].img} style={{ height: '85%' }} />
          </Link>
          <button onClick={() => setBannerAtual(prev => (prev + 1) % produtosCarrossel.length)} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', fontSize: '30px', borderRadius: '50%', width: '45px', height: '45px' }}>›</button>
        </div>
      )}

      <div style={{ backgroundColor: 'white', marginTop: '25px', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '10px' }}>Dica do dia ✨</h3>
        <p style={{ fontStyle: 'italic', color: '#555' }}>{frase || "Carregando..."}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        {categoriasNaHome.map((cat, i) => (
          <Link key={cat} href={`/colecao/${cat}`} style={{ 
            background: i === 0 ? 'linear-gradient(180deg, #987317, #cebb4b)' : 'linear-gradient(180deg, #8B4513, #FFC0CB)', 
            width: '47%', height: '220px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' 
          }}>
            <h3 style={{ color: 'white', textTransform: 'capitalize' }}>Coleção {cat}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}