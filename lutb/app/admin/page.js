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
    "X-Parse-Application-Id":
      "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",

    "X-Parse-REST-API-Key":
      "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",

    "Content-Type": "application/json",
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    const res = await fetch(
      "https://parseapi.back4app.com/classes/Produto",
      { headers }
    );

    const data = await res.json();

    setProdutos(data.results || []);
  };

  const salvarProduto = async () => {
    if (!nome.trim()) {
      alert("Nome é obrigatório!");
      return;
    }

    const dados = {
      nome,
      preco,
      desc,
      img,
    };

    if (editandoId) {
      await fetch(
        `https://parseapi.back4app.com/classes/Produto/${editandoId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(dados),
        }
      );

      setEditandoId(null);
    } else {
      await fetch(
        "https://parseapi.back4app.com/classes/Produto",
        {
          method: "POST",
          headers,
          body: JSON.stringify(dados),
        }
      );
    }

    setNome("");
    setPreco("");
    setDesc("");
    setImg("");

    carregarProdutos();
  };

  const removerProduto
}