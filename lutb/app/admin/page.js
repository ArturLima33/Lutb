"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [cor, setCor] = useState("#333");
  const [categoria, setCategoria] = useState("");
  const [noCarrossel, setNoCarrossel] = useState(false);
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
    const res = await fetch("https://parseapi.back4app.com/classes/Produto", { headers });
    const data = await res.json();
    setProdutos(data.results || []);
  };

  const salvarProduto = async () => {
    if (!nome.trim()) return alert("Nome é obrigatório!");
    const dados = { nome, preco, desc, img, cor, categoria, noCarrossel };
    
    const url = editandoId ? `https://parseapi.back4app.com/classes/Produto/${editandoId}` : "https://parseapi.back4app.com/classes/Produto";
    const method = editandoId ? "PUT" : "POST";

    await fetch(url, { method, headers, body: JSON.stringify(dados) });
    
    setNome(""); setPreco(""); setDesc(""); setImg(""); setCor("#333"); setCategoria(""); setNoCarrossel(false); setEditandoId(null);
    carregarProdutos();
  };

  const removerProduto = async (id) => {
    await fetch(`https://parseapi.back4app.com/classes/Produto/${id}`, { method: "DELETE", headers });
    carregarProdutos();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Painel de Controle</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} />
        <input placeholder="URL Imagem" value={img} onChange={e => setImg(e.target.value)} />
        <input placeholder="Cor (Hex)" value={cor} onChange={e => setCor(e.target.value)} />
        <input placeholder="Categoria (ex: verao)" value={categoria} onChange={e => setCategoria(e.target.value)} />
        <label>
          <input type="checkbox" checked={noCarrossel} onChange={e => setNoCarrossel(e.target.checked)} /> Exibir no Carrossel da Home
        </label>
        <button onClick={salvarProduto} style={{ padding: '10px', background: '#2D2D2D', color: 'white' }}>
          {editandoId ? "Atualizar" : "Criar Produto"}
        </button>
      </div>

      {produtos.map(p => (
        <div key={p.objectId} style={{ borderBottom: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{p.nome}</span>
          <div>
            <button onClick={() => { setEditandoId(p.objectId); setNome(p.nome); setDesc(p.desc); setImg(p.img); setCor(p.cor); setCategoria(p.categoria); setNoCarrossel(p.noCarrossel); }}>Editar</button>
            <button onClick={() => removerProduto(p.objectId)} style={{ color: 'red' }}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}