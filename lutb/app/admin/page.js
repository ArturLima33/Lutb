"use client";
import { useState, useEffect } from "react";

export default function Admin() {

  // =========================================
  // PRODUTOS (BACK4APP)
  // =========================================

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");

  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    const res = await fetch(
      "https://parseapi.back4app.com/classes/Produto",
      { headers }
    );

    const data = await res.json();
    setProdutos(data.results || []);
  };

  const salvarProduto = async () => {

    if (!nome.trim()) {
      alert("Nome obrigatório!");
      return;
    }

    const dados = {
      nome,
      preco,
      desc,
      img
    };

    if (editandoId) {

      await fetch(
        `https://parseapi.back4app.com/classes/Produto/${editandoId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(dados),
        }
      );

      setEditandoId(null);

    } else {

      await fetch(
        "https://parseapi.back4app.com/classes/Produto",
        {
          method: "POST",
          headers,
          body: JSON.stringify(dados),
        }
      );
    }

    setNome("");
    setPreco("");
    setDesc("");
    setImg("");

    carregarProdutos();
  };

  const removerProduto = async (id) => {

    await fetch(
      `https://parseapi.back4app.com/classes/Produto/${id}`,
      {
        method: "DELETE",
        headers,
      }
    );

    carregarProdutos();
  };

  const editarProduto = (p) => {
    setNome(p.nome);
    setPreco(p.preco || "");
    setDesc(p.desc || "");
    setImg(p.img || "");
    setEditandoId(p.objectId);
  };

  // =========================================
  // CATEGORIAS (LOCAL STORAGE)
  // =========================================

  const [categorias, setCategorias] = useState([]);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [editandoCategoria, setEditandoCategoria] = useState(null);

  useEffect(() => {

    const salvas = localStorage.getItem("categorias");

    if (salvas) {
      setCategorias(JSON.parse(salvas));
    } else {

      const iniciais = [
        { id: 1, nome: "Roupas" },
        { id: 2, nome: "Acessórios" }
      ];

      setCategorias(iniciais);

      localStorage.setItem(
        "categorias",
        JSON.stringify(iniciais)
      );
    }

  }, []);

  const salvarCategoria = () => {

    if (!nomeCategoria.trim()) {
      alert("Digite o nome da categoria!");
      return;
    }

    let novasCategorias = [];

    if (editandoCategoria) {

      novasCategorias = categorias.map(c =>
        c.id === editandoCategoria
          ? { ...c, nome: nomeCategoria }
          : c
      );

      setEditandoCategoria(null);

    } else {

      novasCategorias = [
        ...categorias,
        {
          id: Date.now(),
          nome: nomeCategoria
        }
      ];
    }

    setCategorias(novasCategorias);

    localStorage.setItem(
      "categorias",
      JSON.stringify(novasCategorias)
    );

    setNomeCategoria("");
  };

  const editarCategoria = (categoria) => {
    setNomeCategoria(categoria.nome);
    setEditandoCategoria(categoria.id);
  };

  const removerCategoria = (id) => {

    const novasCategorias =
      categorias.filter(c => c.id !== id);

    setCategorias(novasCategorias);

    localStorage.setItem(
      "categorias",
      JSON.stringify(novasCategorias)
    );
  };

  // =========================================
  // COLEÇÕES (LOCAL STORAGE)
  // =========================================

  const [colecoes, setColecoes] = useState([]);
  const [nomeColecao, setNomeColecao] = useState("");
  const [editandoColecao, setEditandoColecao] = useState(null);

  useEffect(() => {

    const salvas = localStorage.getItem("colecoes");

    if (salvas) {

      setColecoes(JSON.parse(salvas));

    } else {

      const iniciais = [
        { id: 1, nome: "Coleção Verão" },
        { id: 2, nome: "Coleção Páscoa" }
      ];

      setColecoes(iniciais);

      localStorage.setItem(
        "colecoes",
        JSON.stringify(iniciais)
      );
    }

  }, []);

  const salvarColecao = () => {

    if (!nomeColecao.trim()) {
      alert("Digite o nome da coleção!");
      return;
    }

    let novasColecoes = [];

    if (editandoColecao) {

      novasColecoes = colecoes.map(c =>
        c.id === editandoColecao
          ? { ...c, nome: nomeColecao }
          : c
      );

      setEditandoColecao(null);

    } else {

      novasColecoes = [
        ...colecoes,
        {
          id: Date.now(),
          nome: nomeColecao
        }
      ];
    }

    setColecoes(novasColecoes);

    localStorage.setItem(
      "colecoes",
      JSON.stringify(novasColecoes)
    );

    setNomeColecao("");
  };

  const editarColecao = (colecao) => {
    setNomeColecao(colecao.nome);
    setEditandoColecao(colecao.id);
  };

  const removerColecao = (id) => {

    const novasColecoes =
      colecoes.filter(c => c.id !== id);

    setColecoes(novasColecoes);

    localStorage.setItem(
      "colecoes",
      JSON.stringify(novasColecoes)
    );
  };

  // =========================================
  // BANNERS / CARROSSEL (LOCAL STORAGE)
  // =========================================

  const [banners, setBanners] = useState([]);

  const [imgBanner, setImgBanner] = useState("");
  const [linkBanner, setLinkBanner] = useState("");
  const [corBanner, setCorBanner] = useState("");

  const [editandoBanner, setEditandoBanner] = useState(null);

  useEffect(() => {

    const salvos = localStorage.getItem("banners");

    if (salvos) {

      setBanners(JSON.parse(salvos));

    } else {

      const iniciais = [
        {
          id: 1,
          img: "/colar-musgo.png",
          link: "/produto/2",
          cor: "#FF8C00"
        }
      ];

      setBanners(iniciais);

      localStorage.setItem(
        "banners",
        JSON.stringify(iniciais)
      );
    }

  }, []);

  const salvarBanner = () => {

    if (!imgBanner.trim()) {
      alert("Imagem obrigatória!");
      return;
    }

    let novosBanners = [];

    const banner = {
      id: editandoBanner || Date.now(),
      img: imgBanner,
      link: linkBanner || "/",
      cor: corBanner || "#333"
    };

    if (editandoBanner) {

      novosBanners = banners.map(b =>
        b.id === editandoBanner
          ? banner
          : b
      );

      setEditandoBanner(null);

    } else {

      novosBanners = [
        ...banners,
        banner
      ];
    }

    setBanners(novosBanners);

    localStorage.setItem(
      "banners",
      JSON.stringify(novosBanners)
    );

    setImgBanner("");
    setLinkBanner("");
    setCorBanner("");
  };

  const editarBanner = (banner) => {
    setImgBanner(banner.img);
    setLinkBanner(banner.link);
    setCorBanner(banner.cor);
    setEditandoBanner(banner.id);
  };

  const removerBanner = (id) => {

    const novosBanners =
      banners.filter(b => b.id !== id);

    setBanners(novosBanners);

    localStorage.setItem(
      "banners",
      JSON.stringify(novosBanners)
    );
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div style={{
      padding: "20px",
      maxWidth: "650px",
      margin: "0 auto"
    }}>

      <h1 style={{
        textAlign: "center",
        marginBottom: "30px"
      }}>
        Admin
      </h1>

      {/* PRODUTOS */}

      <div style={boxStyle}>

        <h2>Produtos</h2>

        <input
          placeholder="Nome *"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="URL da imagem"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Descrição"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={salvarProduto}
          style={botaoVerde}
        >
          {editandoId
            ? "Salvar edição"
            : "Adicionar produto"}
        </button>

        <h3 style={{ marginTop: "25px" }}>
          Produtos cadastrados
        </h3>

        {produtos.map((p) => (
          <div key={p.objectId} style={cardStyle}>

            <div>
              <strong>{p.nome}</strong>

              <p style={{
                margin: 0,
                fontSize: "12px"
              }}>
                {p.preco || "Sem preço"}
              </p>
            </div>

            <div style={{
              display: "flex",
              gap: "5px"
            }}>
              <button onClick={() => editarProduto(p)}>
                ✏️
              </button>

              <button onClick={() => removerProduto(p.objectId)}>
                🗑️
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* CATEGORIAS */}

      <div style={boxStyle}>

        <h2>Categorias</h2>

        <input
          placeholder="Nome da categoria"
          value={nomeCategoria}
          onChange={(e) => setNomeCategoria(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={salvarCategoria}
          style={botaoAzul}
        >
          {editandoCategoria
            ? "Salvar edição"
            : "Adicionar categoria"}
        </button>

        {categorias.map((c) => (
          <div key={c.id} style={cardStyle}>

            <strong>{c.nome}</strong>

            <div style={{
              display: "flex",
              gap: "5px"
            }}>
              <button onClick={() => editarCategoria(c)}>
                ✏️
              </button>

              <button onClick={() => removerCategoria(c.id)}>
                🗑️
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* COLEÇÕES */}

      <div style={boxStyle}>

        <h2>Coleções</h2>

        <input
          placeholder="Nome da coleção"
          value={nomeColecao}
          onChange={(e) => setNomeColecao(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={salvarColecao}
          style={botaoLaranja}
        >
          {editandoColecao
            ? "Salvar edição"
            : "Adicionar coleção"}
        </button>

        {colecoes.map((c) => (
          <div key={c.id} style={cardStyle}>

            <strong>{c.nome}</strong>

            <div style={{
              display: "flex",
              gap: "5px"
            }}>
              <button onClick={() => editarColecao(c)}>
                ✏️
              </button>

              <button onClick={() => removerColecao(c.id)}>
                🗑️
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* BANNERS */}

      <div style={boxStyle}>

        <h2>Carrossel</h2>

        <input
          placeholder="Imagem do banner"
          value={imgBanner}
          onChange={(e) => setImgBanner(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Link do produto"
          value={linkBanner}
          onChange={(e) => setLinkBanner(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Cor do fundo"
          value={corBanner}
          onChange={(e) => setCorBanner(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={salvarBanner}
          style={botaoRoxo}
        >
          {editandoBanner
            ? "Salvar edição"
            : "Adicionar banner"}
        </button>

        {banners.map((b) => (
          <div key={b.id} style={cardStyle}>

            <div>
              <strong>{b.link}</strong>

              <p style={{
                margin: 0,
                fontSize: "12px"
              }}>
                {b.cor}
              </p>
            </div>

            <div style={{
              display: "flex",
              gap: "5px"
            }}>
              <button onClick={() => editarBanner(b)}>
                ✏️
              </button>

              <button onClick={() => removerBanner(b.id)}>
                🗑️
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================
// ESTILOS
// =========================================

const boxStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "15px",
  marginBottom: "30px"
};

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

const cardStyle = {
  background: "#f5f5f5",
  padding: "10px",
  borderRadius: "10px",
  marginTop: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const botaoVerde = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#228B22",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
};

const botaoAzul = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#1E90FF",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
};

const botaoLaranja = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#D2691E",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
};

const botaoRoxo = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#8A2BE2",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
};