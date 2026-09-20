"use client";
import { useEffect } from "react";
import {
  CHAVE_LOCALSTORAGE,
  TEMA_PADRAO,
  getTemaById,
  aplicarTema,
} from "@/lib/temas";

export default function TemaProvider() {
  useEffect(() => {
    const id =
      localStorage.getItem(CHAVE_LOCALSTORAGE) || TEMA_PADRAO;
    const tema = getTemaById(id);
    aplicarTema(tema);
  }, []);

  return null;
}