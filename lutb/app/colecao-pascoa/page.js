"use client";
import Link from "next/link";

export default function ColecaoPascoa() {
  const produtosPascoa = [
    { 
      id: 1, 
      nome: "Colar Bolhas", 
      desc: "Inspirado na pureza das águas, este colar traz detalhes que remetem à leveza da estação. Sugestão: Combina perfeitamente com looks em tons pastéis de domingo.",
      img: "/colar-bolhas.png" 
    },
    { 
      id: 2, 
      nome: "Colar Musgo", 
      desc: "Representando o renascimento da natureza, o Colar Musgo utiliza elementos orgânicos. Sugestão: Ideal para eventos ao ar livre e celebrações familiares.",
      img: "/colar-musgo.png" 
    }
  ];

  return (
    <div style={{ backgroundColor: '#76BA5B', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '15px 30px', display: 'inline-block', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#2D2D1A' }}>Coleção Páscoa 2026</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {produtosPascoa.map((p) => (
          <Link href={`/produto/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <img src={p.img} alt={p.nome} style={{ width: '180px', marginBottom: '15px' }} />
              <h2 style={{ fontSize: '22px', margin: '0 0 10px 0', color: '#333' }}>{p.nome}</h2>
              <p style={{ fontSize: '14px', textAlign: 'center', color: '#555', lineHeight: '1.4' }}>{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}