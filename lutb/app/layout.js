"use client";
import { useState } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <html lang="pt-br">
      <body style={{ position: 'relative', overflowX: 'hidden', margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{
          position: 'fixed',
          top: 0,
          left: isMenuOpen ? 0 : '-100%',
          width: '60%',
          maxWidth: '250px',
          height: '100%',
          backgroundColor: '#2D2D1A',
          zIndex: 100,
          transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          boxShadow: isMenuOpen ? '5px 0 15px rgba(0,0,0,0.3)' : 'none'
        }}>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '30px', textAlign: 'left', cursor: 'pointer', marginBottom: '10px' }}>
            ⓧ
          </button>

          <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#228B22', color: 'white', padding: '12px 20px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Página Inicial</Link>
          <Link href="/catalogo" onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#9ACD32', color: 'black', padding: '12px 20px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Catálogo</Link>
          
          <button style={{ 
            backgroundColor: '#D2691E', 
            color: 'white', 
            padding: '12px 20px', 
            borderRadius: '25px', 
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
            outline: 'none'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#B25A1A'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#D2691E'}
          >
            Produtos <span style={{fontSize: '14px', position: 'relative', top: '2px'}}>⌄</span>
          </button>
        </div>

        {isMenuOpen && <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }}></div>}

        <header style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--background-green)' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px' }}>
            <div onClick={() => setIsMenuOpen(true)} style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '10px 15px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '20px' }}>☰</div>
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Menu</span>
            </div>
            
            <Link href="/">
              <img src="/logo(lutb).png" alt="Logo" style={{ width: '85px', height: '85px', borderRadius: '50%', objectFit: 'cover' }} />
            </Link>
            <div style={{ width: '50px' }}></div>
          </div>

          <div style={{ marginTop: '15px', width: '70%', maxWidth: '300px', position: 'relative' }}>
             <div style={{ 
               backgroundColor: 'rgba(0, 0, 0, 0.4)', 
               borderRadius: '20px', 
               display: 'flex', 
               alignItems: 'center', 
               padding: '5px 15px' 
             }}>
               <span style={{ color: 'white', marginRight: '8px', fontSize: '18px' }}>🔍</span>
               <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 type="text" 
                 placeholder="Pesquisar" 
                 style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '16px' }} 
               />
             </div>
          </div>
        </header>

        <main style={{ flex: '1', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {children}
        </main>

        <footer style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '25px 20px', marginTop: '40px', borderRadius: '30px 30px 0 0', width: '100%' }}>
          <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>Entre em Contato conosco</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', alignItems: 'center' }}>
             <a href="https://instagram.com/lutb.cc" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                <img src="/instagram.png" width="22" height="22" alt="" style={{ objectFit: 'contain' }} />
                <span>lutb.cc</span>
             </a>
             <a href="https://wa.me/5581999999999" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                <img src="/whatsapp.png" width="22" height="22" alt="" style={{ objectFit: 'contain' }} />
                <span>(81) xxxx-xxxx</span>
             </a>
          </div>
          <p style={{ textAlign: 'center', fontSize: '11px', marginTop: '20px', opacity: '0.6' }}>© 2026 Lutb. Todos os direitos reservados</p>
        </footer>
      </body>
    </html>
  );
}