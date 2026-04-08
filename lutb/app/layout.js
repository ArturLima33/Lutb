"use client";
import { useState } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const [colecoesOpen, setColecoesOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);

  return (
    <html lang="pt-br">
      <body style={{ margin: 0, backgroundColor: '#76BA5B', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{
          position: 'fixed', top: 0, left: isMenuOpen ? 0 : '-100%', width: '280px', height: '100%',
          backgroundColor: '#2D2D1A', zIndex: 100, transition: '0.3s', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>×</button>
          
          <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#228B22', color: 'white', padding: '12px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center' }}>Página Inicial</Link>
          <Link href="/catalogo" onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#9ACD32', color: 'black', padding: '12px', borderRadius: '25px', textDecoration: 'none', textAlign: 'center' }}>Catálogo</Link>
          
          <button onClick={() => setProdutosOpen(!produtosOpen)} style={{ backgroundColor: '#D2691E', color: 'white', padding: '12px', borderRadius: '25px', border: 'none', cursor: 'pointer' }}>Produtos {produtosOpen ? '▲' : '▼'}</button>

          {produtosOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '10px' }}>
              <button onClick={() => setColecoesOpen(!colecoesOpen)} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '8px', border: 'none' }}>Coleções</button>
              {colecoesOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <Link href="/colecao-verao" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Coleção Verão</Link>
                  <Link href="/colecao-pascoa" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Coleção Páscoa</Link>
                  <Link href="/todas-colecoes" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Ver Todas as Coleções</Link>
                </div>
              )}

              <button onClick={() => setCategoriasOpen(!categoriasOpen)} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '8px', border: 'none' }}>Categorias</button>
              {categoriasOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <Link href="/roupas" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Roupas</Link>
                  <Link href="/acessorios" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Acessórios</Link>
                  <Link href="/todas-categorias" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Ver Todas as Categorias</Link>
                </div>
              )}
            </div>
          )}
        </div>

        <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => setIsMenuOpen(true)} style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: '20px' }}>☰</div>
            <span style={{ fontSize: '10px' }}>Menu</span>
          </div>
          <Link href="/"><img src="/logo(lutb).png" style={{ width: '80px', borderRadius: '50%' }} /></Link>
          <div style={{ width: '50px' }}></div>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        <footer style={{ backgroundColor: '#2D2D2D', color: 'white', padding: '20px', marginTop: '40px', borderRadius: '30px 30px 0 0', textAlign: 'center' }}>
          <p>Entre em Contato conosco</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
             <a href="https://instagram.com/lutb.cc" style={{ color: 'white', textDecoration: 'none' }}>lutb.cc</a>
             <a href="#" style={{ color: 'white', textDecoration: 'none' }}>(81) xxxx-xxxx</a>
          </div>
        </footer>
      </body>
    </html>
  );
}