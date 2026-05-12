"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [carrossel, setCarrossel] = useState([]);
  const [colecoesHome, setColecoesHome] = useState([]);

  const headers = {
    "X-Parse-Application-Id": "YiHW7CkrLOQwTbVFzuSWCopoensMUgLXTzhiEROz",
    "X-Parse-REST-API-Key": "OaBOq7zWF7Fc8GNcyprMmqu2m1LA75tGwvUDWm6a",
  };

  useEffect(() => {
    // Busca produtos do carrossel
    fetch('https://parseapi.back4app.com/classes/Produto?where={"fixarNoCarrossel":true}', { headers })
      .then(res => res.json()).then(data => setCarrossel(data.results || []));

    // Busca coleções marcadas para aparecer na home (limite de 2)
    fetch('https://parseapi.back4app.com/classes/Categoria?where={"exibirNaHome":true}&limit=2', { headers })
      .then(res => res.json()).then(data => setColecoesHome(data.results || []));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {/* CARROSSEL DINÂMICO */}
      <div style={{ background: '#333', height: '200px', borderRadius: '20px', display: 'flex', overflow: 'hidden' }}>
        {carrossel.map(item => (
          <Link key={item.objectId} href={`/produto/${item.objectId}`} style={{ flex: 1, textAlign: 'center', color: 'white' }}>
            <img src={item.imagemUrl} style={{ height: '150px' }} />
            <p>{item.nome}</p>
          </Link>
        ))}
      </div>

      {/* COLEÇÕES DINÂMICAS (0 A 2) */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {colecoesHome.map(col => (
          <Link key={col.objectId} href={`/colecao/${col.objectId}`} style={{ 
            flex: 1, height: '150px', background: '#ccc', borderRadius: '15px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
          }}>
            <h3>{col.nome}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}