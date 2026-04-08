"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [bannerAtual, setBannerAtual] = useState(0);

  const banners = [
    { id: 2, cor: 'linear-gradient(135deg, #FF8C00, #D2691E)', img: '/colar-musgo.png', link: '/novidades/2' },
    { id: 3, cor: 'linear-gradient(135deg, #FF4500, #8B0000)', img: '/moranguito.png', link: '/novidades/3' }
  ];

  const alternarBanner = () => setBannerAtual((prev) => (prev === 0 ? 1 : 0));

  return (
    <div style={{ padding: '20px' }}>
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
        <button onClick={(e) => { e.preventDefault(); alternarBanner(); }} style={{ background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>‹</button>
        
        <Link href={banners[bannerAtual].link} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={banners[bannerAtual].img} alt="Destaque" style={{ height: '85%', objectFit: 'contain' }} />
        </Link>
        
        <button onClick={(e) => { e.preventDefault(); alternarBanner(); }} style={{ background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>›</button>
        
        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: bannerAtual === 0 ? 'white' : 'rgba(255,255,255,0.4)' }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: bannerAtual === 1 ? 'white' : 'rgba(255,255,255,0.4)' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <Link href="/colecao-verao" style={{ 
          background: 'linear-gradient(180deg, #DAA520 0%, #FFD700 100%)', 
          width: '47%', height: '220px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '15px', textDecoration: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
        }}>
           <img src="/sol-icon.png" style={{ width: '75px', marginBottom: '15px' }} />
           <h3 style={{ color: '#2D2D1A', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Coleção Verão 2026</h3>
        </Link>
        
        <Link href="/colecao-pascoa" style={{ 
          background: 'linear-gradient(180deg, #8B4513 0%, #FFC0CB 100%)', 
          width: '47%', height: '220px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '15px', textDecoration: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
        }}>
           <img src="/coelho-icon.png" style={{ width: '75px', marginBottom: '15px' }} />
           <h3 style={{ color: '#2D2D1A', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Coleção Páscoa 2026</h3>
        </Link>
      </div>
    </div>
  );
}