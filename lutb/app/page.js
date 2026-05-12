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
    // Busca a frase do conselho
    fetch("https://api.adviceslip.com/advice").then(res => res.json()).then(data => setFrase(data.slip.advice));
    
    // Carrega dados do banco
    const carregarDados = async () => {
      const [resP, resC] = await Promise.all([
        fetch("https://parseapi.back4app.com/classes/Produto", { headers }),
        fetch("https://parseapi.back4app.com/classes/Categoria", { headers })
      ]);
      const dataP = await resP.json();
      const dataC = await resC.json();
      setProdutos(dataP.results || []);
      setCategorias(dataC.results || []);
    };
    carregarDados();
  }, []);

  // FILTRO DO CARROSSEL (Pega o que você marcou no admin)
  const bannersDB = produtos.filter(p => p.noCarrossel).map(p => ({
    id: p.objectId,
    cor: p.cor || "#E63946", 
    img: p.img,
    link: `/produto/${p.objectId}`
  }));

  // Se não tiver nada no banco, mantém os seus originais para não ficar vazio
  const bannersExibicao = bannersDB.length > 0 ? bannersDB : [
    { id: '1', cor: '#E63946', img: '/colar-coracao.png', link: '#' } 
  ];

  const colecoesHome = categorias.filter(c => c.naHome).slice(0, 2);

  // Troca automática de banner
  useEffect(() => {
    if (bannersExibicao.length > 1) {
      const intervalo = setInterval(() => {
        setBannerAtual(prev => (prev + 1) % bannersExibicao.length);
      }, 4000);
      return () => clearInterval(intervalo);
    }
  }, [bannersExibicao]);

  return (
    <main style={{ backgroundColor: '#7FB35D', minHeight: '100vh', padding: '20px' }}>
      
      {/* LOGO SUPERIOR */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#A3B899', borderRadius: '50%', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #758A6B' }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', fontFamily: 'serif' }}>LUT.B</span>
        </div>
      </div>

      {/* BUSCA */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Buscar produto..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ width: '300px', padding: '12px 20px', borderRadius: '15px', border: 'none', outline: 'none' }} 
        />
        <button style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '15px', cursor: 'pointer' }}>
          Buscar
        </button>
      </div>

      {/* CARROSSEL (EXATAMENTE COMO NO PRINT) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ 
          backgroundColor: bannersExibicao[bannerAtual].cor, 
          width: '500px', 
          height: '280px', 
          borderRadius: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 20px',
          position: 'relative'
        }}>
          <button onClick={() => setBannerAtual(prev => (prev === 0 ? bannersExibicao.length - 1 : prev - 1))} style={setaStyle}>‹</button>
          
          <Link href={bannersExibicao[bannerAtual].link} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <img src={bannersExibicao[bannerAtual].img} style={{ maxHeight: '200px', objectFit: 'contain' }} />
          </Link>

          <button onClick={() => setBannerAtual(prev => (prev + 1) % bannersExibicao.length)} style={setaStyle}>›</button>
        </div>
      </div>

      {/* DICA DO DIA */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', width: '500px', padding: '30px', borderRadius: '40px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', fontFamily: 'serif', fontSize: '22px' }}>Dica do dia ✨</h3>
          <p style={{ fontStyle: 'italic', color: '#555', margin: 0 }}>{frase || "Life is better when you sing about bananas."}</p>
        </div>
      </div>

      {/* COLEÇÕES FIXADAS NA HOME */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {colecoesHome.map((cat) => (
          <Link key={cat.objectId} href={`/colecao/${cat.nome.toLowerCase()}`} style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: `linear-gradient(180deg, ${cat.cor1}, ${cat.cor2})`, 
              width: '240px', 
              height: '240px', 
              borderRadius: '40px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: '20px' }}>Coleção</h3>
              <h2 style={{ color: 'white', margin: 0, fontSize: '28px', textTransform: 'capitalize' }}>{cat.nome}</h2>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}

const setaStyle = {
  backgroundColor: 'rgba(255,255,255,0.4)',
  border: 'none',
  color: 'white',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  fontSize: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};