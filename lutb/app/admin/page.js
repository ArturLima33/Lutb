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
  const [imagemCategoria, setImagemCategoria] = useState("");
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

  const [arquivoLocalImg, setArquivoLocalImg] = useState("");
  const [arquivosLocaisAdicionais, setArquivosLocaisAdicionais] = useState([]);
  const [arquivoLocalCategoria, setArquivoLocalCategoria] = useState("");
  const [arquivoLocalColecao, setArquivoLocalColecao] = useState("");

  const [carregandoMidia, setCarregandoMidia] = useState(false);

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

  const fazerUploadArquivo = async (file) => {
    try {
      setCarregandoMidia(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Arquivos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('Arquivos').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Erro no upload: ", error);
      alert(`Erro ao subir arquivo: ${error.message}`);
      return null;
    } finally {
      setCarregandoMidia(false);
    }
  };

  const handleUploadMultiplo = async (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const novasUrls = [];
    for (const file of files) {
      const url = await fazerUploadArquivo(file);
      if (url) novasUrls.push(url);
    }
    setArquivosLocaisAdicionais(prev => [...prev, ...novasUrls]);
  };

  const adicionarCampoImagem = () => setImagens([...imagens, ""]);
  const removerArquivoAdicional = (index) =>
  setArquivosLocaisAdicionais(
    arquivosLocaisAdicionais.filter((_, i) => i !== index)
  );
  const atualizarImagem = (index, valor) => { const novas = [...imagens]; novas[index] = valor; setImagens(novas); };
  const removerImagemLink = (index) => setImagens(imagens.filter((_, i) => i !== index));
  const moverArquivo = (origem, destino) => {
  const novaLista = [...arquivosLocaisAdicionais];

  const itemMovido = novaLista[origem];

  novaLista.splice(origem, 1);
  novaLista.splice(destino, 0, itemMovido);

  setArquivosLocaisAdicionais(novaLista);
};

  const limparFormProduto = () => {
    setNome(""); setPreco(""); setDesc(""); setImg(""); setImagens([]);
    setArquivoLocalImg(""); setArquivosLocaisAdicionais([]);
    setCategoriaSelecionada(""); setColecaoSelecionada(""); setEditandoId(null);
  };

  const salvarProduto = async () => {
    if (!nome.trim()) { alert("Nome obrigatório!"); return; }
    
    const imagemPrincipalFinal = arquivoLocalImg || img || null;
    const dados = { nome, preco, descricao: desc, img: imagemPrincipalFinal };
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

    const linksValidos = imagens.filter(url => url && url.trim() !== "");
    const todasImagensAdicionais = [...linksValidos, ...arquivosLocaisAdicionais];

    if (produtoId && todasImagensAdicionais.length > 0) {
      await supabase.from("produto_imagem").insert(todasImagensAdicionais.map((url, i) => ({ produto_id: produtoId, url, ordem: i })));
    }
    if (produtoId && categoriaSelecionada) {
      await supabase.from("produto_categoria").insert({ produto_id: produtoId, categoria_id: categoriaSelecionada });
    }
    if (produtoId && colecaoSelecionada) {
      await supabase.from("produto_colecao").insert({ produto_id: produtoId, colecao_id: colecaoSelecionada });
    }
    limparFormProduto();
    carregarProdutos();
  };

  const editarProduto = async (p) => {
    setNome(p.nome); setPreco(p.preco || ""); setDesc(p.descricao || ""); setEditandoId(p.id);
    
    if (p.img && p.img.includes("supabase.co/storage")) {
      setArquivoLocalImg(p.img);
      setImg("");
    } else {
      setImg(p.img || "");
      setArquivoLocalImg("");
    }

    const { data: imgs } = await supabase.from("produto_imagem").select("url").eq("produto_id", p.id).order("ordem");
    const urlsBuscadas = (imgs || []).map(i => i.url);
    
    const doStorage = urlsBuscadas.filter(url => url.includes("supabase.co/storage"));
    const deLinks = urlsBuscadas.filter(url => !url.includes("supabase.co/storage"));
    
    setImagens(deLinks);
    setArquivosLocaisAdicionais(doStorage);

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

  const limparFormCategoria = () => { setNomeCategoria(""); setImagemCategoria(""); setArquivoLocalCategoria(""); setEditandoCategoria(null); };

  const salvarCategoria = async () => {
    if (!nomeCategoria.trim()) { alert("Digite o nome da categoria!"); return; }
    const imagemFinal = arquivoLocalCategoria || imagemCategoria || null;
    const dados = { nome: nomeCategoria, imagem: imagemFinal };
    if (editandoCategoria) {
      await supabase.from("Categoria").update(dados).eq("id", editandoCategoria);
    } else {
      await supabase.from("Categoria").insert(dados);
    }
    limparFormCategoria();
    carregarCategorias();
  };

  const editarCategoria = (c) => { 
    setNomeCategoria(c.nome); 
    setEditandoCategoria(c.id); 
    if (c.imagem && c.imagem.includes("supabase.co/storage")) {
      setArquivoLocalCategoria(c.imagem);
      setImagemCategoria("");
    } else {
      setImagemCategoria(c.imagem || "");
      setArquivoLocalCategoria("");
    }
  };

  const removerCategoria = async (id) => {
    await supabase.from("produto_categoria").delete().eq("categoria_id", id);
    await supabase.from("Categoria").delete().eq("id", id);
    carregarCategorias();
  };

  const gerenciarCheckboxHome = (marcado) => {
    if (marcado) {
      const jaFixados = colecoes.filter(c => c.fixar_home && c.id !== editandoColecao).length;
      if (jaFixados >= 2) {
        alert("Limite máximo atingido! Você só pode fixar até 2 coleções na página inicial.");
        return;
      }
    }
    setFixarHome(marcado);
  };

  const limparFormColeco = () => { setNomeColecao(""); setIconeColecao(""); setArquivoLocalColecao(""); setCorColecao("#987317"); setFixarHome(false); setEditandoColecao(null); };

  const salvarColecao = async () => {
    if (!nomeColecao.trim()) { alert("Digite o nome da coleção!"); return; }
    const iconeFinal = arquivoLocalColecao || iconeColecao || null;
    const dados = { nome: nomeColecao, icone: iconeFinal, cor: corColecao, fixar_home: fixarHome };
    if (editandoColecao) {
      await supabase.from("Colecao").update(dados).eq("id", editandoColecao);
    } else {
      await supabase.from("Colecao").insert(dados);
    }
    limparFormColeco();
    carregarColecoes();
  };

  const editarColecao = (c) => {
    setNomeColecao(c.nome); setCorColecao(c.cor || "#987317"); setFixarHome(c.fixar_home || false); setEditandoColecao(c.id);
    if (c.icone && c.icone.includes("supabase.co/storage")) {
      setArquivoLocalColecao(c.icone);
      setIconeColecao("");
    } else {
      setIconeColecao(c.icone || "");
      setArquivoLocalColecao("");
    }
  };

  const removerColecao = async (id) => {
    await supabase.from("produto_colecao").delete().eq("colecao_id", id);
    await supabase.from("Colecao").delete().eq("id", id);
    carregarColecoes();
  };

  const selecionarProduto = (produto) => { setProdutoSelecionado(produto); setBuscaBanner(produto.nome); setSugestoesBanner([]); };
  const limparFormBanner = () => { setBuscaBanner(""); setProdutoSelecionado(null); setCorBanner("#FF8C00"); setEditandoBanner(null); };

  const salvarBanner = async () => {
    if (!produtoSelecionado) { alert("Selecione um produto válido!"); return; }
    const dados = { produto_id: produtoSelecionado.id, nome: produtoSelecionado.nome, img: produtoSelecionado.img || null, cor: corBanner };
    if (editandoBanner) {
      await supabase.from("Banner").update(dados).eq("id", editandoBanner);
    } else {
      await supabase.from("Banner").insert(dados);
    }
    limparFormBanner();
    carregarBanners();
  };

  const editarBanner = (b) => { setProdutoSelecionado({ id: b.produto_id, nome: b.nome, img: b.img }); setBuscaBanner(b.nome); setCorBanner(b.cor); setEditandoBanner(b.id); };
  const removerBanner = async (id) => { await supabase.from("Banner").delete().eq("id", id); carregarBanners(); };

  const ehVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)($|\?)/i) || url.includes("video") || url.includes("mp4");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "650px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Painel Admin</h1>

      {carregandoMidia && (
        <div style={{ position: "fixed", top: 20, right: 20, background: "#000", color: "#fff", padding: "12px 24px", borderRadius: "8px", zIndex: 9999, fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
          ⏳ Subindo arquivo para o banco...
        </div>
      )}

      <div style={boxStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>Produtos</h2>
          {editandoId && <button onClick={limparFormProduto} style={botaoCancelarDestacado}>CANCELAR EDIÇÃO ×</button>}
        </div>
        
        <input placeholder="Nome *" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />
        <input placeholder="Preço (ex: 35,00)" value={preco} onChange={(e) => setPreco(e.target.value)} style={inputStyle} />
        <textarea placeholder="Descrição" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ ...inputStyle, minHeight: "80px" }} />
        
        <div style={subSeccionStyle}>
          <p style={{ fontWeight: "bold", margin: "0 0 12px 0", fontSize: "14px", color: "#2c3e50" }}>🔗 Opção A: Inserir Mídias via Link externo (URL)</p>
          <input placeholder="Colar endereço/link da imagem principal" value={img} onChange={(e) => setImg(e.target.value)} style={inputStyle} />
          {imagens.map((url, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input placeholder={`Colar link da foto/vídeo adicional ${i + 1}`} value={url} onChange={(e) => atualizarImagem(i, e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button onClick={() => removerImagemLink(i)} style={{ backgroundColor: "#E63946", color: "white", border: "none", borderRadius: "8px", padding: "0 14px", cursor: "pointer" }}>×</button>
            </div>
          ))}
          <button onClick={adicionarCampoImagem} style={{ width: "100%", padding: "10px", backgroundColor: "#f9f9f9", border: "1px dashed #bbb", borderRadius: "10px", cursor: "pointer", fontSize: "13px" }}>
            + Adicionar novo campo para colar link manual
          </button>
        </div>

        <div style={subSeccionStyle}>
          <p style={{ fontWeight: "bold", margin: "0 0 12px 0", fontSize: "14px", color: "#2c3e50" }}>📁 Opção B: Fazer Upload de Arquivos do seu aparelho</p>
          <div style={{ marginBottom: "16px" }}>
            <label style={fileLabelStyle}>
              📷 Carregar arquivo para a Imagem Principal
              <input type="file" accept="image/*,video/*" onChange={async (e) => {
                if(e.target.files?.[0]) {
                  const url = await fazerUploadArquivo(e.target.files[0]);
                  if(url) setArquivoLocalImg(url);
                }
              }} style={{ display: "none" }} />
            </label>
            {arquivoLocalImg && (
              <div style={previewContainerStyle}>
                {ehVideo(arquivoLocalImg) ? <video src={arquivoLocalImg} style={previewMediaStyle} controls muted /> : <img src={arquivoLocalImg} style={previewMediaStyle} alt="" />}
                <button type="button" onClick={() => setArquivoLocalImg("")} style={removePreviewButtonStyle}>✕</button>
              </div>
            )}
          </div>

          <div>
            <label style={fileLabelStyle}>
              🗂️ Selecionar arquivos adicionais (Múltiplas fotos/vídeos)
              <input type="file" accept="image/*,video/*" multiple onChange={handleUploadMultiplo} style={{ display: "none" }} />
            </label>
            {arquivosLocaisAdicionais.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px", marginTop: "12px" }}>
                {arquivosLocaisAdicionais.map((url, i) => (
                  <div
                  key={i}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("index", i);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const origem = Number(
                      e.dataTransfer.getData("index")
                    );
                    moverArquivo(origem, i);
                  }}
                  style={{
                    ...previewContainerStyle,
                    cursor: "grab"
                    }}
                    >
                    {ehVideo(url) ? <video src={url} style={previewMediaStyle} muted playsInline controls /> : <img src={url} style={previewMediaStyle} alt="" />}
                    <button type="button" onClick={() => removerArquivoAdicional(i)} style={removePreviewButtonStyle}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <select value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)} style={inputStyle}>
          <option value="">Sem categoria</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select value={colecaoSelecionada} onChange={(e) => setColecaoSelecionada(e.target.value)} style={inputStyle}>
          <option value="">Sem coleção</option>
          {colecoes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        
        <button onClick={salvarProduto} style={botaoVerde}>{editandoId ? "✅ Salvar alterações do produto" : "➕ Adicionar novo produto"}</button>
        
        <h3 style={{ marginTop: "30px" }}>Produtos cadastrados</h3>
        {produtos.map((p) => (
          <div key={p.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {p.img && (
                ehVideo(p.img) ? <video src={p.img} style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "8px" }} muted /> : <img src={p.img} style={{ width: "45px", height: "45px", objectFit: "contain", borderRadius: "8px" }} alt="" />
              )}
              <div><strong>{p.nome}</strong><p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{p.preco ? `R$ ${p.preco}` : "Sem preço"}</p></div>
            </div>
            <div style={{ display: "flex", gap: "5px" }}><button onClick={() => editarProduto(p)}>✏️</button><button onClick={() => removerProduto(p.id)}>🗑</button></div>
          </div>
        ))}
      </div>

      <div style={boxStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>Categorias</h2>
          {editandoCategoria && <button onClick={limparFormCategoria} style={botaoCancelarDestacado}>CANCELAR EDIÇÃO ×</button>}
        </div>

        <input placeholder="Nome da categoria *" value={nomeCategoria} onChange={(e) => setNomeCategoria(e.target.value)} style={inputStyle} />
        
        <div style={subSeccionStyle}>
          <p style={{ fontWeight: "bold", margin: "0 0 8px 0", fontSize: "13px" }}>🔗 Link Externo (URL)</p>
          <input placeholder="Colar link da imagem" value={imagemCategoria} onChange={(e) => setImagemCategoria(e.target.value)} style={inputStyle} />
        </div>

        <div style={subSeccionStyle}>
          <p style={{ fontWeight: "bold", margin: "0 0 8px 0", fontSize: "13px" }}>📁 Arquivo Local</p>
          <label style={fileLabelStyle}>
            📁 Escolher imagem do dispositivo
            <input type="file" accept="image/*" onChange={async (e) => {
              if(e.target.files?.[0]) {
                const url = await fazerUploadArquivo(e.target.files[0]);
                if(url) setArquivoLocalCategoria(url);
              }
            }} style={{ display: "none" }} />
          </label>
          {arquivoLocalCategoria && (
            <div style={previewContainerStyle}><img src={arquivoLocalCategoria} style={previewMediaStyle} alt="" /><button type="button" onClick={() => setArquivoLocalCategoria("")} style={removePreviewButtonStyle}>✕</button></div>
          )}
        </div>

        <button onClick={salvarCategoria} style={botaoAzul}>{editandoCategoria ? "✅ Salvar alterações da categoria" : "➕ Adicionar categoria"}</button>
        
        {categorias.map((c) => (
          <div key={c.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {c.imagem && <img src={c.imagem} style={{ width: "35px", height: "35px", objectFit: "contain", borderRadius: "8px" }} alt="" />}
              <strong>{c.nome}</strong>
            </div>
            <div style={{ display: "flex", gap: "5px" }}><button onClick={() => editarCategoria(c)}>✏️</button><button onClick={() => removerCategoria(c.id)}>🗑</button></div>
          </div>
        ))}
      </div>

      <div style={boxStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>Coleções</h2>
          {editandoColecao && <button onClick={limparFormColeco} style={botaoCancelarDestacado}>CANCELAR EDIÇÃO ×</button>}
        </div>

        <input placeholder="Nome da coleção *" value={nomeColecao} onChange={(e) => setNomeColecao(e.target.value)} style={inputStyle} />
        
        <div style={subSeccionStyle}>
          <p style={{ fontWeight: "bold", margin: "0 0 8px 0", fontSize: "13px" }}>🔗 Link Externo (URL)</p>
          <input placeholder="Colar link do ícone" value={iconeColecao} onChange={(e) => setIconeColecao(e.target.value)} style={inputStyle} />
        </div>

        <div style={subSeccionStyle}>
          <p style={{ fontWeight: "bold", margin: "0 0 8px 0", fontSize: "13px" }}>📁 Arquivo Local</p>
          <label style={fileLabelStyle}>
            📁 Escolher ícone do dispositivo
            <input type="file" accept="image/*" onChange={async (e) => {
              if(e.target.files?.[0]) {
                const url = await fazerUploadArquivo(e.target.files[0]);
                if(url) setArquivoLocalColecao(url);
              }
            }} style={{ display: "none" }} />
          </label>
          {arquivoLocalColecao && (
            <div style={previewContainerStyle}><img src={arquivoLocalColecao} style={previewMediaStyle} alt="" /><button type="button" onClick={() => setArquivoLocalColecao("")} style={removePreviewButtonStyle}>✕</button></div>
          )}
        </div>

        <input type="color" value={corColecao} onChange={(e) => setCorColecao(e.target.value)} style={{ width: "100%", height: "45px", borderRadius: "8px", marginBottom: "15px", cursor: "pointer" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
          <input type="checkbox" id="fixarHome" checked={fixarHome} onChange={(e) => gerenciarCheckboxHome(e.target.checked)} style={{ width: "20px", height: "20px" }} />
          <label htmlFor="fixarHome">Fixar na home (máximo 2)</label>
        </div>
        <button onClick={salvarColecao} style={botaoLaranja}>{editandoColecao ? "✅ Salvar alterações da coleção" : "➕ Adicionar coleção"}</button>
        
        {colecoes.map((c) => (
          <div key={c.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {c.icone && <img src={c.icone} style={{ width: "35px", height: "35px", objectFit: "contain" }} alt="" />}
              <strong>{c.nome}</strong>
            </div>
            <div style={{ display: "flex", gap: "5px" }}><button onClick={() => editarColecao(c)}>✏️</button><button onClick={() => removerColecao(c.id)}>🗑</button></div>
          </div>
        ))}
      </div>

      <div style={boxStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>Carrossel</h2>
          {editandoBanner && <button onClick={limparFormBanner} style={botaoCancelarDestacado}>CANCELAR EDIÇÃO ×</button>}
        </div>

        <input placeholder="Digite o nome do produto para buscar..." value={buscaBanner} onChange={(e) => setBuscaBanner(e.target.value)} style={inputStyle} />
        {sugestoesBanner.length > 0 && (
          <div style={{ border: "1px solid #ddd", borderRadius: "10px", background: "#fff", padding: "5px", marginBottom: "15px", maxHeight: "150px", overflowY: "auto" }}>
            {sugestoesBanner.map(p => (
              <div key={p.id} onClick={() => selecionarProduto(p)} style={{ padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                {p.img && <img src={p.img} style={{ width: "30px", height: "30px", objectFit: "contain" }} alt="" />}
                <span>{p.nome}</span>
              </div>
            ))}
          </div>
        )}
        {produtoSelecionado && (
          <div style={{ background: "#eef7ff", padding: "10px", borderRadius: "10px", marginBottom: "15px", display: "flex", justifyContent: "space-between" }}>
            <span>Produto selecionado: <strong>{produtoSelecionado.nome}</strong></span>
            <span onClick={() => setProdutoSelecionado(null)} style={{ cursor: "pointer" }}>✕</span>
          </div>
        )}
        <input type="color" value={corBanner} onChange={(e) => setCorBanner(e.target.value)} style={{ width: "100%", height: "45px", borderRadius: "8px", marginBottom: "15px", cursor: "pointer" }} />
        <button onClick={salvarBanner} style={botaoRoxo}>{editandoBanner ? "✅ Salvar Alteração do Banner" : "➕ Adicionar banner"}</button>

        {banners.map((b) => (
          <div key={b.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {b.img && <img src={b.img} style={{ width: "40px", height: "40px", objectFit: "contain" }} alt="" />}
              <strong>{b.nome}</strong>
            </div>
            <div style={{ display: "flex", gap: "5px" }}><button onClick={() => editarBanner(b)}>✏️</button><button onClick={() => removerBanner(b.id)}>🗑</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const boxStyle = { background: "white", padding: "25px", borderRadius: "16px", marginBottom: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" };
const subSeccionStyle = { background: "#fdfdfd", border: "1px solid #eaeaea", padding: "15px", borderRadius: "12px", marginBottom: "15px" };
const inputStyle = { width: "100%", marginBottom: "12px", padding: "11px", borderRadius: "10px", border: "1px solid #ccc", boxSizing: "border-box" };
const cardStyle = { background: "#f9f9f9", padding: "12px", borderRadius: "10px", marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #eee" };
const fileLabelStyle = { display: "block", textAlign: "center", padding: "10px", backgroundColor: "#f0f2f5", color: "#4b5563", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "500", border: "1px solid #d1d5db" };
const previewContainerStyle = { position: "relative", marginTop: "10px", width: "90px", height: "90px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", background: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center" };
const previewMediaStyle = { width: "100%", height: "100%", objectFit: "contain" };
const removePreviewButtonStyle = { position: "absolute", top: "2px", right: "2px", background: "rgba(230, 57, 70, 0.9)", color: "white", border: "none", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", cursor: "pointer", fontWeight: "bold" };

const botaoVerde = { width: "100%", padding: "12px", backgroundColor: "#228B22", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" };
const botaoAzul = { width: "100%", padding: "12px", backgroundColor: "#1E90FF", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" };
const botaoLaranja = { width: "100%", padding: "12px", backgroundColor: "#D2691E", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" };
const botaoRoxo = { width: "100%", padding: "12px", backgroundColor: "#8A2BE2", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" };
const botaoCancelarDestacado = { backgroundColor: "#E63946", color: "white", border: "2px solid #b81d24", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "bold", letterSpacing: "0.5px" };