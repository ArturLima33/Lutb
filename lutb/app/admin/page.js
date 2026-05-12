"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fixarHome, setFixarHome] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await fetch("https://parseapi.back4app.com/classes/Produto", { headers });
      const data = await res.json();
      setProdutos(data.results || []);
    } catch (err) {
      console.error("Erro ao carregar:", err);
    }
  };

  const salvarProduto = async () => {
    if (!nome.trim()) return alert("Nome é obrigatório!");

    const dados = { 
      nome, 
      preco: Number(preco), 
      desc, 
      imagemUrl: img, 
      categoria, 
      fixarHome 
    };

    try {
      const url = editandoId 
        ? `https://parseapi.back4app.com/classes/Produto/${editandoId}` 
        : "https://parseapi.back4app.com/classes/Produto";
      
      const method = editandoId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers,
        body: JSON.stringify(dados),
      });

      limparCampos();
      carregarProdutos();
    } catch (err) {
      alert("Erro ao salvar!");
    }
  };

  const removerProduto = async (id) => {
    if (!confirm("Deseja excluir?")) return;
    await fetch(`https://parseapi.back4app.com/classes/Produto/${id}`, {
      method: "DELETE",
      headers,
    });
    carregarProdutos();
  };

  const prepararEdicao = (p) => {
    setEditandoId(p.objectId);
    setNome(p.nome);
    setPreco(p.preco);
    setDesc(p.desc);
    setImg(p.imagemUrl);
    setCategoria(p.categoria || "");
    setFixarHome(p.fixarHome || false);
  };

  const limparCampos = () => {
    setEditandoId(null);
    setNome("");
    setPreco("");
    setDesc("");
    setImg("");
    setCategoria("");
    setFixarHome(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Painel Admin - LUTB</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#f4f4f4", padding: "20px", borderRadius: "10px" }}>
        <input placeholder="Nome do Produto" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Preço" type="number" value={preco} onChange={e => setPreco(e.target.value)} />
        <textarea placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} />
        <input placeholder="Link da Imagem" value={img} onChange={e => setImg(e.target.value)} />
        
        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
          <option value="">Selecione uma Categoria</option>
          <option value="verao">Coleção Verão</option>
          <option value="pascoa">Coleção Páscoa</option>
        </select>

        <label>
          <input type="checkbox" checked={fixarHome} onChange={e => setFixarHome(e.target.checked)} />
          Fixar na Home?
        </label>

        <button onClick={salvarProduto} style={{ padding: "10px", background: "black", color: "white", cursor: "pointer" }}>
          {editandoId ? "Atualizar Produto" : "Criar Produto"}
        </button>
        {editandoId && <button onClick={limparCampos}>Cancelar</button>}
      </div>

      <div style={{ marginTop: "40px" }}>
        {produtos.map(p => (
          <div key={p.objectId} style={{ borderBottom: "1px solid #ccc", padding: "10px", display: "flex", justifyContent: "space-between" }}>
            <span>{p.nome} ({p.categoria || "Sem Categoria"})</span>
            <div>
              <button onClick={() => prepararEdicao(p)}>Editar</button>
              <button onClick={() => removerProduto(p.objectId)} style={{ color: "red" }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}