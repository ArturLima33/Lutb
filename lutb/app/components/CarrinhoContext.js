"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CarrinhoContext = createContext(null);

function converterPrecoParaNumero(valor) {
  if (valor === null || valor === undefined) {
    return 0;
  }

  if (typeof valor === "number") {
    return valor;
  }

  let precoTexto = String(valor).trim();

  precoTexto = precoTexto.replace("R$", "").trim();

  /*
    Casos tratados:
    "00,99"   -> 0.99
    "0,99"    -> 0.99
    "99,90"   -> 99.90
    "1.299,90" -> 1299.90
    "1299.90" -> 1299.90
  */

  if (precoTexto.includes(",")) {
    precoTexto = precoTexto.replace(/\./g, "");
    precoTexto = precoTexto.replace(",", ".");
  }

  const precoConvertido = Number(precoTexto);

  if (Number.isNaN(precoConvertido)) {
    return 0;
  }

  return precoConvertido;
}

function formatarPreco(valor) {
  const numero = converterPrecoParaNumero(valor);

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("lutb-carrinho");

    if (carrinhoSalvo) {
      try {
        const itensSalvos = JSON.parse(carrinhoSalvo);

        const itensCorrigidos = itensSalvos.map((item) => ({
          ...item,
          preco: converterPrecoParaNumero(item.preco),
        }));

        setItens(itensCorrigidos);
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        localStorage.removeItem("lutb-carrinho");
      }
    }

    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("lutb-carrinho", JSON.stringify(itens));
    }
  }, [itens, carregado]);

  function adicionarProduto(produto) {
    if (!produto) return;

    const produtoFormatado = {
      id: produto.id,
      nome: produto.nome || produto.name || "Produto sem nome",
      preco: converterPrecoParaNumero(produto.preco || produto.price || 0),
      imagem: produto.imagem || produto.image || produto.foto || null,
    };

    setItens((itensAtuais) => {
      const produtoJaExiste = itensAtuais.some(
        (item) => String(item.id) === String(produtoFormatado.id)
      );

      if (produtoJaExiste) {
        return itensAtuais;
      }

      return [...itensAtuais, produtoFormatado];
    });
  }

  function removerProduto(id) {
    setItens((itensAtuais) =>
      itensAtuais.filter((item) => String(item.id) !== String(id))
    );
  }

  function limparCarrinho() {
    setItens([]);
  }

  const quantidade = itens.length;

  const total = itens.reduce((soma, item) => {
    return soma + converterPrecoParaNumero(item.preco);
  }, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        quantidade,
        total,
        adicionarProduto,
        removerProduto,
        limparCarrinho,
        formatarPreco,
        converterPrecoParaNumero,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);

  if (!contexto) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }

  return contexto;
}