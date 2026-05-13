"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoriaDinamica() {
  const params = useParams();

  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    const categorias =
      JSON.parse(localStorage.getItem("categorias")) || [];

    const encontrada = categorias.find(
      (c) =>
        c.nome.toLowerCase() === params.slug.toLowerCase()
    );

    setCategoria(encontrada);
  }, [params.slug]);

  if (!categoria) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center",
        color: "white"
      }}>
        Categoria não encontrada.
      </div>
    );
  }

  return (
    <div style={{
      padding: "40px 20px",
      minHeight: "100vh",
      backgroundColor: "#76BA5B"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "25px",
        padding: "25px",
        maxWidth: "500px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <h1>{categoria.nome}</h1>

        <p>
          Categoria criada dinamicamente pelo admin.
        </p>

        <p style={{
          color: "#666",
          fontSize: "14px"
        }}>
          Em breve os produtos aparecerão aqui.
        </p>
      </div>
    </div>
  );
}