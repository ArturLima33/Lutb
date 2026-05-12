"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [nomeProd, setNomeProd] = useState("");
  const [catSelecionada, setCatSelecionada] = useState("");
  const [noCarrossel, setNoCarrossel] = useState(false);
  const [corProd, setCorProd] = useState("#E63946");

  const [nomeCat, setNomeCat] = useState("");
  const [cor1, setCor1] = useState("#987317");
  const [cor2, setCor2] = useState("#cebb4b");
  const [naHome, setNaHome] = useState(false);

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
    "Content-Type": "application/json",
  };

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    const resP = await fetch("https://parseapi.back4app.com/classes/Produto", { headers });
    const dataP = await resP.json();
    setProdutos(dataP.results || []);

    const resC = await fetch("https://parseapi.back4app.com/classes/Categoria", { headers });
    const dataC = await resC.json();
    setCategorias(dataC.results || []);
  };

  const salvarCategoria = async () => {
    const gradiente = `linear-gradient(180deg, ${cor1}, ${cor2})`;
    await fetch("https://parseapi.back4app.com/classes/Categoria", {
      method: "POST",
      headers,
      body: JSON.stringify({ nome: nomeCat, estilo: gradiente, naHome })
    });
    setNomeCat(""); carregarDados();
  };

  const salvarProduto = async () => {
    await fetch("https://parseapi.back4app.com/classes/Produto", {
      method: "POST",
      headers,
      body: JSON.stringify({ nome: nomeProd, categoria: catSelecionada, noCarrossel, cor: corProd })
    });
    setNomeProd(""); carregarDados();
  };

  const excluir = async (classe, id) => {
    await fetch(`https://parseapi.back4app.com/classes/${classe}/${id}`, { method: "DELETE", headers });
    carregarDados();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Painel Administrativo</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* GERENCIAR COLEÇÕES */}
        <section style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h3>Nova Coleção / Categoria</h3>
          <input placeholder="Nome da Coleção" value={nomeCat} onChange={e => setNomeCat(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="color" value={cor1} onChange={e => setCor1(e.target.value)} title="Cor Topo" />
            <input type="color" value={cor2} onChange={e => setCor2(e.target.value)} title="Cor Base" />
          </div>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input type="checkbox" checked={naHome} onChange={e => setNaHome(e.target.checked)} /> Fixar na Home (Max 2)
          </label>
          <button onClick={salvarCategoria} style={{ background: '#2D2D1A', color: 'white', border: 'none', padding: '10px', width: '100%', borderRadius: '5px' }}>Criar Coleção</button>
        </section>

        {/* GERENCIAR PRODUTOS */}
        <section style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h3>Novo Produto</h3>
          <input placeholder="Nome" value={nomeProd} onChange={e => setNomeProd(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <select value={catSelecionada} onChange={e => setCatSelecionada(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
            <option value="">Escolher Coleção</option>
            {categorias.map(c => <option key={c.objectId} value={c.nome}>{c.nome}</option>)}
          </select>
          <div style={{ marginBottom: '10px' }}>
             Cor do Título: <input type="color" value={corProd} onChange={e => setCorProd(e.target.value)} />
          </div>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input type="checkbox" checked={noCarrossel} onChange={e => setNoCarrossel(e.target.checked)} /> Adicionar ao Carrossel
          </label>
          <button onClick={salvarProduto} style={{ background: '#2D2D1A', color: 'white', border: 'none', padding: '10px', width: '100%', borderRadius: '5px' }}>Salvar Produto</button>
        </section>
      </div>

      <h3 style={{ marginTop: '40px' }}>Categorias & Produtos</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {categorias.map(c => (
          <div key={c.objectId} style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '10px', borderRadius: '10px' }}>
            <span><b>Coleção:</b> {c.nome} {c.naHome ? "⭐" : ""}</span>
            <button onClick={() => excluir("Categoria", c.objectId)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}