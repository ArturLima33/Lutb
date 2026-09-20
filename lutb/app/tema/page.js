"use client";
import { useState, useEffect } from "react";
import {
  TEMAS,
  CHAVE_LOCALSTORAGE,
  aplicarTema,
  TEMA_PADRAO,
} from "@/lib/temas";

function CardTema({ tema, selecionado, onSelecionar }) {
  const [checado, setChecado] = useState(false);
  const p = tema.preview;

  const handleClick = () => {
    onSelecionar(tema);
    setChecado(true);
    setTimeout(() => setChecado(false), 1000);
  };

  const textoNome =
    tema.id === "claro" || tema.id === "minimalista"
      ? p.textoPrincipal
      : "#ffffff";

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        borderRadius: "20px",
        overflow: "hidden",
        border: selecionado
          ? `3px solid ${p.botao}`
          : "3px solid transparent",
        boxShadow: selecionado
          ? `0 0 0 2px ${p.botao}55, 0 8px 24px rgba(0,0,0,0.18)`
          : "0 4px 12px rgba(0,0,0,0.1)",
        transition: "all 0.25s ease",
        transform: selecionado ? "scale(1.02)" : "scale(1)",
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* CHECK TEMPORÁRIO */}
      {checado && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.38)",
            zIndex: 10,
            borderRadius: "17px",
            animation: "fadeInOut 1s ease forwards",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "50%",
              width: "52px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            ✓
          </div>
        </div>
      )}

      {/* HEADER DO PREVIEW */}
      <div
        style={{
          backgroundColor: p.header,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor:
              tema.id === "claro" || tema.id === "minimalista"
                ? "#e0e0e0"
                : "rgba(255,255,255,0.25)",
          }}
        />
        <div
          style={{
            height: "8px",
            width: "50px",
            borderRadius: "4px",
            backgroundColor:
              tema.id === "claro" || tema.id === "minimalista"
                ? "#cccccc"
                : "rgba(255,255,255,0.5)",
          }}
        />
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "7px",
            backgroundColor: p.botao,
            opacity: 0.85,
          }}
        />
      </div>

      {/* CORPO DO PREVIEW */}
      <div
        style={{
          backgroundColor: p.fundo,
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* CARD SIMULADO */}
        <div
          style={{
            backgroundColor: p.card,
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
          }}
        >
          <div
            style={{
              height: "38px",
              backgroundColor: p.fundo,
              borderRadius: "8px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                backgroundColor: p.destaque,
                opacity: 0.85,
              }}
            />
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: p.destaque,
              borderRadius: "4px",
              marginBottom: "6px",
              width: "68%",
            }}
          />
          <div
            style={{
              height: "6px",
              backgroundColor: p.textoCard,
              borderRadius: "4px",
              opacity: 0.35,
              width: "90%",
              marginBottom: "4px",
            }}
          />
          <div
            style={{
              height: "6px",
              backgroundColor: p.textoCard,
              borderRadius: "4px",
              opacity: 0.25,
              width: "55%",
            }}
          />
        </div>

        {/* BOTÃO SIMULADO */}
        <div
          style={{
            backgroundColor: p.botao,
            borderRadius: "20px",
            padding: "9px 14px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              height: "8px",
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: "4px",
              width: "55%",
              margin: "0 auto",
            }}
          />
        </div>
      </div>

      {/* RODAPÉ COM NOME */}
      <div
        style={{
          backgroundColor: p.header,
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: textoNome,
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          {tema.nome}
        </span>
        {selecionado && (
          <span
            style={{
              fontSize: "11px",
              backgroundColor: p.botao,
              color: "white",
              padding: "2px 8px",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            Ativo
          </span>
        )}
      </div>
    </div>
  );
}

export default function TemaPage() {
  const [temaSelecionado, setTemaSelecionado] = useState(TEMA_PADRAO);

  useEffect(() => {
    const salvo =
      localStorage.getItem(CHAVE_LOCALSTORAGE) || TEMA_PADRAO;
    setTemaSelecionado(salvo);
  }, []);

  const handleSelecionar = (tema) => {
    setTemaSelecionado(tema.id);
    aplicarTema(tema);
    localStorage.setItem(CHAVE_LOCALSTORAGE, tema.id);
  };

  return (
    <div
      style={{
        padding: "20px 20px 60px 20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes fadeInOut {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* TÍTULO */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "20px",
          padding: "15px 30px",
          width: "fit-content",
          margin: "0 auto 10px auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            color: "var(--texto-principal)",
            textAlign: "center",
            fontFamily: "serif",
          }}
        >
          Aparência
        </h2>
      </div>

      <p
        style={{
          textAlign: "center",
          color: "var(--texto-secundario)",
          marginBottom: "30px",
          fontSize: "14px",
        }}
      >
        Escolha um tema para personalizar a aparência da loja.
      </p>

      {/* GRID DE CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {TEMAS.map((tema) => (
          <CardTema
            key={tema.id}
            tema={tema}
            selecionado={temaSelecionado === tema.id}
            onSelecionar={handleSelecionar}
          />
        ))}
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: "30px",
          fontSize: "12px",
          color: "var(--texto-secundario)",
        }}
      >
        A preferência é salva automaticamente neste navegador.
      </p>
    </div>
  );
}