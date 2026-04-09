"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
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
    if (!nome.trim()) {
      alert("Nome é obrigatório!");
      return;
    }

    const dados = { nome, preco, desc, img };

    if (editandoId) {
      await fetch(`https://parseapi.back4app.com/classes/Produto/${editandoId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(dados),
      });
      setEditandoId(null);
    } else {
      await fetch("https://parseapi.back4app.com/classes/Produto", {
        method: "POST",
        headers,
        body: JSON.stringify(dados),
      });
    }

    setNome("");
    setPreco("");
    setDesc("");
    setImg("");
    carregarProdutos();
  };

  const removerProduto = async (id) => {
    await fetch(`https://parseapi.back4app.com/classes/Produto/${id}`, {
      method: "DELETE",
      headers,
    });
    carregarProdutos();
  };

  const editarProduto = (p) => {
    setNome(p.nome);
    setPreco(p.preco || "");
    setDesc(p.desc || "");
    setImg(p.img || "");
    setEditandoId(p.objectId);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Admin</h1>

      <input
        placeholder="Nome *"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        placeholder="Preço (ex: 25,00)"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        placeholder="URL da imagem"
        value={img}
        onChange={(e) => setImg(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <textarea
        placeholder="Descrição"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <button
        onClick={salvarProduto}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: editandoId ? "#E63946" : "#228B22",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {editandoId ? "Salvar edição" : "Adicionar produto"}
      </button>

      <h2>Produtos cadastrados</h2>

      {produtos.length === 0 && <p>Nenhum produto ainda.</p>}

      {produtos.map((p) => (
        <div
          key={p.objectId}
          style={{
            background: "white",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <strong>{p.nome}</strong>
            <p style={{ margin: 0, fontSize: "12px" }}>
              {p.preco ? `R$ ${p.preco}` : "Sem preço"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "5px" }}>
            <button onClick={() => editarProduto(p)}>✏️</button>
            <button onClick={() => removerProduto(p.objectId)}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}