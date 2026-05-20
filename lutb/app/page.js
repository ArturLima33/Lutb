"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function Home() {

  const [frase, setFrase] = useState("");

  const [busca, setBusca] = useState("");

  const [sugestoes, setSugestoes] = useState([]);

  const [mostrarSugestoes, setMostrarSugestoes] =
    useState(false);

  const [selecionado, setSelecionado] =
    useState(-1);

  const [itensBusca, setItensBusca] =
    useState([]);

  const router = useRouter();

  const boxRef = useRef(null);

  // =========================================
  // FRASE
  // =========================================

  useEffect(() => {

    fetch("https://api.adviceslip.com/advice")
      .then(res => res.json())
      .then(data => setFrase(data.slip.advice));

  }, []);

  // =========================================
  // PRODUTOS + CATEGORIAS + COLEÇÕES
  // =========================================

  useEffect(() => {

    const carregarTudo = async () => {

      try {

        const res = await fetch(
          "https://parseapi.back4app.com/classes/Produto",
          {
            headers: {
              "X-Parse-Application-Id":
                "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",

              "X-Parse-REST-API-Key":
                "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
            },
          }
        );

        const data = await res.json();

        // =========================================
        // PRODUTOS FIXOS
        // =========================================

        const produtosFixos = [
          {
            id: "1",
            nome: "Colar Bolhas",
            descricao:
              "colar com bolhas delicadas",

            tipo: "produto",

            link: "/produto/1"
          },
          {
            id: "2",
            nome: "Colar Musgo",
            descricao:
              "inspiração natural verde musgo",

            tipo: "produto",

            link: "/produto/2"
          },
          {
            id: "3",
            nome: "Moranguito",
            descricao:
              "colar com pedra vermelha delicada",

            tipo: "produto",

            link: "/produto/3"
          },
          {
            id: "4",
            nome: "Tesouro Tropical",
            descricao:
              "cores vibrantes tropicais",

            tipo: "produto",

            link: "/produto/4"
          }
        ];

        // =========================================
        // PRODUTOS ADMIN
        // =========================================

        const produtosAdmin =
          (data.results || []).map(p => ({
            id: p.objectId,

            nome: p.nome || "",

            descricao: p.desc || "",

            tipo: "produto",

            link: `/produto/${p.objectId}`
          }));

        // =========================================
        // CATEGORIAS
        // =========================================

        const categorias =
          JSON.parse(
            localStorage.getItem("categorias")
          ) || [];

        const categoriasFormatadas =
          categorias.map(c => ({
            id: c.id,

            nome: c.nome,

            descricao: "",

            tipo: "categoria",

            link:
              `/categoria/${c.nome.toLowerCase()}`
          }));

        // =========================================
        // COLEÇÕES
        // =========================================

        const colecoes =
          JSON.parse(
            localStorage.getItem("colecoes")
          ) || [];

        const colecoesFormatadas =
          colecoes.map(c => ({
            id: c.id,

            nome: c.nome,

            descricao: "",

            tipo: "coleção",

            link:
              `/colecao/${c.nome.toLowerCase()}`
          }));

        // =========================================
        // JUNTAR TUDO
        // =========================================

        setItensBusca([

          ...produtosFixos,

          ...produtosAdmin,

          ...categoriasFormatadas,

          ...colecoesFormatadas

        ]);

      } catch (err) {

        console.error(
          "Erro ao carregar itens:",
          err
        );
      }
    };

    carregarTudo();

  }, []);

  // =========================================
  // BUSCA
  // =========================================

  useEffect(() => {

    if (!busca.trim()) {

      setSugestoes([]);

      setSelecionado(-1);

      return;
    }

    const termo =
      busca.toLowerCase().trim();

    const comecaNome = [];

    const contemNome = [];

    itensBusca.forEach(item => {

      const nome =
        item.nome.toLowerCase();

      // PRIORIDADE 1
      if (nome.startsWith(termo)) {

        comecaNome.push(item);

      }

      // PRIORIDADE 2
      else if (nome.includes(termo)) {

        contemNome.push(item);
      }
    });

    const resultado = [

      ...comecaNome,

      ...contemNome

    ];

    setSugestoes(resultado);

    setSelecionado(-1);

  }, [busca, itensBusca]);

  // =========================================
  // PESQUISAR
  // =========================================

  const pesquisar = () => {

    if (!busca.trim()) return;

    router.push(`/busca?q=${busca}`);

    setMostrarSugestoes(false);
  };

  // =========================================
  // TECLADO
  // =========================================

  const handleKeyDown = (e) => {

    if (e.key === "ArrowDown") {

      e.preventDefault();

      setSelecionado(prev =>
        prev < sugestoes.length - 1
          ? prev + 1
          : prev
      );
    }

    if (e.key === "ArrowUp") {

      e.preventDefault();

      setSelecionado(prev =>
        prev > 0
          ? prev - 1
          : 0
      );
    }

    if (e.key === "Enter") {

      if (
        selecionado >= 0 &&
        selecionado < sugestoes.length
      ) {

        const item =
          sugestoes[selecionado];

        router.push(item.link);

      } else {

        pesquisar();
      }
    }
  };

  // =========================================
  // FECHAR SUGESTÕES
  // =========================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

      if (
        boxRef.current &&
        !boxRef.current.contains(
          event.target
        )
      ) {

        setMostrarSugestoes(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  // =========================================
  // DESTACAR TEXTO
  // =========================================

  const destacarTexto = (
    texto,
    termo
  ) => {

    const index =
      texto.toLowerCase().indexOf(
        termo.toLowerCase()
      );

    if (index === -1) return texto;

    const inicio =
      texto.slice(0, index);

    const meio =
      texto.slice(
        index,
        index + termo.length
      );

    const fim =
      texto.slice(
        index + termo.length
      );

    return (
      <>
        {inicio}
        <strong>{meio}</strong>
        {fim}
      </>
    );
  };

  // =========================================
  // BANNERS
  // =========================================

  const bannersPadrao = [
    {
      id: 2,
      produtoId: "2",
      cor: "#FF8C00",
      img: "/colar-musgo.png"
    },
    {
      id: 3,
      produtoId: "3",
      cor: "#FF4500",
      img: "/moranguito.png"
    }
  ];

  const [banners, setBanners] =
    useState(bannersPadrao);

  useEffect(() => {

    const bannersSalvos =
      JSON.parse(
        localStorage.getItem("banners")
      ) || [];

    if (bannersSalvos.length > 0) {

      setBanners(bannersSalvos);
    }

  }, []);

  const [bannerAtual, setBannerAtual] =
    useState(0);

  // =========================================
  // AUTO PLAY
  // =========================================

  useEffect(() => {

    if (banners.length === 0) return;

    const intervalo = setInterval(() => {

      setBannerAtual(prev =>
        (prev + 1) % banners.length
      );

    }, 3000);

    return () => clearInterval(intervalo);

  }, [banners]);

  // =========================================
  // TROCAR BANNER
  // =========================================

  const alternarBanner = (direcao) => {

    if (banners.length === 0) return;

    if (direcao === 'prev') {

      setBannerAtual(prev =>
        prev === 0
          ? banners.length - 1
          : prev - 1
      );

    } else {

      setBannerAtual(prev =>
        (prev + 1) % banners.length
      );
    }
  };

  return (
    <div style={{ padding: '20px' }}>

      {/* BUSCA */}

      <div
        ref={boxRef}
        style={{
          marginBottom: "20px",
          position: "relative"
        }}
      >

        <div style={{
          display: "flex",
          gap: "10px"
        }}>

          <input
            type="text"
            placeholder="Buscar produto, coleção..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setMostrarSugestoes(true);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none"
            }}
          />

          <button
            onClick={pesquisar}
            style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#2D2D2D",
              color: "white",
              cursor: "pointer"
            }}
          >
            Buscar
          </button>
        </div>

        {mostrarSugestoes && busca && (

          <div style={{
            position: "absolute",
            top: "45px",
            width: "100%",
            background: "white",
            borderRadius: "10px",
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 10
          }}>

            {sugestoes.map((p, index) => (

              <div
                key={`${p.tipo}-${p.id}`}
                onClick={() =>
                  router.push(p.link)
                }
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom:
                    "1px solid #eee",

                  backgroundColor:
                    selecionado === index
                      ? "#f0f0f0"
                      : "white",

                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center"
                }}
              >

                <span>
                  {destacarTexto(
                    p.nome,
                    busca
                  )}
                </span>

                <span style={{
                  fontSize: "11px",
                  fontStyle: "italic",
                  color: "#777"
                }}>
                  {p.tipo}
                </span>

              </div>
            ))}

            <div
              onClick={pesquisar}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: "#fafafa",
                fontStyle: "italic"
              }}
            >
              Buscar por "{busca}"
            </div>
          </div>
        )}
      </div>

      {/* CARROSSEL */}

      {banners.length > 0 && (

        <div style={{
          background:
            banners[bannerAtual]?.cor ||
            "#333",

          height: '210px',
          borderRadius: '25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          position: 'relative',
          boxShadow:
            '0 4px 15px rgba(0,0,0,0.2)'
        }}>

          <button
            onClick={() =>
              alternarBanner('prev')
            }
            style={{
              background:
                'rgba(0, 0, 0, 0.3)',

              border: 'none',

              color: 'white',

              fontSize: '30px',

              cursor: 'pointer',

              borderRadius: '50%',

              width: '45px',

              height: '45px'
            }}
          >
            ‹
          </button>

          <Link
            href={`/produto/${banners[bannerAtual]?.produtoId}`}
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              src={banners[bannerAtual]?.img}
              style={{
                height: '85%',
                objectFit: "contain"
              }}
            />
          </Link>

          <button
            onClick={() =>
              alternarBanner('next')
            }
            style={{
              background:
                'rgba(0, 0, 0, 0.3)',

              border: 'none',

              color: 'white',

              fontSize: '30px',

              cursor: 'pointer',

              borderRadius: '50%',

              width: '45px',

              height: '45px'
            }}
          >
            ›
          </button>
        </div>
      )}

      {/* API */}

      <div style={{
        backgroundColor: 'white',
        marginTop: '25px',
        padding: '20px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow:
          '0 4px 10px rgba(0,0,0,0.1)'
      }}>

        <h3 style={{
          marginBottom: '10px'
        }}>
          Dica do dia ✨
        </h3>

        <p style={{
          fontStyle: 'italic',
          color: '#555'
        }}>
          {frase || "Carregando..."}
        </p>
      </div>

      {/* COLEÇÕES */}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '30px'
      }}>

        <Link
          href="/colecao-verao"
          style={{
            background:
              'linear-gradient(180deg, #987317, #cebb4b)',

            width: '47%',

            height: '220px',

            borderRadius: '25px',

            display: 'flex',

            flexDirection: 'column',

            alignItems: 'center',

            justifyContent: 'center',

            textDecoration: 'none'
          }}
        >
          <img
            src="/sol-icon.png"
            style={{ width: '75px' }}
          />

          <h3>Coleção Verão</h3>
        </Link>

        <Link
          href="/colecao-pascoa"
          style={{
            background:
              'linear-gradient(180deg, #8B4513, #FFC0CB)',

            width: '47%',

            height: '220px',

            borderRadius: '25px',

            display: 'flex',

            flexDirection: 'column',

            alignItems: 'center',

            justifyContent: 'center',

            textDecoration: 'none'
          }}
        >
          <img
            src="/coelho-icon.png"
            style={{ width: '75px' }}
          />

          <h3>Coleção Páscoa</h3>
        </Link>
      </div>
    </div>
  );
}