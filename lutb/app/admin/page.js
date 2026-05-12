"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados do Produto
  const [prodId, setProdId] = useState(null);
  const [nomeProd, setNomeProd] = useState("");
  const [precoProd, setPrecoProd] = useState("");
  const [descProd, setDescProd] = useState("");
  const [imgProd, setImgProd] = useState("");
  const [catProd, setCatProd] = useState("");
  const [corBanner, setCorBanner] = useState("#987317");
  const [noCarrossel, setNoCarrossel] = useState(false);

  // Estados da Categoria
  const [catId, setCatId] = useState(null);
  const [nomeCat, setNomeCat] = useState("");
  const [cor1, setCor1] = useState("#987317");
  const [cor2, setCor2] = useState("#cebb4b");
  const [naHome, setNaHome] = useState(false);

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
    "Content-Type": "application/json",
  };

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    const resP = await fetch("https://parseapi.back4app.com/classes/Produto", { headers });
    const dataP = await resP.json();
    setProdutos(dataP.results || []);

    const resC = await fetch("https://parseapi.back4app.com/classes/Categoria", { headers });
    const dataC = await resC.json();
    setCategorias(dataC.results || []);
  };

  const salvarProduto = async () => {
    const dados = { 
      nome: nomeProd, preco: precoProd, desc: descProd, 
      img: imgProd, categoria: catProd, cor: corBanner, noCarrossel 
    };
    const url = prodId ? `https://parseapi.back4app.com/classes/Produto/${prodId}` : "https://parseapi.back4app.com/classes/Produto";
    await fetch(url, { method: prodId ? "PUT" : "POST", headers, body: JSON.stringify(dados) });
    limparProd(); carregarDados();
  };

  const salvarCategoria = async () => {
    const dados = { nome: nomeCat, cor1, cor2, naHome };
    const url = catId ? `https://parseapi.back4app.com/classes/Categoria/${catId}` : "https://parseapi.back4app.com/classes/Categoria";
    await fetch(url, { method: catId ? "PUT" : "POST", headers, body: JSON.stringify(dados) });
    limparCat(); carregarDados();
  };

  const editarProduto = (p) => {
    setProdId(p.objectId); setNomeProd(p.nome); setPrecoProd(p.preco);
    setDescProd(p.desc); setImgProd(p.img); setCatProd(p.categoria);
    setCorBanner(p.cor); setNoCarrossel(p.noCarrossel);
  };

  const editarCategoria = (c) => {
    setCatId(c.objectId); setNomeCat(c.nome); setCor1(c.cor1); setCor2(c.cor2); setNaHome(c.naHome);
  };

  const limparProd = () => { setProdId(null); setNomeProd(""); setPrecoProd(""); setDescProd(""); setImgProd(""); setCatProd(""); setNoCarrossel(false); };
  const limparCat = () => { setCatId(null); setNomeCat(""); setCor1("#987317"); setCor2("#cebb4b"); setNaHome(false); };

  const excluir = async (classe, id) => {
    if(confirm("Excluir permanentemente?")) {
      await fetch(`https://parseapi.back4app.com/classes/${classe}/${id}`, { method: "DELETE", headers });
      carregarDados();
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f0f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2D2D1A' }}>Gestão da Loja</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        
        {/* COLUNA 1: FORMULÁRIOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3>{prodId ? "Editar" : "Novo"} Produto</h3>
            <input placeholder="Nome" value={nomeProd} onChange={e => setNomeProd(e.target.value)} style={inputStyle} />
            <input placeholder="Preço" value={precoProd} onChange={e => setPrecoProd(e.target.value)} style={inputStyle} />
            <input placeholder="URL da Imagem" value={imgProd} onChange={e => setImgProd(e.target.value)} style={inputStyle} />
            <textarea placeholder="Descrição" value={descProd} onChange={e => setDescProd(e.target.value)} style={inputStyle} />
            <select value={catProd} onChange={e => setCatProd(e.target.value)} style={inputStyle}>
              <option value="">Selecione a Coleção</option>
              {categorias.map(c => <option key={c.objectId} value={c.nome}>{c.nome}</option>)}
            </select>
            <div style={{ margin: '10px 0' }}>
              Cor do Banner: <input type="color" value={corBanner} onChange={e => setCorBanner(e.target.value)} />
            </div>
            <label><input type="checkbox" checked={noCarrossel} onChange={e => setNoCarrossel(e.target.checked)} /> Carrossel Home</label>
            <button onClick={salvarProduto} style={btnStyle}>{prodId ? "Atualizar" : "Criar"}</button>
            {prodId && <button onClick={limparProd} style={{ ...btnStyle, background: '#ccc' }}>Cancelar</button>}
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3>{catId ? "Editar" : "Nova"} Coleção</h3>
            <input placeholder="Nome da Coleção" value={nomeCat} onChange={e => setNomeCat(e.target.value)} style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              Cor 1: <input type="color" value={cor1} onChange={e => setCor1(e.target.value)} />
              Cor 2: <input type="color" value={cor2} onChange={e => setCor2(e.target.value)} />
            </div>
            <label><input type="checkbox" checked={naHome} onChange={e => setNaHome(e.target.checked)} /> Fixar na Home</label>
            <button onClick={salvarCategoria} style={btnStyle}>{catId ? "Atualizar" : "Criar"}</button>
          </div>
        </div>

        {/* COLUNA 2: LISTA PRODUTOS */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '20px' }}>
          <h3>Produtos Cadastrados</h3>
          {produtos.map(p => (
            <div key={p.objectId} style={itemStyle}>
              <img src={p.img} style={{ width: '40px', height: '40px', borderRadius: '5px' }} />
              <div style={{ flex: 1, marginLeft: '10px' }}>
                <div style={{ fontWeight: 'bold' }}>{p.nome}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{p.categoria}</div>
              </div>
              <button onClick={() => editarProduto(p)} style={editBtn}>✎</button>
              <button onClick={() => excluir("Produto", p.objectId)} style={delBtn}>✕</button>
            </div>
          ))}
        </div>

        {/* COLUNA 3: LISTA COLEÇÕES */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '20px' }}>
          <h3>Coleções Cadastradas</h3>
          {categorias.map(c => (
            <div key={c.objectId} style={itemStyle}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `linear-gradient(${c.cor1}, ${c.cor2})` }}></div>
              <div style={{ flex: 1, marginLeft: '10px' }}>{c.nome} {c.naHome && "⭐"}</div>
              <button onClick={() => editarCategoria(c)} style={editBtn}>✎</button>
              <button onClick={() => excluir("Categoria", c.objectId)} style={delBtn}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '12px', background: '#2D2D1A', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '10px' };
const itemStyle = { display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' };
const editBtn = { background: '#e3f2fd', border: 'none', padding: '5px 10px', borderRadius: '5px', color: '#1976d2', cursor: 'pointer', marginRight: '5px' };
const delBtn = { background: '#ffebee', border: 'none', padding: '5px 10px', borderRadius: '5px', color: '#d32f2f', cursor: 'pointer' };