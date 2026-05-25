"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ColecaoDinamica() {
  const { id } = useParams();
  const [colecao, setColecao] = useState(null);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const { data: col } = await supabase.from("Colecao").select("*").eq("id", id).single();
      setColecao(col);
      const { data: vinculos } = await supabase.from("produto_colecao").select("produto_id").eq("colecao_id", id);
      const ids = (vinculos || []).map(v => v.produto_id);
      if (ids.length === 0) return;
      const { data } = await supabase.from("Produto").select("*").in("id", ids);
      setProdutos(data || []);
    };
    carregar();
  }, [id]);

  return (
    <div style={{ backgroundColor: '#76BA5B', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '15px 30px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#2D2D1A' }}>{colecao?.nome || "Coleção"}</h1>
        </div>
      </div>
      {produtos.length === 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#555' }}>Nenhum produto nessa coleção ainda.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {produtos.map((p) => (
            <Link href={`/produto/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <img src={p.img || "/logo(lutb).png"} alt={p.nome} style={{ width: '180px', marginBottom: '15px' }} />
                <h2 style={{ fontSize: '22px', margin: '0 0 10px 0', color: '#333' }}>{p.nome}</h2>
                <p style={{ fontSize: '14px', textAlign: 'center', color: '#555', lineHeight: '1.4' }}>{p.descricao || ""}</p>
                <p style={{ fontWeight: 'bold', color: '#2D2D1A', marginTop: '8px' }}>{p.preco ? `R$ ${p.preco}` : "Preço indisponível"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}