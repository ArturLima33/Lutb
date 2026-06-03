"use client";

import { useState } from "react";
import { useCarrinho } from "./CarrinhoContext";

export default function BotaoAdicionarCarrinho({ produto, compacto = false }) {
  const { adicionarProduto, itens } = useCarrinho();
  const [mensagem, setMensagem] = useState("");

  const jaEstaNoCarrinho = itens.some((item) => String(item.id) === String(produto?.id));

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!produto?.id) return;

    if (jaEstaNoCarrinho) {
      setMensagem("Já está no carrinho");
      setTimeout(() => setMensagem(""), 1600);
      return;
    }

    adicionarProduto(produto);
    setMensagem("Adicionado ao carrinho");
    setTimeout(() => setMensagem(""), 1600);
  };

  return (
    <div style={{ width: compacto ? "auto" : "100%", marginTop: compacto ? "8px" : "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <button
        onClick={handleClick}
        type="button"
        style={{
          width: compacto ? "100%" : "100%",
          maxWidth: compacto ? "none" : "320px",
          border: "none",
          borderRadius: "999px",
          backgroundColor: jaEstaNoCarrinho ? "#666" : "#2D2D2D",
          color: "white",
          padding: compacto ? "9px 12px" : "13px 20px",
          fontSize: compacto ? "13px" : "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
        }}
      >
        {jaEstaNoCarrinho ? "No carrinho" : "Adicionar ao carrinho"}
      </button>

      {mensagem && (
        <span style={{ marginTop: "6px", fontSize: "12px", color: "#2D2D2D", fontWeight: "bold", textAlign: "center" }}>
          {mensagem}
        </span>
      )}
    </div>
  );
}
