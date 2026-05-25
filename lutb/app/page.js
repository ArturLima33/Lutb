"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [frase, setFrase] = useState("");
  const [busca, setBusca] = useState("");
  const [itensBusca, setItensBusca] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [selecionado, setSelecionado] = useState(-1);
  const [banners, setBanners] = useState([]);
  const [bannerAtual, setBannerAtual] = useState(0);
  const [colecoes, setColecoes] = useState([]);
  const router = useRouter();
  const boxRef = useRef(null);

  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then(res => res.json())
      .then(data => setFrase(data.slip.advice));
  }, []);

  useEffect(() => {
    const carregarDadosSugestoes = async () => {
      try {
        const { data: produtos } = await supabase.from("Produto").select("id, nome, descricao, img");
        const { data: categorias } = await supabase.from("Categoria").select("id, nome");
        const { data: colecoesBD } = await supabase.from("Colecao").select("id, nome, icone");

        const produtosFormatados = (produtos || []).map(p => ({
          id: p.id,
          nome: p.nome || "",
          imagem: p.img && p.img !== "" ? p.img : "/logo(lutb).png",
          tipo: "Produto",
          link: `/produto/${p.id}`
        }));

        const categoriasFormatadas = (categorias || []).map(c => ({
          id: c.id,
          nome: c.nome || "",
          imagem: "/logo(lutb).png",
          tipo: "Categoria",
          link: `/categoria/${c.id}`
        }));

        const colecoesFormatadas = (colecoesBD || []).map(c => ({
          id: c.id,
          nome: c.nome || "",
          imagem: c.icone && c.icone !== "" ? c.icone : "/logo(lutb).png",
          tipo: "Coleção",
          link: `/colecao/${c.id}`
        }));

        setItensBusca([
          ...produtosFormatados,
          ...categoriasFormatadas,
          ...colecoesFormatadas
        ]);
      } catch (err) {
        console.error("Erro ao carregar dados para busca:", err);
      }
    };

    carregarDadosSugestoes();
  }, []);

  useEffect(() => {
    const carregarBanners = async () => {
      const { data } = await supabase.from("Banner").select("*").order("created_at", { ascending: true });
      setBanners(data || []);
    };
    carregarBanners();
  }, []);

  useEffect(() => {
    const carregarColecoes = async () => {
      const { data } = await supabase.from("Colecao").select("*").eq("fixar_home", true).order("created_at", { ascending: true });
      setColecoes((data || []).slice(0, 2));
    };
    carregarColecoes();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const intervalo = setInterval(() => {
      setBannerAtual(prev => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [banners]);

  const alternarBanner = (direcao) => {
    if (direcao === 'prev') {
      setBannerAtual(prev => (prev === 0 ? banners.length - 1 : prev - 1));
    } else {
      setBannerAtual(prev => (prev + 1) % banners.length);
    }
  };

  useEffect(() => {
    if (!busca.trim() || itensBusca.length === 0) {
      setSugestoes([]);
      setSelecionado(-1);
      return;
    }
    const termo = busca.toLowerCase();
    const comeca = itensBusca.filter(p => p.nome.toLowerCase().startsWith(termo));
    const contem = itensBusca.filter(p => p.nome.toLowerCase().includes(termo) && !p.nome.toLowerCase().startsWith(termo));
    
    setSugestoes([...comeca, ...contem].slice(0, 5));
    setSelecionado(-1);
  }, [busca, itensBusca]);

  const pesquisar = () => {
    if (!busca.trim()) return;
    router.push(`/busca?q=${busca}`);
    setMostrarSugestoes(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelecionado(prev => prev < sugestoes.length - 1 ? prev + 1 : prev); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelecionado(prev => prev > -1 ? prev - 1 : prev); }
    if (e.key === "Enter") {
      if (selecionado >= 0 && selecionado < sugestoes.length) {
        router.push(sugestoes[selecionado].link);
        setMostrarSugestoes(false);
      } else { pesquisar(); }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) setMostrarSugestoes(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const destacarTexto = (texto, termo) => {
    const index = texto.toLowerCase().indexOf(termo.toLowerCase());
    if (index === -1) return texto;
    const inicio = texto.slice(0, index);
    const meio = texto.slice(index, index + termo.length);
    const fim = texto.slice(index + termo.length);
    return (
      <>{inicio}<strong style={{ color: '#E63946', fontWeight: 'bold' }}>{meio}</strong>{fim}</>
    );
  };

  const bannerAtualDados = banners[bannerAtual];

  return (
    <div style={{ padding: '20px' }}>
      
      {/* BARRA DE PESQUISA COMPRIDA, SEM LUPA E COM SEU NOVO VISUAL */}
      <div ref={boxRef} style={{ width: "100%", marginBottom: "25px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", borderRadius: "100px", padding: "6px 6px 6px 18px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
          
          <input 
            type="text" 
            placeholder="Buscar produtos, categorias ou coleções..." 
            value={busca} 
            onChange={(e) => { setBusca(e.target.value); setMostrarSugestoes(true); }} 
            onKeyDown={handleKeyDown} 
            onFocus={() => setMostrarSugestoes(true)}
            style={{ flex: 1, border: "none", outline: "none", fontSize: "16px", color: "#333", background: "transparent" }} 
          />

          {busca && (
            <button 
              onClick={() => { setBusca(""); setSugestoes([]); }} 
              style={{ background: "none", border: "none", color: "#999", fontSize: "18px", cursor: "pointer", marginRight: "10px", padding: "5px" }}
            >
              ×
            </button>
          )}

          <button 
            onClick={pesquisar} 
            style={{ padding: "10px 24px", borderRadius: "100px", border: "none", backgroundColor: "#2D2D2D", color: "white", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}
          >
            Buscar
          </button>
        </div>

        {/* MENU DE SUGESTÕES ESTILO IMAGE_B974E5.PNG */}
        {mostrarSugestoes && busca && sugestoes.length > 0 && (
          <div style={{ position: "absolute", top: "115%", left: 0, width: "100%", background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", zIndex: 100, overflow: "hidden", border: "1px solid #f0f0f0" }}>
            {sugestoes.map((item, index) => (
              <div 
                key={`${item.tipo}-${item.id}`} 
                onClick={() => { router.push(item.link); setMostrarSugestoes(false); }} 
                style={{ padding: "14px 20px", cursor: "pointer", borderBottom: "1px solid #f5f5f5", backgroundColor: selecionado === index ? "#f0f7ed" : "white", display: "flex", alignItems: "center", gap: "14px", transition: "background 0.2s" }}
              >
                <img src={item.imagem} style={{ width: "35px", height: "35px", objectFit: "contain", borderRadius: "50%", backgroundColor: "#f9f9f9" }} alt="" />
                
                <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
                  <span style={{ color: "#2D2D2D", fontSize: "15px", fontWeight: "500" }}>
                    {destacarTexto(item.nome, busca)}
                  </span>
                  <span style={{ fontSize: "11px", color: "#888", fontStyle: "italic", marginTop: "2px" }}>
                    {item.tipo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bannerAtualDados && (
        <div style={{ background: bannerAtualDados.cor, height: '210px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <button onClick={() => alternarBanner('prev')} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px' }}>‹</button>
          <Link href={`/produto/${bannerAtualDados.produto_id}`} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={bannerAtualDados.img} style={{ height: '85%' }} alt="Banner" />
          </Link>
          <button onClick={() => alternarBanner('next')} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px' }}>›</button>
        </div>
      )}

      <div style={{ backgroundColor: 'white', marginTop: '25px', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '10px' }}>Dica do dia ✨</h3>
        <p style={{ fontStyle: 'italic', color: '#555' }}>{frase || "Carregando..."}</p>
      </div>

      {colecoes.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '15px' }}>
          {colecoes.map((c) => (
            <Link key={c.id} href={`/colecao/${c.id}`} style={{ background: c.cor || '#76BA5B', width: '47%', height: '220px', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              {c.icone && <img src={c.icone} style={{ width: '75px' }} alt={c.nome} />}
              <h3 style={{ color: 'white', textAlign: 'center', padding: '0 10px' }}>{c.nome}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}