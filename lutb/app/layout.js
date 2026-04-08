"use client";
import { useState } from "react";
import Link from "next/link";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const [colecoesOpen, setColecoesOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <html lang="pt-br">
      <body style={{ margin: 0, backgroundColor: '#76BA5B', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          position: 'fixed', top: 0, left: isMenuOpen ? 0 : '-100%', width: '280px', height: '100%',
          backgroundColor: '#2D2D1A', zIndex: 100, transition: '0.3s', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <button onClick={closeMenu} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>×</button>
          
          <Link href="/" onClick={closeMenu} style={{ backgroundColor: '#228B22', color: 'white', padding: '10px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center' }}>Página Inicial</Link>
          <Link href="/catalogo" onClick={closeMenu} style={{ backgroundColor: '#9ACD32', color: 'black', padding: '10px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center' }}>Catálogo</Link>
          
          <button onClick={() => setProdutosOpen(!produtosOpen)} style={{ backgroundColor: '#D2691E', color: 'white', padding: '10px', borderRadius: '25px', border: 'none' }}>Produtos</button>

          {produtosOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => setColecoesOpen(!colecoesOpen)} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '8px' }}>Coleções</button>
              {colecoesOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                  <Link href="/colecao-verao" onClick={closeMenu} style={{ color: 'white', fontSize: '14px' }}>Coleção Verão (1)</Link>
                  <Link href="/colecao-pascoa" onClick={closeMenu} style={{ color: 'white', fontSize: '14px' }}>Coleção Páscoa (2)</Link>
                  <Link href="/todas-colecoes" onClick={closeMenu} style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Todas as Coleções (4)</Link>
                </div>
              )}

              <button onClick={() => setCategoriasOpen(!categoriasOpen)} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '8px' }}>Categorias</button>
              {categoriasOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                  <Link href="/roupas" onClick={closeMenu} style={{ color: 'white', fontSize: '14px' }}>Roupas (3)</Link>
                  <Link href="/acessorios" onClick={closeMenu} style={{ color: 'white', fontSize: '14px' }}>Acessórios (6)</Link>
                  <Link href="/todas-categorias" onClick={closeMenu} style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Todas as Categorias (5)</Link>
                </div>
              )}
            </div>
          )}
        </div>

        <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => setIsMenuOpen(true)} style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center' }}>
            <div>☰</div><span style={{ fontSize: '10px' }}>Menu</span>
          </div>
          <Link href="/"><img src="/logo(lutb).png" style={{ width: '80px', borderRadius: '50%' }} /></Link>
          <div style={{ width: '50px' }}></div>
        </header>

        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}