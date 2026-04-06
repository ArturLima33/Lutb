export default function Catalogo() {
  const produtos = [
    { id: "musgo", nome: "Colar Musgo", descricao: "Inspirado na natureza" },
    { id: "bolhas", nome: "Colar Bolhas", descricao: "Leve e elegante" },
  ];

  return (
    <div>
      <h1>Catálogo</h1>

      {produtos.map((p) => (
        <div key={p.id}>
          <a href={`/produto/${p.id}`}>
            <h2>{p.nome}</h2>
          </a>
          <p>{p.descricao}</p>
        </div>
      ))}

      <br />

      <a href="/">
        <button>Voltar para Home</button>
      </a>
    </div>
  );
}