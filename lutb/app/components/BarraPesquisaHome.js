"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BarraPesquisaHome() {
  const router = useRouter();
  const [buscaInterna, setBuscaInterna] = useState("");
  const [itensBusca, setItensBusca] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [selecionado, setSelecionado] = useState(-1);
  const boxRef = useRef(null);

  useEffect(() => {
    const carregarDadosSugestoes = async () => {
      try {
        const { data: produtos } = await supabase.from("Produto").select("id, nome, descricao, img");
        const { data: categorias } = await supabase.from("Categoria").select("id, nome");
        const { data: colecoes } = await supabase.from("Colecao").select("id, nome, icone");

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

        const colecoesFormatadas = (colecoes || []).map(c => ({
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
        console.error("Erro ao carregar dados para sugestões:", err);
      }
    };

    carregarDadosSugestoes();
  }, []);

  useEffect(() => {
    if (!buscaInterna.trim() || itensBusca.length === 0) {
      setSugestoes([]);
      setSelecionado(-1);
      return;
    }
    const termo = buscaInterna.toLowerCase();
    const comeca = itensBusca.filter(p => p.nome.toLowerCase().startsWith(termo));
    const contem = itensBusca.filter(p => p.nome.toLowerCase().includes(termo) && !p.nome.toLowerCase().startsWith(termo));
    
    setSugestoes([...comeca, ...contem].slice(0, 5));
    setSelecionado(-1);
  }, [buscaInterna, itensBusca]);

  const ejecutarPesquisa = () => {
    if (!buscaInterna.trim()) return;
    router.push(`/busca?q=${buscaInterna}`);
    setMostrarSugestoes(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelecionado(prev => prev < sugestoes.length - 1 ? prev + 1 : prev);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelecionado(prev => prev > -1 ? prev - 1 : prev);
    }
    if (e.key === "Enter") {
      if (selecionado >= 0 && selecionado < sugestoes.length) {
        router.push(sugestoes[selecionado].link);
        setMostrarSugestoes(false);
      } else {
        ejecutarPesquisa();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setMostrarSugestoes(false);
      }
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

  return (
    <div ref={boxRef} style={{ width: "100%", maxWidth: "800px", margin: "0 auto", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", borderRadius: "100px", padding: "6px 6px 6px 18px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
        
        <input
          placeholder="Buscar produtos, categorias ou coleções..."
          value={buscaInterna}
          onChange={(e) => { setBuscaInterna(e.target.value); setMostrarSugestoes(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setMostrarSugestoes(true)}
          style={{ flex: 1, border: "none", outline: "none", fontSize: "16px", color: "#333", background: "transparent" }}
        />

        {buscaInterna && (
          <button 
            onClick={() => { setBuscaInterna(""); setSugestoes([]); }} 
            style={{ background: "none", border: "none", color: "#999", fontSize: "18px", cursor: "pointer", marginRight: "10px", padding: "5px" }}
          >
            ×
          </button>
        )}

        <button 
          onClick={ejecutarPesquisa} 
          style={{ padding: "10px 24px", borderRadius: "100px", border: "none", backgroundColor: "#2D2D2D", color: "white", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}
        >
          Buscar
        </button>
      </div>

      {mostrarSugestoes && buscaInterna && sugestoes.length > 0 && (
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
                  {destacarTexto(item.nome, buscaInterna)}
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
  );
}