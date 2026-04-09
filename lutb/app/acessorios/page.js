"use client";

const produtos = [
  {
    id: 1,
    nome: "Moranguito",
    descricao: "Este é o colar Moranguito, feito à mão com pedras naturais e cordão preto. Ideal para o verão. Sugestão: o colar pode trazer leveza ao look e valorizar uma produção mais despojada. Use para ocasiões de dia ou eventos ao ar livre.",
    img: "/moranguito.png",
  },
  {
    id: 2,
    nome: "Tesouro Tropical",
    descricao: "Este é o colar Tesouro Tropical, feito com pedras vermelhas e cordão preto de couro, perfeito para dias de festa. Sugestão: ideal para looks que desejam um toque mais vibrante, combina bem com tons neutros e verde escuro.",
    img: "/tesouro-tropical.png",
  },
  {
    id: 3,
    nome: "Colar Bolhas",
    descricao: "Este é o Colar Bolhas, feito com cordão preto de algodão e pingentes delicados, ideal para usar no dia a dia. Sugestão: combina com looks casuais e também com visuais minimalistas.",
    img: "/colar-bolhas.png",
  },
  {
    id: 4,
    nome: "Colar Musgo",
    descricao: "Este é o Colar Musgo, feito com pedras naturais e cordão marrom, ideal para ocasiões especiais. Sugestão: harmoniza com visuais terrosos e eventos ao ar livre.",
    img: "/colar-musgo.png",
  },
  {
    id: 5,
    nome: "Novo Colar",
    descricao: "Novo colar elegante feito com design moderno e materiais sustentáveis. Sugestão: perfeito para eventos formais e uso diário com estilo.",
    img: "/novo-colar.png",
  },
];

export default function Acessorios() {
  return (
    <div style={{
      backgroundColor: '#76BA5B',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '25px',
        padding: '25px 40px',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: '600',
        fontFamily: 'serif',
        color: '#2D2D1A',
      }}>
        Acessórios
      </div>

      <div style={{
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
      }}>
        {produtos.map(produto => (
          <div key={produto.id} style={{
            backgroundColor: 'white',
            borderRadius: '25px',
            padding: '25px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            display: 'flex',
            gap: '25px',
            alignItems: 'center',
            fontFamily: 'serif',
          }}>
            <img
              src={produto.img}
              alt={produto.nome}
              style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '15px' }}
            />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h3 style={{ color: '#E63946', fontSize: '22px', margin: '0 0 10px 0' }}>
                {produto.nome}
              </h3>
              <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.4' }}>
                {produto.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}