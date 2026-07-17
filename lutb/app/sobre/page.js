"use client";

import Link from "next/link";

export default function SobrePage() {
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #76BA5B, #4E8E3F)",
          borderRadius: "25px",
          color: "white",
          padding: "40px 30px",
          textAlign: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "15px" }}>
          Sobre a LUTB
        </h1>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          Esta página está em desenvolvimento. Em breve você encontrará aqui
          informações sobre nossa história, missão, valores e tudo o que torna
          a LUTB um lugar especial.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          marginTop: "25px",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#2D2D2D" }}>
          O que você encontrará aqui
        </h2>

        <ul
          style={{
            color: "#555",
            lineHeight: "2",
            paddingLeft: "20px",
          }}
        >
          <li>Nossa história</li>
          <li>Nossa missão e valores</li>
          <li>Compromisso com a qualidade</li>
          <li>Informações sobre a equipe</li>
          <li>Novidades e projetos futuros</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "25px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "25px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Enquanto esta página é finalizada, você pode continuar navegando pelo
          catálogo.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: "999px",
            backgroundColor: "#2D2D2D",
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}