"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BuscaConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [buscaInterna, setBuscaInterna] = useState(query);
  const [itensBusca, setItensBusca] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [selecionado, setSelecionado] = useState(-1);
  const [carregando, setCarregando] = useState(true);
  const boxRef = useRef(null);

  useEffect(() => {
    setBuscaInterna(query);
  }, [query]);

  useEffect(() => {
    const carregarTudo = async () => {
      setCarregando(true);
      try {
        const { data: produtos } = await supabase.from("Produto").select("id, nome, descricao, img, preco");
        const { data: categorias } = await supabase.from("Categoria").select("id, nome");
        const { data: colecoes } = await supabase.from("Colecao").select("id, nome, icone");

        const produtosFormatados = (produtos || []).map(p => ({
          id: p.id,
          nome: p.nome || "",
          descricao: p.descricao || "",
          imagem: p.img && p.img !== "" ? p.img : "/logo(lutb).png",
          preco: p.preco,
          tipo: "produto",
          link: `/produto/${p.id}`
        }));

        const categoriasFormatadas = (categorias || []).map(c => ({
          id: c.id,
          nome: c.nome || "",
          descricao: "Categoria de produtos",
          imagem: "/logo(lutb).png",
          preco: null,
          tipo: "categoria",
          link: `/categoria/${c.id}`
        }));

        const colecoesFormatadas = (colecoes || []).map(c => ({
          id: c.id,
          nome: c.nome || "",
          descricao: "Coleção especial",
          imagem: c.icone && c.icone !== "" ? c.icone : "/logo(lutb).png",
          preco: null,
          tipo: "coleção",
          link: `/colecao/${c.id}`
        }));

        setItensBusca([
          ...produtosFormatados,
          ...categoriasFormatadas,
          ...colecoesFormatadas
        ]);
      } catch (err) {
        console.error("Erro ao carregar itens do Supabase:", err);
      }
      setCarregando(false);
    };

    carregarTudo();
  }, []);

  useEffect(() => {
    if (!query || itensBusca.length === 0) {
      setResultados([]);
      return;
    }

    const termo = query.toLowerCase().trim();
    const comecaNome = [];
    const contemNome = [];
    const contemDescricao = [];

    itensBusca.forEach(item => {
      const nome = item.nome.toLowerCase();
      const desc = item.descricao.toLowerCase();

      if (nome.startsWith(termo)) {
        comecaNome.push(item);
      } else if (nome.includes(termo)) {
        contemNome.push(item);
      } else if (item.tipo === "produto" && desc.includes(termo)) {
        contemDescricao.push(item);
      }
    });

    setResultados([
      ...comecaNome,
      ...contemNome,
      ...contemDescricao
    ]);
  }, [query, itensBusca]);

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

  const executarPesquisa = () => {
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
      } else {
        executarPesquisa();
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
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      
      <button
        onClick={() => router.back()}
        style={{
          background: "#2D2D2D",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer",
          marginBottom: "15px"
        }}
      >
        ←
      </button>

      {/* BARRA COMPRIDA E SEM LUPA */}
      <div ref={boxRef} style={{ width: "100%", margin: "0 auto 25px auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", borderRadius: "100px", padding: "6px 6px 6px 18px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
          
          <input
            placeholder="Fazer nova busca..."
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
            onClick={executarPesquisa} 
            style={{ padding: "10px 22px", borderRadius: "100px", border: "none", backgroundColor: "#2D2D2D", color: "white", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}
          >
            Buscar
          </button>
        </div>

        {mostrarSugestoes && buscaInterna && sugestoes.length > 0 && (
          <div style={{ position: "absolute", top: "115%", left: 0, width: "100%", background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", zIndex: 100, overflow: "hidden", border: "1px solid #f0f0f0" }}>
            {sugestoes.map((item, index) => (
              <div 
                key={`${item.tipo}-${item.id}`} 
                onClick={() => router.push(item.link)} 
                style={{ padding: "14px 20px", cursor: "pointer", borderBottom: "1px solid #f5f5f5", backgroundColor: selecionado === index ? "#f0f7ed" : "white", display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img src={item.imagem} style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "6px" }} alt="" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#2D2D1A", fontSize: "15px" }}>{destacarTexto(item.nome, buscaInterna)}</span>
                  <span style={{ fontSize: "10px", color: "#999", fontStyle: "italic", textTransform: "capitalize" }}>{item.tipo}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2>
        Resultados para: "{query}"
      </h2>

      {carregando ? (
        <div style={{ marginTop: "40px", textAlign: "center", color: "#777" }}>
          <p>Buscando no catálogo...</p>
        </div>
      ) : resultados.length === 0 ? (
        <div style={{ marginTop: "40px", textAlign: "center", color: "#777" }}>
          <img src="/empty.png" style={{ width: "150px", opacity: 0.6 }} alt="" />
          <p>Nenhum resultado encontrado 😢</p>
        </div>
      ) : (
        /* RETORNO DO LAYOUT EM GRID DE 2 COLUNAS */
        <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {resultados.map(item => (
            <div
              key={`${item.tipo}-${item.id}`}
              onClick={() => router.push(item.link)}
              style={{
                background: "white",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                cursor: "pointer",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <img
                src={item.imagem}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "contain"
                }}
                alt={item.nome}
              />

              <div style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", color: "#2D2D2D" }}>
                      {item.nome}
                    </h3>
                    <span style={{ fontSize: "11px", fontStyle: "italic", color: "#777", textTransform: "lowercase" }}>
                      {item.tipo}
                    </span>
                  </div>

                  <p style={{ fontSize: "14px", color: "#555", marginTop: "5px", marginBottom: "5px", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.descricao}
                  </p>
                </div>

                {item.tipo === "produto" && item.preco && (
                  <p style={{ fontWeight: "bold", color: "#2D2D1A", margin: "5px 0 0 0", fontSize: "15px" }}>
                    R$ {item.preco}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}