"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const [colecoesOpen, setColecoesOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <html lang="pt-br">
      <body style={{ position: 'relative', overflowX: 'hidden', margin: 0, backgroundColor: '#76BA5B', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{
          position: 'fixed',
          top: 0,
          left: isMenuOpen ? 0 : '-100%',
          width: '70%',
          maxWidth: '280px',
          height: '100%',
          backgroundColor: '#2D2D1A',
          zIndex: 100,
          transition: '0.3s',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button onClick={closeMenu} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', textAlign: 'left', cursor: 'pointer', marginBottom: '10px' }}>
             <span style={{ border: '2px solid white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</span>
          </button>

          <Link href="/" onClick={closeMenu} style={{ backgroundColor: '#228B22', color: 'white', padding: '10px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center', fontSize: '18px' }}>Página Inicial</Link>
          
          <Link href="/catalogo" onClick={closeMenu} style={{ backgroundColor: '#9ACD32', color: 'black', padding: '10px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center', fontSize: '18px' }}>Catálogo</Link>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setProdutosOpen(!produtosOpen)} style={{ backgroundColor: '#D2691E', color: 'white', padding: '10px 20px', borderRadius: '25px', fontSize: '18px', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <span style={{ margin: '0 auto' }}>Produtos</span>
              <span style={{ position: 'absolute', right: '20px' }}>{produtosOpen ? '⌃' : '⌄'}</span>
            </button>

            {produtosOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 5px' }}>
                
                <button onClick={() => setColecoesOpen(!colecoesOpen)} style={{ backgroundColor: 'white', color: 'black', padding: '8px 20px', borderRadius: '20px', border: 'none', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                  <span style={{ margin: '0 auto' }}>Coleções</span>
                  <span style={{ position: 'absolute', right: '15px' }}>{colecoesOpen ? '⌃' : '⌄'}</span>
                </button>
                {colecoesOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                    <Link href="/colecao-verao" onClick={closeMenu} style={{ backgroundColor: '#E0E0E0', color: 'black', textDecoration: 'none', fontSize: '13px', padding: '6px 20px', borderRadius: '15px', width: '85%', textAlign: 'center' }}>Coleção Verão</Link>
                    <Link href="/colecao-pascoa" onClick={closeMenu} style={{ backgroundColor: '#E0E0E0', color: 'black', textDecoration: 'none', fontSize: '13px', padding: '6px 20px', borderRadius: '15px', width: '85%', textAlign: 'center' }}>Coleção Páscoa</Link>
                    <Link href="/todas-colecoes" onClick={closeMenu} style={{ backgroundColor: '#BDBDBD', color: 'black', textDecoration: 'none', fontSize: '13px', padding: '6px 20px', borderRadius: '15px', width: '85%', textAlign: 'center', fontWeight: 'bold' }}>Todas as Coleções</Link>
                  </div>
                )}

                <button onClick={() => setCategoriasOpen(!categoriasOpen)} style={{ backgroundColor: 'white', color: 'black', padding: '8px 20px', borderRadius: '20px', border: 'none', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                  <span style={{ margin: '0 auto' }}>Categorias</span>
                  <span style={{ position: 'absolute', right: '15px' }}>{categoriasOpen ? '⌃' : '⌄'}</span>
                </button>
                {categoriasOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                    <Link href="/roupas" onClick={closeMenu} style={{ backgroundColor: '#E0E0E0', color: 'black', textDecoration: 'none', fontSize: '13px', padding: '6px 20px', borderRadius: '15px', width: '85%', textAlign: 'center' }}>Roupas</Link>
                    <Link href="/acessorios" onClick={closeMenu} style={{ backgroundColor: '#E0E0E0', color: 'black', textDecoration: 'none', fontSize: '13px', padding: '6px 20px', borderRadius: '15px', width: '85%', textAlign: 'center' }}>Acessórios</Link>
                    <Link href="/todas-categorias" onClick={closeMenu} style={{ backgroundColor: '#BDBDBD', color: 'black', textDecoration: 'none', fontSize: '13px', padding: '6px 20px', borderRadius: '15px', width: '85%', textAlign: 'center', fontWeight: 'bold' }}>Todas as Categorias</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isMenuOpen && <div onClick={closeMenu} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }}></div>}

        <header style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div onClick={() => setIsMenuOpen(true)} style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '10px 14px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '24px' }}>☰</div>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Menu</span>
            </div>
            
            <Link href="/">
                <img src="/logo(lutb).png" alt="Logo" style={{ width: '100px', borderRadius: '50%', cursor: 'pointer' }} />
            </Link>

            <div style={{ width: '60px' }}></div>
          </div>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        <footer style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '20px 10px', marginTop: '40px', borderRadius: '30px 30px 0 0', textAlign: 'center' }}>
          <p style={{ marginBottom: '15px', fontSize: '14px' }}>Entre em Contato conosco</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
             <a href="https://instagram.com/lutb.cc" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', textDecoration: 'none', fontSize: '13px' }}>
                <img src="/instagram.png" width="22" height="22" alt="" />
                <span>lutb.cc</span>
             </a>
             <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', textDecoration: 'none', fontSize: '13px' }}>
                <img src="/whatsapp.png" width="40" height="40" alt="" />
                <span>(81) xxxx-xxxx</span>
             </a>
          </div>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '15px' }}>© 2026 LutB. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
}