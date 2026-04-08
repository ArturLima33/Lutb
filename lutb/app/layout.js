"use client";
import { useState } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const [colecoesOpen, setColecoesOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <html lang="pt-br">
      <body style={{ margin: 0, backgroundColor: '#76BA5B', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Menu Lateral */}
        <div style={{
          position: 'fixed', top: 0, left: isMenuOpen ? 0 : '-100%', width: '280px', height: '100%',
          backgroundColor: '#2D2D1A', zIndex: 100, transition: '0.3s', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <button onClick={closeMenu} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', textAlign: 'left' }}>×</button>
          
          <Link href="/" onClick={closeMenu} style={{ backgroundColor: '#228B22', color: 'white', padding: '12px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center' }}>Página Inicial</Link>
          <Link href="/catalogo" onClick={closeMenu} style={{ backgroundColor: '#9ACD32', color: 'black', padding: '12px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center' }}>Catálogo</Link>
          
          <button onClick={() => setProdutosOpen(!produtosOpen)} style={{ backgroundColor: '#D2691E', color: 'white', padding: '12px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Produtos</button>

          {produtosOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => setColecoesOpen(!colecoesOpen)} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '8px', border: 'none' }}>Coleções</button>
              {colecoesOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <Link href="/colecao-verao" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none' }}>Coleção Verão</Link>
                  <Link href="/colecao-pascoa" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none' }}>Coleção Páscoa</Link>
                  <Link href="/todas-colecoes" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Todas as Coleções</Link>
                </div>
              )}

              <button onClick={() => setCategoriasOpen(!categoriasOpen)} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '8px', border: 'none' }}>Categorias</button>
              {categoriasOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <Link href="/roupas" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none' }}>Roupas</Link>
                  <Link href="/acessorios" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none' }}>Acessórios</Link>
                  <Link href="/todas-categorias" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Todas as Categorias</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Fixo com uma Única Logo */}
        <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => setIsMenuOpen(true)} style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', minWidth: '50px' }}>
            <div style={{ fontSize: '20px' }}>☰</div>
            <span style={{ fontSize: '10px' }}>Menu</span>
          </div>
          <Link href="/"><img src="/logo(lutb).png" alt="Logo" style={{ width: '80px', borderRadius: '50%' }} /></Link>
          <div style={{ width: '50px' }}></div>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        {/* Rodapé de Contato (Presente em todas as páginas) */}
        <footer style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '20px 10px', marginTop: '40px', borderRadius: '30px 30px 0 0', textAlign: 'center' }}>
          <p style={{ marginBottom: '15px', fontSize: '14px' }}>Entre em Contato conosco</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
             <a href="https://instagram.com/lutb.cc" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', textDecoration: 'none' }}>
                <img src="/instagram.png" width="22" height="22" alt="Instagram" />
                <span>lutb.cc</span>
             </a>
             <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', textDecoration: 'none' }}>
                <img src="/whatsapp.png" width="35" height="35" alt="Whatsapp" />
                <span>(81) xxxx-xxxx</span>
             </a>
          </div>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '15px' }}>© 2026 LutB. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
}