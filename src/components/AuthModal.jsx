import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthModal({ onLoginSuccess }) {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const loggedUser = await login(email, password);
        if (onLoginSuccess) onLoginSuccess(loggedUser);
      } else {
        const newUser = await register(name, email, password);
        if (onLoginSuccess) onLoginSuccess(newUser);
      }
    } catch (err) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setError("");
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    try {
      const loggedUser = await login(demoEmail, demoPass);
      if (onLoginSuccess) onLoginSuccess(loggedUser);
    } catch (err) {
      setError(err.message || "Erro no login de teste.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-[fadeIn_0.2s_ease-out]"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#161413] text-[#f3efe8] border border-white/20 shadow-2xl p-6 md:p-8 z-10 animate-[scaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white transition rounded hover:bg-white/10"
          aria-label="Fechar"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Brand Header */}
        <div className="text-center pb-6 border-b border-white/10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#a89b91] block mb-1">
            FALSTEP ARCHIVE ID
          </span>
          <h2 className="font-['Anton'] text-3xl uppercase tracking-wider text-white">
            {mode === "login" ? "ÁREA DE CLIENTE" : "CRIAR CONTA"}
          </h2>
          <p className="text-xs text-[#a89b91] font-mono mt-1">
            {mode === "login"
              ? "Guarde e consulte as suas compras em qualquer dispositivo."
              : "Registe-se para rastrear encomendas e ter acesso a lançamentos exclusivos."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border border-white/15 my-6 bg-black/40 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-['Anton'] uppercase tracking-wider transition ${
              mode === "login"
                ? "bg-white text-black shadow"
                : "text-white/70 hover:text-white"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-['Anton'] uppercase tracking-wider transition ${
              mode === "register"
                ? "bg-white text-black shadow"
                : "text-white/70 hover:text-white"
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-red-400">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#a89b91] mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Edilson Cabinda"
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition font-mono placeholder:text-white/30"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#a89b91] mb-1">
              Endereço de E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition font-mono placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#a89b91] mb-1">
              Senha de Acesso
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition font-mono placeholder:text-white/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black font-['Anton'] uppercase text-sm tracking-widest hover:bg-[#f3efe8] transition-all duration-200 active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{mode === "login" ? "INICIAR SESSÃO &rarr;" : "CRIAR MINHA CONTA &rarr;"}</span>
            )}
          </button>
        </form>

        {/* Quick Access Credentials */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <span className="text-white/40 uppercase">Acesso Rápido:</span>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => handleQuickDemo("edilson@falstep.com", "1234")}
              className="text-[#f3efe8] hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded transition font-bold"
              title="Preencher com a conta Edilson"
            >
              Edilson (1234)
            </button>
            <span className="text-white/20">&bull;</span>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin@falstep.com", "admin")}
              className="text-[#f3efe8] hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded transition font-bold"
              title="Preencher com a conta Administrador"
            >
              Admin (admin)
            </button>
          </div>
        </div>

        {/* Security & Multi-Device Access Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 text-white/50 text-[11px] font-mono">
            <span className="material-symbols-outlined text-sm text-[#00E5FF]">verified_user</span>
            <span>ACESSO SEGURO &bull; MULTI-DISPOSITIVO SINCRONIZADO</span>
          </div>
          <p className="text-[10px] text-white/40 font-mono mt-1">
            As suas compras e dados de envio ficam guardados e protegidos na sua conta.
          </p>
        </div>
      </div>
    </div>
  );
}
