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
    // Busca a frase do dia (Conselho)
    fetch("https://api.adviceslip.com/advice")
      .then(res => res.json())
      .then(data => setFrase(data.slip.advice));
    
    // Carregar Produtos e Categorias do Back4App
    const carregarDados = async () => {
      try {
        const [resP, resC] = await Promise.all([
          fetch("https://parseapi.back4app.com/classes/Produto", { headers }),
          fetch("https://parseapi.back4app.com/classes/Categoria", { headers })
        ]);
        const dataP = await resP.json();
        const dataC = await resC.json();
        setProdutos(dataP.results || []);
        setCategorias(dataC.results || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    carregarDados();
  }, []);

  // FILTRO DO CARROSSEL: Pega produtos marcados como 'noCarrossel' no Admin
  const bannersDB = produtos.filter(p => p.noCarrossel).map(p => ({
    id: p.objectId,
    cor: p.cor || "#987317",
    img: p.img,
    link: `/produto/${p.objectId}`
  }));

  // Banners de segurança caso o banco esteja vazio
  const bannersExibicao = bannersDB.length > 0 ? bannersDB : [
    { id: '1', cor: '#987317', img: '/colar-musgo.png', link: '#' },
    { id: '2', cor: '#E63946', img: '/moranguito.png', link: '#' }
  ];

  // FILTRO DAS COLEÇÕES: Mostra as marcadas com 'naHome' (Máximo 2)
  const colecoesHome = categorias.filter(c => c.naHome).slice(0, 2);

  // Lógica do Carrossel Automático
  useEffect(() => {
    if (bannersExibicao.length > 1) {
      const intervalo = setInterval(() => {
        setBannerAtual(prev => (prev + 1) % bannersExibicao.length);
      }, 3000);
      return () => clearInterval(intervalo);
    }
  }, [bannersExibicao]);

  // Lógica de Busca
  useEffect(() => {
    if (!busca.trim()) {
      setSugestoes([]);
      return;
    }
    const resultado = produtos.filter(p => 
      p.nome.toLowerCase().includes(busca.toLowerCase())
    );
    setSugestoes(resultado);
  }, [busca, produtos]);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'serif' }}>
      
      {/* BARRA DE BUSCA */}
      <div ref={boxRef} style={{ marginBottom: "20px", position: "relative" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input 
            type="text" 
            placeholder="Buscar produto..." 
            value={busca} 
            onChange={(e) => { setBusca(e.target.value); setMostrarSugestoes(true); }} 
            style={{ flex: 1, padding: "12px", borderRadius: "15px", border: "none", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }} 
          />
          <button 
            onClick={() => router.push(`/busca?q=${busca}`)} 
            style={{ padding: "10px 15px", borderRadius: "15px", border: "none", backgroundColor: "#2D2D2D", color: "white", cursor: "pointer" }}
          >
            Buscar
          </button>
        </div>
        {mostrarSugestoes && busca && sugestoes.length > 0 && (
          <div style={{ position: "absolute", top: "50px", width: "100%", background: "white", borderRadius: "15px", zIndex: 100, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
            {sugestoes.map(p => (
              <div key={p.objectId} onClick={() => router.push(`/produto/${p.objectId}`)} style={{ padding: "12px", borderBottom: "1px solid #eee", cursor: 'pointer' }}>
                {p.nome}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CARROSSEL DINÂMICO */}
      <div style={{ 
        background: bannersExibicao[bannerAtual].cor, 
        height: '210px', 
        borderRadius: '30px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 15px', 
        position: 'relative',
        transition: 'background 0.5s ease'
      }}>
        <button 
          onClick={() => setBannerAtual(prev => (prev === 0 ? bannersExibicao.length - 1 : prev - 1))}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '24px', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}
        >‹</button>
        
        <Link href={bannersExibicao[bannerAtual].link} style={{ height: '80%', display: 'flex', alignItems: 'center' }}>
          <img 
            src={bannersExibicao[bannerAtual].img} 
            alt="Destaque" 
            style={{ maxHeight: '100%', objectFit: 'contain' }} 
          />
        </Link>

        <button 
          onClick={() => setBannerAtual(prev => (prev + 1) % bannersExibicao.length)}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '24px', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}
        >›</button>
      </div>

      {/* FRASE DO DIA */}
      <div style={{ backgroundColor: 'white', marginTop: '25px', padding: '20px', borderRadius: '25px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '8px', color: '#2D2D1A' }}>Dica do dia ✨</h3>
        <p style={{ fontStyle: 'italic', color: '#666', fontSize: '14px', margin: 0 }}>{frase || "A carregar conselho..."}</p>
      </div>

      {/* COLEÇÕES FIXADAS (0 A 2) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '15px' }}>
        {colecoesHome.map((cat) => (
          <Link 
            key={cat.objectId} 
            href={`/colecao/${cat.nome.toLowerCase()}`} 
            style={{ 
              background: `linear-gradient(180deg, ${cat.cor1}, ${cat.cor2})`, 
              width: '100%', 
              height: '220px', 
              borderRadius: '30px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textDecoration: 'none',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Coleção</h3>
            <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>{cat.nome}</h2>
          </Link>
        ))}
      </div>

    </div>
  );
}