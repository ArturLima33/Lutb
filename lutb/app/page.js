"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {

  const [frase, setFrase] = useState("");

  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then(res => res.json())
      .then(data => setFrase(data.slip.advice));
  }, []);

  const banners = [
    { id: 2, cor: 'linear-gradient(135deg, #FF8C00, #D2691E)', img: '/colar-musgo.png', link: '/produto/2' },
    { id: 3, cor: 'linear-gradient(135deg, #FF4500, #8B0000)', img: '/moranguito.png', link: '/produto/3' }
  ];

  const [bannerAtual, setBannerAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerAtual(prev => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  const alternarBanner = (direcao) => {
    if (direcao === 'prev') {
      setBannerAtual(prev => (prev === 0 ? banners.length - 1 : prev - 1));
    } else {
      setBannerAtual(prev => (prev + 1) % banners.length);
    }
  };

  return (
    <div style={{ padding: '20px' }}>

      {/* CARROSSEL */}
      <div style={{ 
        background: banners[bannerAtual].cor, 
        height: '210px', 
        borderRadius: '25px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 10px',
        position: 'relative',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <button onClick={() => alternarBanner('prev')} style={{ 
          background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', 
          fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px'
        }}>‹</button>
        
        <Link href={banners[bannerAtual].link} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={banners[bannerAtual].img} style={{ height: '85%' }} />
        </Link>
        
        <button onClick={() => alternarBanner('next')} style={{ 
          background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', 
          fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px'
        }}>›</button>
      </div>

      {/* API BONITINHA */}
      <div style={{
        backgroundColor: 'white',
        marginTop: '25px',
        padding: '20px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Dica do dia ✨</h3>
        <p style={{ fontStyle: 'italic', color: '#555' }}>
          {frase || "Carregando..."}
        </p>
      </div>

      {/* COLEÇÕES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <Link href="/colecao-verao" style={{ 
          background: 'linear-gradient(180deg, #987317, #cebb4b)', 
          width: '47%', height: '220px', borderRadius: '25px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none'
        }}>
          <img src="/sol-icon.png" style={{ width: '75px' }} />
          <h3>Coleção Verão</h3>
        </Link>

        <Link href="/colecao-pascoa" style={{ 
          background: 'linear-gradient(180deg, #8B4513, #FFC0CB)', 
          width: '47%', height: '220px', borderRadius: '25px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none'
        }}>
          <img src="/coelho-icon.png" style={{ width: '75px' }} />
          <h3>Coleção Páscoa</h3>
        </Link>
      </div>
    </div>
  );
}