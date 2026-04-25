"use client";

import { Suspense } from "react";
import BuscaConteudo from "./BuscaConteudo";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "20px" }}>Carregando...</div>}>
      <BuscaConteudo />
    </Suspense>
  );
}