"use client";

export default function Roupas() {
  return (
    <div style={{ 
      backgroundColor: '#76BA5B', 
      minHeight: '100vh', 
      padding: '40px 20px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '25px', 
        padding: '25px 40px', 
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center', 
        boxShadow: '0 6px 18px rgba(0,0,0,0.15)', 
        marginBottom: '30px',
        fontSize: '28px', 
        fontWeight: '600',
        fontFamily: 'serif',
        color: '#2D2D1A'
      }}>
        Roupas
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '25px', 
        padding: '40px 30px', 
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center',
        boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
      }}>
        <p style={{ 
          fontSize: '22px', 
          marginBottom: '40px', 
          color: '#333', 
          lineHeight: '1.5',
          fontFamily: 'serif',
          fontWeight: '500'
        }}>
          Categoria sem itens no momento
        </p>
        <img 
          src="/categoria-vazia.png" 
          alt="Categoria vazia" 
          style={{ width: '120px', opacity: 0.3, margin: '0 auto' }} 
        />
      </div>
    </div>
  );
}