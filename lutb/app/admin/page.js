"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [banners, setBanners] = useState([]);

  // Estados Produto
  const [pNome, setPNome] = useState("");
  const [pPreco, setPPreco] = useState("");
  const [pImg, setPImg] = useState("");
  const [pCat, setPCat] = useState("");

  // Estados Categoria
  const [cNome, setCNome] = useState("");
  const [cCor1, setCCor1] = useState("#987317");
  const [cCor2, setCCor2] = useState("#cebb4b");
  const [cHome, setCHome] = useState(false);

  // Estados Banner
  const [bProdId, setBProdId] = useState("");
  const [bCor, setBCor] = useState("#E63946");

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
    "Content-Type": "application/json",
  };

  useEffect(() => { carregarTudo(); }, []);

  const carregarTudo = async () => {
    const resP = await fetch("https://parseapi.back4app.com/classes/Produto", { headers });
    const dataP = await resP.json(); setProdutos(dataP.results || []);

    const resC = await fetch("https://parseapi.back4app.com/classes/Categoria", { headers });
    const dataC = await resC.json(); setCategorias(dataC.results || []);

    const resB = await fetch("https://parseapi.back4app.com/classes/Carrossel", { headers });
    const dataB = await resB.json(); setBanners(dataB.results || []);
  };

  const addProduto = async () => {
    await fetch("https://parseapi.back4app.com/classes/Produto", {
      method: "POST", headers, body: JSON.stringify({ nome: pNome, preco: pPreco, img: pImg, categoria: pCat })
    });
    setPNome(""); carregarTudo();
  };

  const addCategoria = async () => {
    await fetch("https://parseapi.back4app.com/classes/Categoria", {
      method: "POST", headers, body: JSON.stringify({ nome: cNome, cor1: cCor1, cor2: cCor2, naHome: cHome })
    });
    setCNome(""); carregarTudo();
  };

  const addBanner = async () => {
    const prod = produtos.find(p => p.objectId === bProdId);
    await fetch("https://parseapi.back4app.com/classes/Carrossel", {
      method: "POST", headers, body: JSON.stringify({ prodId: bProdId, img: prod.img, cor: bCor, link: `/produto/${bProdId}` })
    });
    carregarTudo();
  };

  const remover = async (classe, id) => {
    await fetch(`https://parseapi.back4app.com/classes/${classe}/${id}`, { method: "DELETE", headers });
    carregarTudo();
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Painel de Controle Lut.B</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* PRODUTOS */}
        <section style={{ background: 'white', padding: '15px', borderRadius: '15px' }}>
          <h3>Novo Produto</h3>
          <input placeholder="Nome" value={pNome} onChange={e => setPNome(e.target.value)} style={inputStyle} />
          <input placeholder="Preço" value={pPreco} onChange={e => setPPreco(e.target.value)} style={inputStyle} />
          <input placeholder="URL Imagem" value={pImg} onChange={e => setPImg(e.target.value)} style={inputStyle} />
          <select value={pCat} onChange={e => setPCat(e.target.value)} style={inputStyle}>
            <option value="">Selecionar Categoria</option>
            {categorias.map(c => <option key={c.objectId} value={c.nome}>{c.nome}</option>)}
          </select>
          <button onClick={addProduto} style={btnStyle}>Criar Produto</button>
        </section>

        {/* CATEGORIAS */}
        <section style={{ background: 'white', padding: '15px', borderRadius: '15px' }}>
          <h3>Nova Categoria / Coleção</h3>
          <input placeholder="Nome" value={cNome} onChange={e => setCNome(e.target.value)} style={inputStyle} />
          Cor 1: <input type="color" value={cCor1} onChange={e => setCCor1(e.target.value)} />
          Cor 2: <input type="color" value={cCor2} onChange={e => setCCor2(e.target.value)} />
          <label style={{ display: 'block', marginTop: '5px' }}>
            <input type="checkbox" checked={cHome} onChange={e => setCHome(e.target.checked)} /> Fixar na Home
          </label>
          <button onClick={addCategoria} style={btnStyle}>Criar Categoria</button>
        </section>

        {/* BANNERS */}
        <section style={{ background: 'white', padding: '15px', borderRadius: '15px' }}>
          <h3>Novo Banner no Carrossel</h3>
          <select value={bProdId} onChange={e => setBProdId(e.target.value)} style={inputStyle}>
            <option value="">Escolher Produto</option>
            {produtos.map(p => <option key={p.objectId} value={p.objectId}>{p.nome}</option>)}
          </select>
          Cor Fundo Banner: <input type="color" value={bCor} onChange={e => setBCor(e.target.value)} />
          <button onClick={addBanner} style={btnStyle}>Adicionar ao Carrossel</button>
        </section>

        {/* LISTAGEM PARA REMOVER */}
        <section style={{ background: 'white', padding: '15px', borderRadius: '15px' }}>
          <h3>Itens Ativos (Clique para remover)</h3>
          <p><b>Categorias:</b> {categorias.map(c => <button key={c.objectId} onClick={() => remover("Categoria", c.objectId)} style={tagStyle}>{c.nome} x</button>)}</p>
          <p><b>Banners:</b> {banners.map(b => <button key={b.objectId} onClick={() => remover("Carrossel", b.objectId)} style={tagStyle}>Banner {b.objectId.slice(0,3)} x</button>)}</p>
        </section>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' };
const btnStyle = { background: '#333', color: 'white', border: 'none', padding: '10px', width: '100%', borderRadius: '5px', cursor: 'pointer' };
const tagStyle = { margin: '2px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' };