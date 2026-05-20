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
  // PRODUTOS PARA CATEGORIAS/COLEÇÕES/BANNERS
  // =========================================

  const produtosFixos = [
    {
      id: "1",
      nome: "Colar Bolhas",
      img: "/colar-bolhas.png"
    },
    {
      id: "2",
      nome: "Colar Musgo",
      img: "/colar-musgo.png"
    },
    {
      id: "3",
      nome: "Moranguito",
      img: "/moranguito.png"
    },
    {
      id: "4",
      nome: "Tesouro Tropical",
      img: "/tesouro-tropical.png"
    }
  ];

  const [todosProdutos, setTodosProdutos] = useState([]);

  useEffect(() => {

    const carregarProdutosExtras = async () => {

      const res = await fetch(
        "https://parseapi.back4app.com/classes/Produto",
        { headers }
      );

      const data = await res.json();

      const dinamicos = (data.results || []).map(p => ({
        id: p.objectId,
        nome: p.nome,
        img: p.img || "/logo(lutb).png"
      }));

      setTodosProdutos([
        ...produtosFixos,
        ...dinamicos
      ]);
    };

    carregarProdutosExtras();

  }, []);

  // =========================================
  // CATEGORIAS
  // =========================================

  const [categorias, setCategorias] = useState([]);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [editandoCategoria, setEditandoCategoria] = useState(null);

  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [sugestoesCategoria, setSugestoesCategoria] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  useEffect(() => {

    const salvas = localStorage.getItem("categorias");

    if (salvas) {

      setCategorias(JSON.parse(salvas));

    } else {

      const iniciais = [
        {
          id: 1,
          nome: "Roupas",
          produtos: []
        },
        {
          id: 2,
          nome: "Acessórios",
          produtos: []
        }
      ];

      setCategorias(iniciais);

      localStorage.setItem(
        "categorias",
        JSON.stringify(iniciais)
      );
    }

  }, []);

  useEffect(() => {

    if (!buscaCategoria.trim()) {
      setSugestoesCategoria([]);
      return;
    }

    const termo = buscaCategoria.toLowerCase();

    const resultado = todosProdutos.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );

    setSugestoesCategoria(resultado);

  }, [buscaCategoria, todosProdutos]);

  const salvarCategoria = () => {

    if (!nomeCategoria.trim()) {
      alert("Digite o nome da categoria!");
      return;
    }

    let novasCategorias = [];

    if (editandoCategoria) {

      novasCategorias = categorias.map(c =>
        c.id === editandoCategoria
          ? {
              ...c,
              nome: nomeCategoria
            }
          : c
      );

      setEditandoCategoria(null);

    } else {

      novasCategorias = [
        ...categorias,
        {
          id: Date.now(),
          nome: nomeCategoria,
          produtos: []
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

  const adicionarProdutoCategoria = (
    categoriaId,
    produto
  ) => {

    const novasCategorias = categorias.map(c => {

      if (c.id !== categoriaId) return c;

      const jaExiste =
        c.produtos?.some(
          p => p.id === produto.id
        );

      if (jaExiste) return c;

      return {
        ...c,
        produtos: [
          ...(c.produtos || []),
          produto
        ]
      };
    });

    setCategorias(novasCategorias);

    localStorage.setItem(
      "categorias",
      JSON.stringify(novasCategorias)
    );

    setBuscaCategoria("");
  };

  const removerProdutoCategoria = (
    categoriaId,
    produtoId
  ) => {

    const novasCategorias = categorias.map(c => {

      if (c.id !== categoriaId) return c;

      return {
        ...c,
        produtos: c.produtos.filter(
          p => p.id !== produtoId
        )
      };
    });

    setCategorias(novasCategorias);

    localStorage.setItem(
      "categorias",
      JSON.stringify(novasCategorias)
    );
  };

  // =========================================
  // COLEÇÕES
  // =========================================

  const [colecoes, setColecoes] = useState([]);
  const [nomeColecao, setNomeColecao] = useState("");
  const [editandoColecao, setEditandoColecao] = useState(null);

  const [buscaColecao, setBuscaColecao] = useState("");
  const [sugestoesColecao, setSugestoesColecao] = useState([]);
  const [colecaoSelecionada, setColecaoSelecionada] = useState(null);

  useEffect(() => {

    const salvas = localStorage.getItem("colecoes");

    if (salvas) {

      setColecoes(JSON.parse(salvas));

    } else {

      const iniciais = [
        {
          id: 1,
          nome: "Coleção Verão",
          produtos: []
        },
        {
          id: 2,
          nome: "Coleção Páscoa",
          produtos: []
        }
      ];

      setColecoes(iniciais);

      localStorage.setItem(
        "colecoes",
        JSON.stringify(iniciais)
      );
    }

  }, []);

  useEffect(() => {

    if (!buscaColecao.trim()) {
      setSugestoesColecao([]);
      return;
    }

    const termo = buscaColecao.toLowerCase();

    const resultado = todosProdutos.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );

    setSugestoesColecao(resultado);

  }, [buscaColecao, todosProdutos]);

  const salvarColecao = () => {

    if (!nomeColecao.trim()) {
      alert("Digite o nome da coleção!");
      return;
    }

    let novasColecoes = [];

    if (editandoColecao) {

      novasColecoes = colecoes.map(c =>
        c.id === editandoColecao
          ? {
              ...c,
              nome: nomeColecao
            }
          : c
      );

      setEditandoColecao(null);

    } else {

      novasColecoes = [
        ...colecoes,
        {
          id: Date.now(),
          nome: nomeColecao,
          produtos: []
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

  const adicionarProdutoColecao = (
    colecaoId,
    produto
  ) => {

    const novasColecoes = colecoes.map(c => {

      if (c.id !== colecaoId) return c;

      const jaExiste =
        c.produtos?.some(
          p => p.id === produto.id
        );

      if (jaExiste) return c;

      return {
        ...c,
        produtos: [
          ...(c.produtos || []),
          produto
        ]
      };
    });

    setColecoes(novasColecoes);

    localStorage.setItem(
      "colecoes",
      JSON.stringify(novasColecoes)
    );

    setBuscaColecao("");
  };

  const removerProdutoColecao = (
    colecaoId,
    produtoId
  ) => {

    const novasColecoes = colecoes.map(c => {

      if (c.id !== colecaoId) return c;

      return {
        ...c,
        produtos: c.produtos.filter(
          p => p.id !== produtoId
        )
      };
    });

    setColecoes(novasColecoes);

    localStorage.setItem(
      "colecoes",
      JSON.stringify(novasColecoes)
    );
  };

  // =========================================
  // CARROSSEL
  // =========================================

  const [banners, setBanners] = useState([]);

  const [buscaBanner, setBuscaBanner] = useState("");
  const [sugestoesBanner, setSugestoesBanner] = useState([]);

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [corBanner, setCorBanner] = useState("#FF8C00");

  const [editandoBanner, setEditandoBanner] = useState(null);

  useEffect(() => {

    const salvos = localStorage.getItem("banners");

    if (salvos) {

      setBanners(JSON.parse(salvos));

    } else {

      const iniciais = [
        {
          id: 1,
          produtoId: "2",
          nome: "Colar Musgo",
          img: "/colar-musgo.png",
          cor: "#FF8C00"
        },
        {
          id: 2,
          produtoId: "3",
          nome: "Moranguito",
          img: "/moranguito.png",
          cor: "#FF4500"
        }
      ];

      setBanners(iniciais);

      localStorage.setItem(
        "banners",
        JSON.stringify(iniciais)
      );
    }

  }, []);

  useEffect(() => {

    if (!buscaBanner.trim()) {
      setSugestoesBanner([]);
      return;
    }

    const termo = buscaBanner.toLowerCase();

    const resultado = todosProdutos.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );

    setSugestoesBanner(resultado);

  }, [buscaBanner, todosProdutos]);

  const selecionarProduto = (produto) => {

    setProdutoSelecionado(produto);

    setBuscaBanner(produto.nome);

    setSugestoesBanner([]);
  };

  const salvarBanner = () => {

    if (!produtoSelecionado) {
      alert("Selecione um produto válido!");
      return;
    }

    const banner = {
      id: editandoBanner || Date.now(),
      produtoId: produtoSelecionado.id,
      nome: produtoSelecionado.nome,
      img: produtoSelecionado.img,
      cor: corBanner
    };

    let novosBanners = [];

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

    setBuscaBanner("");
    setProdutoSelecionado(null);

    setCorBanner("#FF8C00");
  };

  const editarBanner = (banner) => {

    setProdutoSelecionado({
      id: banner.produtoId,
      nome: banner.nome,
      img: banner.img
    });

    setBuscaBanner(banner.nome);

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

          <div
            key={c.id}
            style={cardStyle}
          >

            <div style={{ width: "100%" }}>

              <strong>{c.nome}</strong>

              <p style={{
                fontSize: "12px",
                color: "#666"
              }}>
                {c.produtos?.length || 0} produto(s)
              </p>

              <input
                placeholder="Adicionar produto"
                value={
                  categoriaSelecionada === c.id
                    ? buscaCategoria
                    : ""
                }
                onChange={(e) => {
                  setCategoriaSelecionada(c.id);
                  setBuscaCategoria(e.target.value);
                }}
                style={inputStyle}
              />

              {categoriaSelecionada === c.id &&
                sugestoesCategoria.length > 0 && (

                <div style={{
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  marginBottom: "10px"
                }}>

                  {sugestoesCategoria.map((p) => (

                    <div
                      key={p.id}
                      onClick={() =>
                        adicionarProdutoCategoria(c.id, p)
                      }
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee"
                      }}
                    >
                      {p.nome}
                    </div>
                  ))}
                </div>
              )}

              {c.produtos?.map((p) => (

                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                    background: "#fff",
                    padding: "8px",
                    borderRadius: "8px"
                  }}
                >

                  <span>{p.nome}</span>

                  <button
                    onClick={() =>
                      removerProdutoCategoria(
                        c.id,
                        p.id
                      )
                    }
                  >
                    ❌
                  </button>

                </div>
              ))}
            </div>

            <div style={{
              display: "flex",
              gap: "5px",
              marginLeft: "10px"
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

          <div
            key={c.id}
            style={cardStyle}
          >

            <div style={{ width: "100%" }}>

              <strong>{c.nome}</strong>

              <p style={{
                fontSize: "12px",
                color: "#666"
              }}>
                {c.produtos?.length || 0} produto(s)
              </p>

              <input
                placeholder="Adicionar produto"
                value={
                  colecaoSelecionada === c.id
                    ? buscaColecao
                    : ""
                }
                onChange={(e) => {
                  setColecaoSelecionada(c.id);
                  setBuscaColecao(e.target.value);
                }}
                style={inputStyle}
              />

              {colecaoSelecionada === c.id &&
                sugestoesColecao.length > 0 && (

                <div style={{
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  marginBottom: "10px"
                }}>

                  {sugestoesColecao.map((p) => (

                    <div
                      key={p.id}
                      onClick={() =>
                        adicionarProdutoColecao(c.id, p)
                      }
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee"
                      }}
                    >
                      {p.nome}
                    </div>
                  ))}
                </div>
              )}

              {c.produtos?.map((p) => (

                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                    background: "#fff",
                    padding: "8px",
                    borderRadius: "8px"
                  }}
                >

                  <span>{p.nome}</span>

                  <button
                    onClick={() =>
                      removerProdutoColecao(
                        c.id,
                        p.id
                      )
                    }
                  >
                    ❌
                  </button>

                </div>
              ))}
            </div>

            <div style={{
              display: "flex",
              gap: "5px",
              marginLeft: "10px"
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

      {/* CARROSSEL */}

      <div style={boxStyle}>

        <h2>Carrossel</h2>

        <div style={{ position: "relative" }}>

          <input
            placeholder="Digite o nome do produto"
            value={buscaBanner}
            onChange={(e) => {
              setBuscaBanner(e.target.value);
              setProdutoSelecionado(null);
            }}
            style={inputStyle}
          />

          {sugestoesBanner.length > 0 && (
            <div style={{
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "10px",
              marginTop: "-5px",
              marginBottom: "10px",
              overflow: "hidden"
            }}>
              {sugestoesBanner.map((p) => (
                <div
                  key={p.id}
                  onClick={() => selecionarProduto(p)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee"
                  }}
                >
                  {p.nome}
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{
          fontSize: "13px",
          color: produtoSelecionado
            ? "green"
            : "red"
        }}>
          {produtoSelecionado
            ? "Produto válido selecionado ✔"
            : "Selecione um produto existente"}
        </p>

        <label>
          Cor do banner
        </label>

        <input
          type="color"
          value={corBanner}
          onChange={(e) => setCorBanner(e.target.value)}
          style={{
            width: "100%",
            height: "50px",
            border: "none",
            marginTop: "10px",
            marginBottom: "15px",
            cursor: "pointer"
          }}
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

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <img
                src={b.img}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "contain"
                }}
              />

              <div>
                <strong>{b.nome}</strong>

                <div style={{
                  width: "30px",
                  height: "15px",
                  background: b.cor,
                  borderRadius: "5px",
                  marginTop: "5px"
                }}></div>
              </div>
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
  alignItems: "flex-start"
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