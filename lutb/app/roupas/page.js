"use client";

export default function Roupas() {
  return (
    <div style={{ 
      backgroundColor: '#76BA5B', 
      minHeight: '100vh', 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '10px 20px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        width: '100%',
        maxWidth: '320px',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        Roupas
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '15px', 
        padding: '20px', 
        width: '100%',
        maxWidth: '320px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Categoria sem itens no momento
        </p>
        <img 
          src="/categoria-vazia.png" 
          alt="Categoria vazia" 
          style={{ width: '80px', opacity: 0.3, margin: '0 auto' }} 
        />
      </div>
    </div>
  );
}