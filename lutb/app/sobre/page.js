"use client";
import { useState } from "react";
import Link from "next/link";

const TEXTO_PADRAO = `Esta página está em desenvolvimento. Em breve você encontrará aqui informações sobre nossa história, missão, valores e tudo o que torna a LUTB um lugar especial.`;

export default function SobrePage() {
  const [texto, setTexto] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("sobre-texto") || ""
      : ""
  );

  const [mural, setMural] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      return JSON.parse(localStorage.getItem("sobre-mural") || "[]");
    } catch {
      return [];
    }
  });

  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  const textoExibido = texto.trim() ? texto : TEXTO_PADRAO;

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #76BA5B, #4E8E3F)",
        borderRadius: "25px",
        color: "white",
        padding: "40px 30px",
        textAlign: "center",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
      }}>
        <h1 style={{ fontSize: "36px", marginBottom: "15px" }}>
          Sobre a LUTB
        </h1>
        <p style={{
          maxWidth: "700px",
          margin: "0 auto",
          fontSize: "18px",
          lineHeight: "1.7",
          whiteSpace: "pre-wrap"
        }}>
          {textoExibido}
        </p>
      </div>

      {/* CARD FIXO — só aparece enquanto o texto for o padrão */}
      {!texto.trim() && (
        <div style={{
          backgroundColor: "white",
          marginTop: "25px",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}>
          <h2 style={{ marginBottom: "15px", color: "#2D2D2D" }}>
            O que você encontrará aqui
          </h2>
          <ul style={{ color: "#555", lineHeight: "2", paddingLeft: "20px" }}>
            <li>Nossa história</li>
            <li>Nossa missão e valores</li>
            <li>Compromisso com a qualidade</li>
            <li>Informações sobre a equipe</li>
            <li>Novidades e projetos futuros</li>
          </ul>
        </div>
      )}

      {/* MURAL — só aparece quando tiver fotos */}
      {mural.length > 0 && (
        <div style={{
          backgroundColor: "white",
          marginTop: "25px",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}>
          <h2 style={{ marginBottom: "20px", color: "#2D2D2D", textAlign: "center" }}>
            Mural de Criações
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px"
          }}>
            {mural.map((foto, i) => (
              <div
                key={i}
                onClick={() => setFotoSelecionada(foto)}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  aspectRatio: "1",
                  cursor: "pointer",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
                }}
              >
                <img
                  src={foto}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTÃO DE VOLTAR — só aparece enquanto o mural estiver vazio */}
      {mural.length === 0 && (
        <div style={{
          marginTop: "25px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "25px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Enquanto esta página é finalizada, você pode continuar navegando pelo catálogo.
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
      )}

      {/* LIGHTBOX */}
      {fotoSelecionada && (
        <div
          onClick={() => setFotoSelecionada(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "20px"
          }}
        >
          <button
            onClick={() => setFotoSelecionada(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              fontSize: "24px",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ×
          </button>
          <img
            src={fotoSelecionada}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              borderRadius: "20px",
              objectFit: "contain"
            }}
          />
        </div>
      )}

    </div>
  );
}