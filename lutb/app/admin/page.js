"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Admin() {

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [imagens, setImagens] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [colecaoSelecionada, setColecaoSelecionada] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [editandoCategoria, setEditandoCategoria] = useState(null);

  const [colecoes, setColecoes] = useState([]);
  const [nomeColecao, setNomeColecao] = useState("");
  const [iconeColecao, setIconeColecao] = useState("");
  const [corColecao, setCorColecao] = useState("#987317");
  const [fixarHome, setFixarHome] = useState(false);
  const [editandoColecao, setEditandoColecao] = useState(null);

  const [todosProdutos, setTodosProdutos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [buscaBanner, setBuscaBanner] = useState("");
  const [sugestoesBanner, setSugestoesBanner] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [corBanner, setCorBanner] = useState("#FF8C00");
  const [editandoBanner, setEditandoBanner] = useState(null);

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
    carregarColecoes();
    carregarBanners();
  }, []);

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase.from("Produto").select("id, nome, img");
      setTodosProdutos(data || []);
    };
    carregar();
  }, []);

  useEffect(() => {
    if (!buscaBanner.trim()) { setSugestoesBanner([]); return; }
    const termo = buscaBanner.toLowerCase();
    setSugestoesBanner(todosProdutos.filter(p => p.nome.toLowerCase().includes(termo)));
  }, [buscaBanner, todosProdutos]);

  const carregarProdutos = async () => {
    const { data } = await supabase.from("Produto").select("*").order("created_at", { ascending: false });
    setProdutos(data || []);
  };

  const carregarCategorias = async () => {
    const { data } = await supabase.from("Categoria").select("*").order("created_at", { ascending: true });
    setCategorias(data || []);
  };

  const carregarColecoes = async () => {
    const { data } = await supabase.from("Colecao").select("*").order("created_at", { ascending: true });
    setColecoes(data || []);
  };

  const carregarBanners = async () => {
    const { data } = await supabase.from("Banner").select("*").order("created_at", { ascending: true });
    setBanners(data || []);
  };

  const adicionarCampoImagem = () => setImagens([...imagens, ""]);
  const atualizarImagem = (index, valor) => { const novas = [...imagens]; novas[index] = valor; setImagens(novas); };
  const removerImagem = (index) => setImagens(imagens.filter((_, i) => i !== index));

  const salvarProduto = async () => {
    if (!nome.trim()) { alert("Nome obrigatório!"); return; }
    const dados = { nome, preco, descricao: desc, img };
    let produtoId = editandoId;
    if (editandoId) {
      await supabase.from("Produto").update(dados).eq("id", editandoId);
      await supabase.from("produto_imagem").delete().eq("produto_id", editandoId);
      await supabase.from("produto_categoria").delete().eq("produto_id", editandoId);
      await supabase.from("produto_colecao").delete().eq("produto_id", editandoId);
    } else {
      const { data } = await supabase.from("Produto").insert(dados).select().single();
      produtoId = data?.id;
    }
    const imagensFiltradas = imagens.filter(url => url.trim() !== "");
    if (produtoId && imagensFiltradas.length > 0) {
      await supabase.from("produto_imagem").insert(imagensFiltradas.map((url, i) => ({ produto_id: produtoId, url, ordem: i })));
    }
    if (produtoId && categoriaSelecionada) {
      await supabase.from("produto_categoria").insert({ produto_id: produtoId, categoria_id: categoriaSelecionada });
    }
    if (produtoId && colecaoSelecionada) {
      await supabase.from("produto_colecao").insert({ produto_id: produtoId, colecao_id: colecaoSelecionada });
    }
    setNome(""); setPreco(""); setDesc(""); setImg(""); setImagens([]);
    setCategoriaSelecionada(""); setColecaoSelecionada(""); setEditandoId(null);
    carregarProdutos();
  };

  const editarProduto = async (p) => {
    setNome(p.nome); setPreco(p.preco || ""); setDesc(p.descricao || ""); setImg(p.img || ""); setEditandoId(p.id);
    const { data: imgs } = await supabase.from("produto_imagem").select("url").eq("produto_id", p.id).order("ordem");
    setImagens((imgs || []).map(i => i.url));
    const { data: cats } = await supabase.from("produto_categoria").select("categoria_id").eq("produto_id", p.id);
    if (cats && cats.length > 0) setCategoriaSelecionada(cats[0].categoria_id);
    const { data: cols } = await supabase.from("produto_colecao").select("colecao_id").eq("produto_id", p.id);
    if (cols && cols.length > 0) setColecaoSelecionada(cols[0].colecao_id);
  };

  const removerProduto = async (id) => {
    await supabase.from("produto_imagem").delete().eq("produto_id", id);
    await supabase.from("produto_categoria").delete().eq("produto_id", id);
    await supabase.from("produto_colecao").delete().eq("produto_id", id);
    await supabase.from("Produto").delete().eq("id", id);
    carregarProdutos();
  };

  const salvarCategoria = async () => {
    if (!nomeCategoria.trim()) { alert("Digite o nome da categoria!"); return; }
    if (editandoCategoria) {
      await supabase.from("Categoria").update({ nome: nomeCategoria }).eq("id", editandoCategoria);
      setEditandoCategoria(null);
    } else {
      await supabase.from("Categoria").insert({ nome: nomeCategoria });
    }
    setNomeCategoria("");
    carregarCategorias();
  };

  const editarCategoria = (c) => { setNomeCategoria(c.nome); setEditandoCategoria(c.id); };

  const removerCategoria = async (id) => {
    await supabase.from("produto_categoria").delete().eq("categoria_id", id);
    await supabase.from("Categoria").delete().eq("id", id);
    carregarCategorias();
  };


  const gerenciarCheckboxHome = (marcado) => {
    if (marcado) {
      
      const jaFixados = colecoes.filter(c => c.fixar_home && c.id !== editandoColecao).length;
      
      if (jaFixados >= 2) {
        alert("Limite máximo atingido! Você só pode fixar até 2 coleções na página inicial. Desmarque outra coleção antes de fixar esta.");
        return;
      }
    }
    setFixarHome(marcado);
  };

  const salvarColecao = async () => {
    if (!nomeColecao.trim()) { alert("Digite o nome da coleção!"); return; }
    const dados = { nome: nomeColecao, icone: iconeColecao, cor: corColecao, fixar_home: fixarHome };
    if (editandoColecao) {
      await supabase.from("Colecao").update(dados).eq("id", editandoColecao);
      setEditandoColecao(null);
    } else {
      await supabase.from("Colecao").insert(dados);
    }
    setNomeColecao(""); setIconeColecao(""); setCorColecao("#987317"); setFixarHome(false);
    carregarColecoes();
  };

  const editarColecao = (c) => {
    setNomeColecao(c.nome); setIconeColecao(c.icone || ""); setCorColecao(c.cor || "#987317"); setFixarHome(c.fixar_home || false); setEditandoColecao(c.id);
  };

  const removerColecao = async (id) => {
    await supabase.from("produto_colecao").delete().eq("colecao_id", id);
    await supabase.from("Colecao").delete().eq("id", id);
    carregarColecoes();
  };

  const selecionarProduto = (produto) => { setProdutoSelecionado(produto); setBuscaBanner(produto.nome); setSugestoesBanner([]); };

  const salvarBanner = async () => {
    if (!produtoSelecionado) { alert("Selecione um produto válido!"); return; }
    const dados = { produto_id: produtoSelecionado.id, nome: produtoSelecionado.nome, img: produtoSelecionado.img, cor: corBanner };
    if (editandoBanner) {
      await supabase.from("Banner").update(dados).eq("id", editandoBanner);
      setEditandoBanner(null);
    } else {
      await supabase.from("Banner").insert(dados);
    }
    setBuscaBanner(""); setProdutoSelecionado(null); setCorBanner("#FF8C00");
    carregarBanners();
  };

  const editarBanner = (b) => { setProdutoSelecionado({ id: b.produto_id, nome: b.nome, img: b.img }); setBuscaBanner(b.nome); setCorBanner(b.cor); setEditandoBanner(b.id); };

  const removerBanner = async (id) => {
    await supabase.from("Banner").delete().eq("id", id);
    carregarBanners();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "650px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Admin</h1>

      <div style={boxStyle}>
        <h2>Produtos</h2>
        <input placeholder="Nome *" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />
        <input placeholder="Preço (ex: 35,00)" value={preco} onChange={(e) => setPreco(e.target.value)} style={inputStyle} />
        <textarea placeholder="Descrição" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ ...inputStyle, minHeight: "80px" }} />
        <p style={{ fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>Imagem principal</p>
        <input placeholder="URL da imagem principal" value={img} onChange={(e) => setImg(e.target.value)} style={inputStyle} />
        <p style={{ fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>Fotos adicionais <span style={{ fontWeight: "normal", color: "#888", fontSize: "12px" }}>(opcional — aparecem na página do produto)</span></p>
        {imagens.map((url, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
            <input placeholder={`URL da foto ${i + 1}`} value={url} onChange={(e) => atualizarImagem(i, e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
            <button onClick={() => removerImagem(i)} style={{ backgroundColor: "#E63946", color: "white", border: "none", borderRadius: "8px", padding: "10px 14px", cursor: "pointer", fontSize: "16px" }}>×</button>
          </div>
        ))}
        <button onClick={adicionarCampoImagem} style={{ width: "100%", padding: "10px", backgroundColor: "#f0f0f0", border: "2px dashed #bbb", borderRadius: "10px", cursor: "pointer", fontSize: "14px", color: "#555", marginBottom: "15px" }}>
          + Adicionar foto
        </button>
        <p style={{ fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>Categoria <span style={{ fontWeight: "normal", color: "#888", fontSize: "12px" }}>(opcional)</span></p>
        <select value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)} style={inputStyle}>
          <option value="">Sem categoria</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <p style={{ fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>Coleção <span style={{ fontWeight: "normal", color: "#888", fontSize: "12px" }}>(opcional)</span></p>
        <select value={colecaoSelecionada} onChange={(e) => setColecaoSelecionada(e.target.value)} style={inputStyle}>
          <option value="">Sem coleção</option>
          {colecoes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <button onClick={salvarProduto} style={botaoVerde}>{editandoId ? "Salvar edição" : "Adicionar produto"}</button>
        <h3 style={{ marginTop: "25px" }}>Produtos cadastrados</h3>
        {produtos.length === 0 && <p style={{ color: "#888", fontSize: "14px" }}>Nenhum produto ainda.</p>}
        {produtos.map((p) => (
          <div key={p.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {p.img && <img src={p.img} style={{ width: "45px", height: "45px", objectFit: "contain", borderRadius: "8px" }} />}
              <div>
                <strong>{p.nome}</strong>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{p.preco ? `R$ ${p.preco}` : "Sem preço"}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => editarProduto(p)}>✏️</button>
              <button onClick={() => removerProduto(p.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div style={boxStyle}>
        <h2>Categorias</h2>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>Categorias aparecem no menu lateral e em Todas as Categorias.</p>
        <input placeholder="Nome da categoria" value={nomeCategoria} onChange={(e) => setNomeCategoria(e.target.value)} style={inputStyle} />
        <button onClick={salvarCategoria} style={botaoAzul}>{editandoCategoria ? "Salvar edição" : "Adicionar categoria"}</button>
        {categorias.length === 0 && <p style={{ color: "#888", fontSize: "14px", marginTop: "10px" }}>Nenhuma categoria ainda.</p>}
        {categorias.map((c) => (
          <div key={c.id} style={cardStyle}>
            <strong>{c.nome}</strong>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => editarCategoria(c)}>✏️</button>
              <button onClick={() => removerCategoria(c.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div style={boxStyle}>
        <h2>Coleções</h2>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>Coleções aparecem no menu lateral. Marque "Fixar na home" para aparecer na página inicial (máximo 2).</p>
        <input placeholder="Nome da coleção *" value={nomeColecao} onChange={(e) => setNomeColecao(e.target.value)} style={inputStyle} />
        <input placeholder="URL do ícone (ex: /sol-icon.png) — opcional" value={iconeColecao} onChange={(e) => setIconeColecao(e.target.value)} style={inputStyle} />
        <label style={{ fontSize: "14px", fontWeight: "bold" }}>Cor de fundo</label>
        <input type="color" value={corColecao} onChange={(e) => setCorColecao(e.target.value)} style={{ width: "100%", height: "50px", border: "none", marginTop: "10px", marginBottom: "15px", cursor: "pointer" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
          {/* Atualizado o onChange para chamar a trava de segurança */}
          <input type="checkbox" id="fixarHome" checked={fixarHome} onChange={(e) => gerenciarCheckboxHome(e.target.checked)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
          <label htmlFor="fixarHome" style={{ fontSize: "14px", cursor: "pointer" }}>Fixar na home (máximo 2)</label>
        </div>
        <button onClick={salvarColecao} style={botaoLaranja}>{editandoColecao ? "Salvar edição" : "Adicionar coleção"}</button>
        {colecoes.length === 0 && <p style={{ color: "#888", fontSize: "14px", marginTop: "10px" }}>Nenhuma coleção ainda.</p>}
        {colecoes.map((c) => (
          <div key={c.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {c.icone && <img src={c.icone} style={{ width: "35px", height: "35px", objectFit: "contain" }} />}
              <div>
                <strong>{c.nome}</strong>
                <p style={{ margin: 0, fontSize: "12px", color: c.fixar_home ? "green" : "#888" }}>{c.fixar_home ? "✔ Fixada na home" : "Não fixada na home"}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => editarColecao(c)}>✏️</button>
              <button onClick={() => removerColecao(c.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div style={boxStyle}>
        <h2>Carrossel</h2>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>Banners appear no carrossel da home.</p>
        <div style={{ position: "relative" }}>
          <input placeholder="Digite o nome do produto" value={buscaBanner} onChange={(e) => { setBuscaBanner(e.target.value); setProdutoSelecionado(null); }} style={inputStyle} />
          {sugestoesBanner.length > 0 && (
            <div style={{ background: "white", border: "1px solid #ccc", borderRadius: "10px", marginTop: "-5px", marginBottom: "10px", overflow: "hidden" }}>
              {sugestoesBanner.map((p) => (
                <div key={p.id} onClick={() => selecionarProduto(p)} style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}>{p.nome}</div>
              ))}
            </div>
          )}
        </div>
        <p style={{ fontSize: "13px", color: produtoSelecionado ? "green" : "red" }}>
          {produtoSelecionado ? "Produto válido selecionado ✔" : "Selecione um produto existente"}
        </p>
        <label style={{ fontSize: "14px", fontWeight: "bold" }}>Cor do banner</label>
        <input type="color" value={corBanner} onChange={(e) => setCorBanner(e.target.value)} style={{ width: "100%", height: "50px", border: "none", marginTop: "10px", marginBottom: "15px", cursor: "pointer" }} />
        <button onClick={salvarBanner} style={botaoRoxo}>{editandoBanner ? "Salvar edição" : "Adicionar banner"}</button>
        {banners.length === 0 && <p style={{ color: "#888", fontSize: "14px", marginTop: "10px" }}>Nenhum banner ainda.</p>}
        {banners.map((b) => (
          <div key={b.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {b.img && <img src={b.img} style={{ width: "50px", height: "50px", objectFit: "contain" }} />}
              <div>
                <strong>{b.nome}</strong>
                <div style={{ width: "30px", height: "15px", background: b.cor, borderRadius: "5px", marginTop: "5px" }}></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => editarBanner(b)}>✏️</button>
              <button onClick={() => removerBanner(b.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const boxStyle = { background: "white", padding: "20px", borderRadius: "15px", marginBottom: "30px" };
const inputStyle = { width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "10px", border: "1px solid #ccc", boxSizing: "border-box" };
const cardStyle = { background: "#f5f5f5", padding: "10px", borderRadius: "10px", marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" };
const botaoVerde = { width: "100%", padding: "10px", backgroundColor: "#228B22", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" };
const botaoAzul = { width: "100%", padding: "10px", backgroundColor: "#1E90FF", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" };
const botaoLaranja = { width: "100%", padding: "10px", backgroundColor: "#D2691E", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" };
const botaoRoxo = { width: "100%", padding: "10px", backgroundColor: "#8A2BE2", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" };