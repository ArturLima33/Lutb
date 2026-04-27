"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function Home() {

  const [frase, setFrase] = useState("");
  const [busca, setBusca] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [selecionado, setSelecionado] = useState(-1);
  const [produtos, setProdutos] = useState([]);

  const router = useRouter();
  const boxRef = useRef(null);

  // 🔥 FRASE
  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then(res => res.json())
      .then(data => setFrase(data.slip.advice));
  }, []);

  // 🔥 CARREGAR PRODUTOS (FIXOS + ADMIN)
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const res = await fetch("https://parseapi.back4app.com/classes/Produto", {
          headers: {
            "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
            "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
          },
        });

        const data = await res.json();

        const produtosFixos = [
          { id: "1", nome: "Colar Bolhas", descricao: "colar com bolhas delicadas" },
          { id: "2", nome: "Colar Musgo", descricao: "inspiração natural verde musgo" },
          { id: "3", nome: "Moranguito", descricao: "colar com pedra vermelha delicada" },
          { id: "4", nome: "Tesouro Tropical", descricao: "cores vibrantes tropicais" }
        ];

        const produtosAdmin = (data.results || []).map(p => ({
          id: p.objectId,
          nome: p.nome || "",
          descricao: p.desc || ""
        }));

        setProdutos([...produtosFixos, ...produtosAdmin]);

      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    };

    carregarProdutos();
  }, []);

  // 🔍 GERAR SUGESTÕES
  useEffect(() => {
    if (!busca.trim()) {
      setSugestoes([]);
      setSelecionado(-1);
      return;
    }

    const termo = busca.toLowerCase();

    const comeca = produtos.filter(p =>
      p.nome.toLowerCase().startsWith(termo)
    );

    const contem = produtos.filter(p =>
      p.nome.toLowerCase().includes(termo) &&
      !p.nome.toLowerCase().startsWith(termo)
    );

    const resultado = [...comeca, ...contem];

    setSugestoes(resultado);
    setSelecionado(-1);

  }, [busca, produtos]);

  // 🔎 PESQUISAR
  const pesquisar = () => {
    if (!busca.trim()) return;
    router.push(`/busca?q=${busca}`);
    setMostrarSugestoes(false);
  };

  // ⌨️ CONTROLE DO TECLADO
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelecionado(prev =>
        prev < sugestoes.length ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelecionado(prev =>
        prev > -1 ? prev - 1 : prev
      );
    }

    if (e.key === "Enter") {
      if (selecionado >= 0 && selecionado < sugestoes.length) {
        const item = sugestoes[selecionado];
        router.push(`/produto/${item.id}`);
      } else {
        pesquisar();
      }
    }
  };

  // ❌ FECHAR AO CLICAR FORA
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setMostrarSugestoes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✨ DESTACAR TEXTO
  const destacarTexto = (texto, termo) => {
    const index = texto.toLowerCase().indexOf(termo.toLowerCase());
    if (index === -1) return texto;

    const inicio = texto.slice(0, index);
    const meio = texto.slice(index, index + termo.length);
    const fim = texto.slice(index + termo.length);

    return (
      <>
        {inicio}
        <strong>{meio}</strong>
        {fim}
      </>
    );
  };

  // 🎞️ BANNERS
  const banners = [
    { id: 2, cor: 'linear-gradient(135deg, #FF8C00, #D2691E)', img: '/colar-musgo.png', link: '/produto/2' },
    { id: 3, cor: 'linear-gradient(135deg, #FF4500, #8B0000)', img: '/moranguito.png', link: '/produto/3' }
  ];

  const [bannerAtual, setBannerAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerAtual(prev => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  const alternarBanner = (direcao) => {
    if (direcao === 'prev') {
      setBannerAtual(prev => (prev === 0 ? banners.length - 1 : prev - 1));
    } else {
      setBannerAtual(prev => (prev + 1) % banners.length);
    }
  };

  return (
    <div style={{ padding: '20px' }}>

      {/* 🔍 BUSCA */}
      <div ref={boxRef} style={{ marginBottom: "20px", position: "relative" }}>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Buscar produto..."
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

          <button onClick={pesquisar} style={{
            padding: "10px 15px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#2D2D2D",
            color: "white",
            cursor: "pointer"
          }}>
            Buscar
          </button>
        </div>

        {/* 📌 SUGESTÕES */}
        {mostrarSugestoes && busca && (
          <div style={{
            position: "absolute",
            top: "45px",
            width: "100%",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 10
          }}>
            {sugestoes.map((p, index) => (
              <div
                key={p.id}
                onClick={() => router.push(`/produto/${p.id}`)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  backgroundColor: selecionado === index ? "#f0f0f0" : "white"
                }}
              >
                {destacarTexto(p.nome, busca)}
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
      <div style={{ 
        background: banners[bannerAtual].cor, 
        height: '210px', 
        borderRadius: '25px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 10px',
        position: 'relative',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <button onClick={() => alternarBanner('prev')} style={{ 
          background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', 
          fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px'
        }}>‹</button>
        
        <Link href={banners[bannerAtual].link} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={banners[bannerAtual].img} style={{ height: '85%' }} />
        </Link>
        
        <button onClick={() => alternarBanner('next')} style={{ 
          background: 'rgba(0, 0, 0, 0.3)', border: 'none', color: 'white', 
          fontSize: '30px', cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px'
        }}>›</button>
      </div>

      {/* API */}
      <div style={{
        backgroundColor: 'white',
        marginTop: '25px',
        padding: '20px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Dica do dia ✨</h3>
        <p style={{ fontStyle: 'italic', color: '#555' }}>
          {frase || "Carregando..."}
        </p>
      </div>

      {/* COLEÇÕES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <Link href="/colecao-verao" style={{ 
          background: 'linear-gradient(180deg, #987317, #cebb4b)', 
          width: '47%', height: '220px', borderRadius: '25px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none'
        }}>
          <img src="/sol-icon.png" style={{ width: '75px' }} />
          <h3>Coleção Verão</h3>
        </Link>

        <Link href="/colecao-pascoa" style={{ 
          background: 'linear-gradient(180deg, #8B4513, #FFC0CB)', 
          width: '47%', height: '220px', borderRadius: '25px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none'
        }}>
          <img src="/coelho-icon.png" style={{ width: '75px' }} />
          <h3>Coleção Páscoa</h3>
        </Link>
      </div>
    </div>
  );
}