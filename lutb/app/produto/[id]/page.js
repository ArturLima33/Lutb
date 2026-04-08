"use client";
import { useRouter } from "next/navigation";

export default function TelaCompra() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/seta-voltar.png" style={{ width: '70px' }} />
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '40px', padding: '40px', width: '85%', marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/colar-bolhas.png" style={{ width: '100%', maxWidth: '250px' }} />
        <h2 style={{ marginTop: '20px', color: '#333' }}>Colar Bolhas</h2>
      </div>

      <div style={{ background: 'linear-gradient(180deg, #9ACD32 0%, #228B22 100%)', width: '90%', borderRadius: '20px', padding: '20px', marginTop: '30px', textAlign: 'center' }}>
        <span style={{ fontSize: '32px', fontWeight: 'bold' }}>R$ 25,00</span>
      </div>
    </div>
  );
}