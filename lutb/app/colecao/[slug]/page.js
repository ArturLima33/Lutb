"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ColecaoDinamica() {
  const params = useParams();

  const [colecao, setColecao] = useState(null);

  useEffect(() => {
    const colecoes =
      JSON.parse(localStorage.getItem("colecoes")) || [];

    const encontrada = colecoes.find(
      (c) =>
        c.nome.toLowerCase() === params.slug.toLowerCase()
    );

    setColecao(encontrada);
  }, [params.slug]);

  if (!colecao) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center",
        color: "white"
      }}>
        Coleção não encontrada.
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
        <h1>{colecao.nome}</h1>

        <p>
          Coleção criada dinamicamente pelo admin.
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