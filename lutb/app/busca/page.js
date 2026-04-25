"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Busca() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q");

  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const buscar = async () => {

      const produtosFixos = [
        { id: "1", nome: "Colar Bolhas", desc: "Inspirado na pureza das águas.", preco: "25,00", img: "/colar-bolhas.png" },
        { id: "2", nome: "Colar Musgo", desc: "Representando a natureza.", preco: "35,00", img: "/colar-musgo.png" },
        { id: "3", nome: "Moranguito", desc: "Feito à mão com pedras selecionadas.", preco: "25,00", img: "/moranguito.png" },
        { id: "4", nome: "Tesouro Tropical", desc: "Explosão de cores tropicais.", preco: "35,00", img: "/tesouro-tropical.png" }
      ];

      const res = await fetch("https://parseapi.back4app.com/classes/Produto", {
        headers: {
          "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
          "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
        },
      });

      const data = await res.json();

      const produtosAdmin = (data.results || []).map(p => ({
        id: p.objectId,
        nome: p.nome,
        desc: p.desc || "",
        preco: p.preco,
        img: p.img || "/logo(lutb).png"
      }));

      const todos = [...produtosFixos, ...produtosAdmin];

      const q = query.toLowerCase();

      // 🔥 prioridade 1: nome
      const porNome = todos.filter(p =>
        p.nome.toLowerCase().includes(q)
      );

      // 🔥 prioridade 2: descrição (sem duplicar)
      const porDesc = todos.filter(p =>
        p.desc.toLowerCase().includes(q) &&
        !porNome.includes(p)
      );

      setResultados([...porNome, ...porDesc]);
    };

    if (query) buscar();
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔙 voltar */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <button onClick={() => router.back()} style={{
          background: "none",
          border: "none",
          cursor: "pointer"
        }}>
          <img src="/seta-voltar.png" style={{ width: "50px" }} />
        </button>
      </div>

      <h2>Resultados para: "{query}"</h2>

      {resultados.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <img src="/categoria-vazia.png" style={{ width: "120px", opacity: 0.3 }} />
          <p>Nenhum produto encontrado</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {resultados.map(p => (
            <Link key={p.id} href={`/produto/${p.id}`}>
              <div style={{ background: "white", padding: "15px", borderRadius: "15px" }}>
                <img src={p.img} style={{ width: "120px" }} />
                <h3>{p.nome}</h3>
                <p>{p.preco ? `R$ ${p.preco}` : "Sem preço"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}