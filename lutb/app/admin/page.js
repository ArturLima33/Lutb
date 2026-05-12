"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nomeProd, setNomeProd] = useState("");
  const [catSelecionada, setCatSelecionada] = useState("");
  const [noCarrossel, setNoCarrossel] = useState(false);
  const [nomeCat, setNomeCat] = useState("");
  const [exibirHome, setExibirHome] = useState(false);

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    atualizarDados();
  }, []);

  const atualizarDados = () => {
    fetch("https://parseapi.back4app.com/classes/Produto", { headers })
      .then(res => res.json()).then(data => setProdutos(data.results || []));
    fetch("https://parseapi.back4app.com/classes/Categoria", { headers })
      .then(res => res.json()).then(data => setCategorias(data.results || []));
  };

  const criarCategoria = async () => {
    await fetch("https://parseapi.back4app.com/classes/Categoria", {
      method: "POST",
      headers,
      body: JSON.stringify({ nome: nomeCat, exibirNaHome: exibirHome })
    });
    setNomeCat("");
    atualizarDados();
  };

  const deletarCategoria = async (id) => {
    await fetch(`https://parseapi.back4app.com/classes/Categoria/${id}`, { method: "DELETE", headers });
    atualizarDados();
  };

  const criarProduto = async () => {
    await fetch("https://parseapi.back4app.com/classes/Produto", {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        nome: nomeProd, 
        categoriaId: catSelecionada, 
        fixarNoCarrossel: noCarrossel 
      })
    });
    setNomeProd("");
    atualizarDados();
  };

  const deletarProduto = async (id) => {
    await fetch(`https://parseapi.back4app.com/classes/Produto/${id}`, { method: "DELETE", headers });
    atualizarDados();
  };

  return (
    <div style={{ padding: "20px", color: "#333" }}>
      <h1>Gerenciar Loja</h1>

      <section style={{ background: "#eee", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <h3>Nova Categoria / Coleção</h3>
        <input placeholder="Nome da Coleção" value={nomeCat} onChange={e => setNomeCat(e.target.value)} />
        <label>
          <input type="checkbox" checked={exibirHome} onChange={e => setExibirHome(e.target.checked)} /> 
          Mostrar na Home?
        </label>
        <button onClick={criarCategoria}>Criar Coleção</button>
      </section>

      <section style={{ background: "#eee", padding: "15px", borderRadius: "10px" }}>
        <h3>Novo Produto</h3>
        <input placeholder="Nome do Produto" value={nomeProd} onChange={e => setNomeProd(e.target.value)} />
        <select value={catSelecionada} onChange={e => setCatSelecionada(e.target.value)}>
          <option value="">Selecionar Coleção</option>
          {categorias.map(c => <option key={c.objectId} value={c.objectId}>{c.nome}</option>)}
        </select>
        <label>
          <input type="checkbox" checked={noCarrossel} onChange={e => setNoCarrossel(e.target.checked)} /> 
          Destacar no Carrossel?
        </label>
        <button onClick={criarProduto}>Salvar Produto</button>
      </section>

      <h3>Categorias Ativas</h3>
      {categorias.map(c => (
        <div key={c.objectId}>{c.nome} <button onClick={() => deletarCategoria(c.objectId)}>x</button></div>
      ))}

      <h3>Produtos Ativos</h3>
      {produtos.map(p => (
        <div key={p.objectId}>{p.nome} <button onClick={() => deletarProduto(p.objectId)}>x</button></div>
      ))}
    </div>
  );
}