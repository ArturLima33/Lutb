"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function TodasCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [ordenacao, setOrdenacao] = useState("padrao");

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase.from("Categoria").select("*");
      setCategorias(data || []);
    };
    carregar();
  }, []);

  const categoriasOrdenadas = [...categorias].sort((a, b) => {
    const dataA = new Date(a.created_at || 0);
    const dataB = new Date(b.created_at || 0);
    
    if (ordenacao === "padrao" || ordenacao === "recentes") {
      return dataB - dataA;
    }
    if (ordenacao === "antigos") {
      return dataA - dataB;
    }
    return 0;
  });

  return (
    <div style={{ backgroundColor: '#76BA5B', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '10px 25px', width: 'fit-content', margin: '0 auto 20px auto' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#2D2D1A' }}>Todas as Categorias</h2>
      </div>

      {categorias.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ backgroundColor: "#2D2D2D", color: "white", border: "none", borderRadius: "14px", padding: "12px 24px", fontSize: "16px", cursor: "pointer", outline: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}
          >
            {/* Opção inicial idêntica à image_b8e299.png */}
            <option value="padrao">Ordenar por</option>
            <option value="recentes">Mais recentes</option>
            <option value="antigos">Mais antigos</option>
          </select>
        </div>
      )}

      {categorias.length === 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '40px', textAlign: 'center', width: '100%' }}>
          <p style={{ fontSize: '18px', color: '#555' }}>Nenhuma categoria cadastrada ainda.</p>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {categoriasOrdenadas.map((c) => (
            <Link href={`/categoria/${c.id}`} key={c.id} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '20px 25px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', minHeight: '60px' }}>
                <h3 style={{ fontSize: '22px', margin: 0, fontFamily: 'serif', color: '#2D2D1A', fontWeight: 'normal' }}>
                  {c.nome}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}