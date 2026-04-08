"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [bannerAtual, setBannerAtual] = useState(0);
  const [historico, setHistorico] = useState(['Colar de Miçanga', 'Brinco Artesanal']);

  const banners = [
    { id: 1, cor: 'var(--banner-orange)', img: '/colar1.png' },
    { id: 2, cor: 'red', img: '/colar2.png' }
  ];

  return (
    <div style={{ padding: '0 20px' }}>
      
      <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '10px', padding: historico.length > 0 ? '10px' : '0', marginBottom: '10px' }}>
        {historico.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '5px 0' }}>
            <span>{item}</span>
          </div>
        ))}
        {historico.length > 0 && (
          <button onClick={() => setHistorico([])} style={{ fontSize: '10px', border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>Limpar Histórico</button>
        )}
      </div>

      <div style={{ position: 'relative', marginTop: '20px' }}>
        <Link href={`/catalogo?banner=${banners[bannerAtual].id}`}>
          <div style={{ 
            background: banners[bannerAtual].cor, 
            height: '220px', 
            borderRadius: '25px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            <img src={banners[bannerAtual].img} alt="Destaque" style={{ height: '90%', objectFit: 'contain' }} />
          </div>
        </Link>

        <button 
          onClick={() => setBannerAtual(bannerAtual === 0 ? 1 : 0)}
          style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '24px', cursor: 'pointer' }}
        >‹</button>
        <button 
          onClick={() => setBannerAtual(bannerAtual === 0 ? 1 : 0)}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '24px', cursor: 'pointer' }}
        >›</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
        {banners.map((_, i) => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: bannerAtual === i ? 'black' : 'rgba(0,0,0,0.3)' }}></div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '15px' }}>
        <Link href="/catalogo/verao" style={{ textDecoration: 'none', color: 'black', width: '50%' }}>
          <div style={{ background: 'var(--card-verao)', height: '230px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '15px' }}>
             <img src="/sol-icon.png" style={{ width: '60px', marginBottom: '15px' }} />
             <h3 style={{ fontSize: '18px' }}>Coleção<br/>Verão 2026</h3>
          </div>
        </Link>

        <Link href="/catalogo/pascoa" style={{ textDecoration: 'none', color: 'black', width: '50%' }}>
          <div style={{ background: 'var(--card-pascoa)', height: '230px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '15px' }}>
             <img src="/coelho-icon.png" style={{ width: '60px', marginBottom: '15px' }} />
             <h3 style={{ fontSize: '18px' }}>Coleção<br/>Páscoa 2026</h3>
          </div>
        </Link>
      </div>
    </div>
  );
}