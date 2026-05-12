"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [banners, setBanners] = useState([]);
  
  // States para novos itens
  const [pNome, setPNome] = useState("");
  const [pImg, setPImg] = useState("");
  const [cNome, setCNome] = useState("");
  const [cCor1, setCCor1] = useState("#987317");
  const [cCor2, setCCor2] = useState("#cebb4b");
  const [cHome, setCHome] = useState(false);
  const [bCor, setBCor] = useState("#FF8C00");
  const [bProdId, setBProdId] = useState("");

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
    "Content-Type": "application/json",
  };

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    const [resP, resC, resB] = await Promise.all([
      fetch("https://parseapi.back4app.com/classes/Produto", { headers }),
      fetch("https://parseapi.back4app.com/classes/Categoria", { headers }),
      fetch("https://parseapi.back4app.com/classes/Carrossel", { headers })
    ]);
    const dP = await resP.json(); setProdutos(dP.results || []);
    const dC = await resC.json(); setCategorias(dC.results || []);
    const dB = await resB.json(); setBanners(dB.results || []);
  };

  const criarProduto = async () => {
    await fetch("https://parseapi.back4app.com/classes/Produto", {
      method: "POST", headers, body: JSON.stringify({ nome: pNome, img: pImg })
    });
    setPNome(""); setPImg(""); carregarDados();
  };

  const criarCategoria = async () => {
    await fetch("https://parseapi.back4app.com/classes/Categoria", {
      method: "POST", headers, body: JSON.stringify({ nome: cNome, cor1: cCor1, cor2: cCor2, naHome: cHome })
    });
    setCNome(""); carregarDados();
  };

  const adicionarBanner = async () => {
    const p = produtos.find(x => x.objectId === bProdId);
    await fetch("https://parseapi.back4app.com/classes/Carrossel", {
      method: "POST", headers, body: JSON.stringify({ img: p.img, cor: bCor, link: `/produto/${p.objectId}` })
    });
    carregarDados();
  };

  const deletar = async (classe, id) => {
    await fetch(`https://parseapi.back4app.com/classes/${classe}/${id}`, { method: "DELETE", headers });
    carregarDados();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Painel Lut.B</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* PRODUTOS */}
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>Produtos</h3>
          <input placeholder="Nome" value={pNome} onChange={e=>setPNome(e.target.value)} />
          <input placeholder="URL Imagem" value={pImg} onChange={e=>setPImg(e.target.value)} />
          <button onClick={criarProduto}>Salvar</button>
          <ul>{produtos.map(p => <li key={p.objectId}>{p.nome} <button onClick={()=>deletar("Produto", p.objectId)}>x</button></li>)}</ul>
        </div>

        {/* CATEGORIAS */}
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>Categorias / Coleções</h3>
          <input placeholder="Nome" value={cNome} onChange={e=>setCNome(e.target.value)} />
          <input type="color" value={cCor1} onChange={e=>setCCor1(e.target.value)} />
          <input type="color" value={cCor2} onChange={e=>setCCor2(e.target.value)} />
          <label><input type="checkbox" checked={cHome} onChange={e=>setCHome(e.target.checked)} /> Fixar na Home</label>
          <button onClick={criarCategoria}>Criar</button>
        </div>

        {/* BANNERS */}
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>Banners Carrossel</h3>
          <select onChange={e=>setBProdId(e.target.value)}>
            <option>Selecione um produto</option>
            {produtos.map(p=><option key={p.objectId} value={p.objectId}>{p.nome}</option>)}
          </select>
          <input type="color" value={bCor} onChange={e=>setBCor(e.target.value)} />
          <button onClick={adicionarBanner}>Add Banner</button>
        </div>
      </div>
    </div>
  );
}