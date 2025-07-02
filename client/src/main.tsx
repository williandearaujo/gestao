// [main.tsx] – Entrada do app com Clerk e variável de ambiente
console.log("Chave Clerk carregada:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={publishableKey}>
    <App />
  </ClerkProvider>
);
