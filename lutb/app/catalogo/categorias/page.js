"use client";
import Link from "next/link";

const colecoes = {
  verao: [
    { id: 3, nome: "Moranguito", img: "/moranguito.png" },
    { id: 4, nome: "Tesouro Tropical", img: "/tesouro-tropical.png" },
  ],
  pascoa: [
    { id: 1, nome: "Colar Bolhas", img: "/colar-bolhas.png" },
    { id: 2, nome: "Colar Musgo", img: "/colar-musgo.png" },
  ],
  acessorios: [
    { id: 5, nome: "Colar Coral", img: "/colar-coral.png" },
    { id: 6, nome: "Colar Oceano", img: "/colar-oceano.png" },
  ],
};

export default function Categorias() {
  return (
    <div style={{ padding: 20 }}>
      {Object.entries(colecoes).map(([categoria, produtos]) => (
        <div key={categoria} style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "serif", fontSize: 22, marginBottom: 15 }}>
            {categoria === "verao"
              ? "Coleção Verão"
              : categoria === "pascoa"
              ? "Coleção Páscoa"
              : "Acessórios"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {produtos.map((p) => (
              <Link
                key={p.id}
                href={`/novidades/${p.id}`}
                style={{
                  display: "flex",
                  gap: 15,
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 25,
                  padding: 15,
                  textDecoration: "none",
                  color: "#333",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={p.img}
                  alt={p.nome}
                  style={{ width: 70, height: 70, objectFit: "contain" }}
                />
                <span style={{ fontSize: 18, fontFamily: "serif" }}>{p.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}