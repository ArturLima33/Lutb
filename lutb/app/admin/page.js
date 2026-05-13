"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [abaPrincipal, setAbaPrincipal] = useState("inicio"); // inicio, criar, gerenciar
  const [subAba, setSubAba] = useState(""); 
  
  // Dados do Banco
  const [dados, setDados] = useState({ produtos: [], categorias: [], banners: [] });
  
  // States para formulários
  const [form, setForm] = useState({ nome: "", img: "", cor1: "#987317", cor2: "#cebb4b", naHome: false, link: "", corBanner: "#FF8C00" });

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
    "Content-Type": "application/json",
  };

  const carregarDados = async () => {
    const [resP, resC, resB] = await Promise.all([
      fetch("https://parseapi.back4app.com/classes/Produto", { headers }),
      fetch("https://parseapi.back4app.com/classes/Categoria", { headers }),
      fetch("https://parseapi.back4app.com/classes/Carrossel", { headers })
    ]);
    const p = await resP.json();
    const c = await resC.json();
    const b = await resB.json();
    setDados({ produtos: p.results || [], categorias: c.results || [], banners: b.results || [] });
  };

  useEffect(() => { carregarDados(); }, []);

  // Funções de Ação
  const salvarNoBack4App = async (classe, corpo) => {
    await fetch(`https://parseapi.back4app.com/classes/${classe}`, {
      method: "POST", headers, body: JSON.stringify(corpo)
    });
    alert("Salvo com sucesso!");
    carregarDados();
    setAbaPrincipal("inicio");
  };

  const excluirItem = async (classe, id) => {
    if(confirm("Tem certeza que deseja excluir?")) {
      await fetch(`https://parseapi.back4app.com/classes/${classe}/${id}`, { method: "DELETE", headers });
      carregarDados();
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#2D2D2D" }}>Painel de Controle Lut.B</h1>

      {/* MENU INICIAL - ESCOLHA DE AÇÃO */}
      {abaPrincipal === "inicio" && (
        <div style={gridMenu}>
          <button style={btnGrande} onClick={() => setAbaPrincipal("criar")}>➕ CRIAR NOVO</button>
          <button style={btnGrande} onClick={() => setAbaPrincipal("gerenciar")}>📝 EDITAR / EXCLUIR</button>
        </div>
      )}

      {/* SEÇÃO: CRIAR */}
      {abaPrincipal === "criar" && (
        <div>
          <button onClick={() => setAbaPrincipal("inicio")} style={btnVoltar}>← Voltar</button>
          <div style={flexCenter}>
            <button style={btnSub} onClick={() => setSubAba("produto")}>Produto</button>
            <button style={btnSub} onClick={() => setSubAba("categoria")}>Categoria/Destaque</button>
            <button style={btnSub} onClick={() => setSubAba("banner")}>Banner Carrossel</button>
          </div>

          <div style={cardForm}>
            {subAba === "produto" && (
              <>
                <h3>Novo Produto</h3>
                <input style={inputStl} placeholder="Nome do Produto" onChange={e => setForm({...form, nome: e.target.value})} />
                <input style={inputStl} placeholder="URL da Imagem" onChange={e => setForm({...form, img: e.target.value})} />
                <button style={btnSalvar} onClick={() => salvarNoBack4App("Produto", { nome: form.nome, img: form.img })}>Publicar Produto</button>
              </>
            )}

            {subAba === "categoria" && (
              <>
                <h3>Nova Categoria ou Destaque</h3>
                <input style={inputStl} placeholder="Nome (Ex: Coleção Verão)" onChange={e => setForm({...form, nome: e.target.value})} />
                <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                  <label>Cor 1: <input type="color" value={form.cor1} onChange={e => setForm({...form, cor1: e.target.value})} /></label>
                  <label>Cor 2: <input type="color" value={form.cor2} onChange={e => setForm({...form, cor2: e.target.value})} /></label>
                </div>
                <label><input type="checkbox" onChange={e => setForm({...form, naHome: e.target.checked})} /> Exibir como Destaque na Home</label>
                <button style={btnSalvar} onClick={() => salvarNoBack4App("Categoria", { nome: form.nome, cor1: form.cor1, cor2: form.cor2, naHome: form.naHome })}>Criar Categoria</button>
              </>
            )}

            {subAba === "banner" && (
              <>
                <h3>Adicionar ao Carrossel</h3>
                <select style={inputStl} onChange={e => {
                  const p = dados.produtos.find(x => x.objectId === e.target.value);
                  setForm({...form, img: p.img, link: `/produto/${p.objectId}`});
                }}>
                  <option>Selecione um produto para o banner</option>
                  {dados.produtos.map(p => <option key={p.objectId} value={p.objectId}>{p.nome}</option>)}
                </select>
                <label>Cor de fundo do banner: <input type="color" value={form.corBanner} onChange={e => setForm({...form, corBanner: e.target.value})} /></label>
                <button style={btnSalvar} onClick={() => salvarNoBack4App("Carrossel", { img: form.img, cor: form.corBanner, link: form.link })}>Adicionar ao Carrossel</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* SEÇÃO: GERENCIAR (LISTAR, EDITAR, EXCLUIR) */}
      {abaPrincipal === "gerenciar" && (
        <div>
          <button onClick={() => setAbaPrincipal("inicio")} style={btnVoltar}>← Voltar</button>
          <div style={flexCenter}>
            <button style={btnSub} onClick={() => setSubAba("list-prod")}>Produtos</button>
            <button style={btnSub} onClick={() => setSubAba("list-cat")}>Categorias/Destaques</button>
            <button style={btnSub} onClick={() => setSubAba("list-ban")}>Carrossel</button>
          </div>

          <div style={cardForm}>
            {subAba === "list-prod" && dados.produtos.map(p => (
              <div key={p.objectId} style={itemLista}>
                <span>{p.nome}</span>
                <button style={btnDel} onClick={() => excluirItem("Produto", p.objectId)}>Excluir</button>
              </div>
            ))}

            {subAba === "list-cat" && dados.categorias.map(c => (
              <div key={c.objectId} style={itemLista}>
                <div>
                  <strong>{c.nome}</strong> {c.naHome && <small style={{color: 'orange'}}> (Na Home)</small>}
                </div>
                <button style={btnDel} onClick={() => excluirItem("Categoria", c.objectId)}>Excluir</button>
              </div>
            ))}

            {subAba === "list-ban" && dados.banners.map((b, i) => (
              <div key={b.objectId} style={itemLista}>
                <span>Banner #{i + 1}</span>
                <button style={btnDel} onClick={() => excluirItem("Carrossel", b.objectId)}>Remover do Carrossel</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ESTILOS (CSS-in-JS)
const gridMenu = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "50px" };
const btnGrande = { padding: "50px", fontSize: "20px", cursor: "pointer", borderRadius: "15px", border: "none", backgroundColor: "white", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", fontWeight: "bold" };
const btnVoltar = { marginBottom: "20px", padding: "10px", cursor: "pointer", background: "none", border: "1px solid #ccc", borderRadius: "5px" };
const flexCenter = { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" };
const btnSub = { padding: "10px 20px", cursor: "pointer", borderRadius: "20px", border: "none", backgroundColor: "#2D2D2D", color: "white" };
const cardForm = { backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" };
const inputStl = { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ddd" };
const btnSalvar = { width: "100%", padding: "15px", marginTop: "20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const itemLista = { display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #eee", alignItems: "center" };
const btnDel = { backgroundColor: "#ff4444", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" };