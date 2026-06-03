"use client";

import Link from "next/link";
import { useCarrinho } from "../components/CarrinhoContext";

export default function CarrinhoPage() {
  const { itens, total, removerProduto, limparCarrinho, formatarPreco } = useCarrinho();

  return (
    <div style={{ padding: "0 20px 40px 20px", minHeight: "70vh" }}>
      <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "10px 30px", width: "fit-content", margin: "0 auto 25px auto", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ margin: 0, fontSize: "20px", color: "#2D2D1A", textAlign: "center" }}>Carrinho</h2>
      </div>

      {itens.length === 0 ? (
        <div style={{ backgroundColor: "white", borderRadius: "30px", padding: "35px 20px", textAlign: "center", boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginTop: 0, color: "#2D2D1A" }}>Seu carrinho está vazio</h3>
          <p style={{ color: "#555", marginBottom: "25px" }}>Adicione produtos pelo catálogo ou pela página de detalhes do produto.</p>

          <Link
            href="/catalogo"
            style={{
              display: "inline-block",
              backgroundColor: "#2D2D2D",
              color: "white",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "999px",
              fontWeight: "bold",
            }}
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {itens.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "28px",
                  padding: "16px",
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                }}
              >
                <Link href={`/produto/${item.id}`} style={{ flexShrink: 0 }}>
                  <img
                    src={item.imagem || "/logo(lutb).png"}
                    alt={item.nome}
                    style={{
                      width: "86px",
                      height: "86px",
                      borderRadius: "18px",
                      objectFit: "cover",
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                </Link>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/produto/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ margin: "0 0 8px 0", color: "#2D2D1A", fontSize: "18px" }}>{item.nome}</h3>
                  </Link>
                  <p style={{ margin: 0, color: "#2D2D1A", fontWeight: "bold", fontSize: "16px" }}>{formatarPreco(item.preco)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => removerProduto(item.id)}
                  style={{
                    border: "none",
                    backgroundColor: "#E63946",
                    color: "white",
                    borderRadius: "999px",
                    padding: "10px 13px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "28px", padding: "22px", marginTop: "25px", boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", marginBottom: "18px" }}>
              <span style={{ fontSize: "18px", color: "#2D2D1A", fontWeight: "bold" }}>Total</span>
              <span style={{ fontSize: "26px", color: "#2D2D1A", fontWeight: "bold" }}>{formatarPreco(total)}</span>
            </div>

            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 18px 0", lineHeight: 1.5 }}>
              O carrinho está salvo localmente neste navegador. A finalização por WhatsApp pode ser conectada futuramente usando estes mesmos itens.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                disabled
                style={{
                  border: "none",
                  borderRadius: "999px",
                  backgroundColor: "#999",
                  color: "white",
                  padding: "13px 20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "not-allowed",
                }}
              >
                Finalizar pelo WhatsApp em breve
              </button>

              <button
                type="button"
                onClick={limparCarrinho}
                style={{
                  border: "1px solid #E63946",
                  borderRadius: "999px",
                  backgroundColor: "white",
                  color: "#E63946",
                  padding: "12px 20px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
