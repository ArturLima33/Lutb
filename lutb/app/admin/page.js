"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");

  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  // carregar produtos
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("produtos")) || [];
    setProdutos(dados);
  }, []);

  // salvar no localStorage
  const salvarProdutos = (lista) => {
    setProdutos(lista);
    localStorage.setItem("produtos", JSON.stringify(lista));
  };

  // CREATE ou UPDATE
  const salvarProduto = () => {
    if (!nome.trim()) {
      alert("Nome é obrigatório!");
      return;
    }

    if (editandoId) {
      // EDITAR
      const atualizados = produtos.map((p) =>
        p.id === editandoId
          ? { ...p, nome, preco, desc, img }
          : p
      );

      salvarProdutos(atualizados);
      setEditandoId(null);
    } else {
      // CRIAR
      const novo = {
        id: Date.now(),
        nome,
        preco,
        desc,
        img,
      };

      salvarProdutos([...produtos, novo]);
    }

    // limpar campos
    setNome("");
    setPreco("");
    setDesc("");
    setImg("");
  };

  // DELETE
  const removerProduto = (id) => {
    const filtrados = produtos.filter((p) => p.id !== id);
    salvarProdutos(filtrados);
  };

  // preencher para edição
  const editarProduto = (p) => {
    setNome(p.nome);
    setPreco(p.preco || "");
    setDesc(p.desc || "");
    setImg(p.img || "");
    setEditandoId(p.id);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Admin</h1>

      {/* FORM */}
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

      {/* LISTA */}
      <h2>Produtos cadastrados</h2>

      {produtos.length === 0 && <p>Nenhum produto ainda.</p>}

      {produtos.map((p) => (
        <div
          key={p.id}
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
            <button onClick={() => removerProduto(p.id)}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}