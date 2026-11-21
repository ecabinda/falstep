import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export function Header({ activePage, setActivePage }) {
  const { totalCount, openCart } = useCart();
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = activePage === "home";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On homepage when not scrolled: floating transparent with frosted glass pills over video
  const isTransparent = isHome && !isScrolled;

  const handleAccountClick = () => {
    if (!user) {
      openAuthModal();
    } else if (isAdmin) {
      // Administrator always goes directly to the full Admin Console
      setActivePage("admin");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Normal customer goes to their account page
      setActivePage("account");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent py-3"
          : "bg-white/95 backdrop-blur-md border-b border-[#20151115] shadow-sm py-2"
      }`}
    >
      <div className="relative flex items-center justify-between px-4 md:px-12 max-w-[1600px] mx-auto h-14">
        {/* Logo with Frosted Effect */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`transition-all duration-200 active:scale-95 font-['Anton'] text-2xl tracking-wider uppercase flex items-center gap-2 ${
              isTransparent
                ? "px-3.5 py-1.5 bg-black/45 backdrop-blur-md border border-white/25 rounded-md text-white hover:bg-black/65 hover:border-white/50 shadow-xl"
                : "text-[#201511] hover:opacity-80"
            }`}
          >
            <span>FALSTEP</span>
          </button>
        </div>

        {/* Centered Desktop Navigation with Distinct Pill Capsule */}
        <nav className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-3">
          <button
            onClick={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`transition-all duration-200 active:scale-95 text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${
              isTransparent
                ? "px-5 py-2 bg-black/50 backdrop-blur-md border border-white/25 hover:border-white/60 hover:bg-black/75 rounded-full text-white shadow-xl btn-shimmer"
                : `pb-1 relative group ${
                    activePage === "catalog"
                      ? "text-[#201511]"
                      : "text-[#4e4541] hover:text-[#201511]"
                  }`
            }`}
          >
            {isTransparent && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span>COLLECTIONS</span>
            {!isTransparent && (
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#201511] transition-transform duration-300 origin-left ${
                  activePage === "catalog"
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            )}
          </button>


        </nav>

        {/* Right Action Cluster: Currency, Login/Account, Bag */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`text-[11px] font-mono uppercase hidden lg:inline-flex ${
              isTransparent
                ? "px-2.5 py-1.5 bg-black/45 backdrop-blur-md border border-white/25 rounded text-[#e5ded8] shadow-lg"
                : "text-[#4e4541]"
            }`}
          >
            EUR €
          </span>

          {/* Admin Direct Button (Prominent when admin is logged in) */}
          {isAdmin && (
            <button
              onClick={() => {
                setActivePage("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-['Anton'] uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md ${
                activePage === "admin"
                  ? "bg-amber-400 text-black border border-amber-300 ring-2 ring-amber-400/50"
                  : isTransparent
                  ? "bg-amber-400 text-black hover:bg-amber-300 border border-amber-300"
                  : "bg-amber-500 text-black hover:bg-amber-400 border border-amber-400"
              }`}
              title="Abrir Painel Administrativo"
            >
              <span className="material-symbols-outlined text-[16px]">shield_person</span>
              <span>PAINEL ADMIN</span>
            </button>
          )}

          {/* User Account / Login Button */}
          <button
            onClick={handleAccountClick}
            className={`relative flex items-center gap-1.5 transition-all duration-200 active:scale-95 text-xs font-bold uppercase tracking-wider ${
              isTransparent
                ? `px-3.5 py-1.5 backdrop-blur-md border rounded-md shadow-xl ${
                    user
                      ? "bg-black/50 border-white/25 text-white hover:bg-black/70 hover:border-white/50"
                      : "bg-black/50 border-white/25 text-white hover:bg-white hover:text-black"
                  }`
                : `px-3 py-1.5 border rounded shadow-sm ${
                    user
                      ? "border-[#20151125] hover:border-[#201511] bg-white text-[#201511]"
                      : "border-[#20151125] hover:border-[#201511] bg-white text-[#201511]"
                  } ${activePage === "account" ? "border-[#201511] font-black" : ""}`
            }`}
            title={user ? "Minha Conta" : "Entrar / Criar Conta"}
          >
            <span className="material-symbols-outlined text-[17px]">
              {user ? "account_circle" : "person"}
            </span>
            <span className="hidden sm:inline font-mono">
              {user ? (user.name ? user.name.split(" ")[0] : "Conta") : "Entrar"}
            </span>
          </button>

          {/* Quick Logout Button (Visible only when logged in) */}
          {user && (
            <button
              onClick={() => {
                logout();
                setActivePage("home");
              }}
              className={`p-1.5 transition-all duration-200 active:scale-95 rounded flex items-center justify-center ${
                isTransparent
                  ? "bg-black/50 hover:bg-red-600 text-white/80 hover:text-white border border-white/25 hover:border-red-500 shadow-md"
                  : "border border-[#20151120] hover:border-red-600 bg-white hover:bg-red-50 text-[#75584a] hover:text-red-700 shadow-sm"
              }`}
              title="Terminar Sessão"
              aria-label="Terminar Sessão"
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
            </button>
          )}

          {/* Shopping Bag Button */}
          <button
            onClick={openCart}
            className={`relative flex items-center gap-2 transition-all duration-200 active:scale-95 ${
              isTransparent
                ? "px-4 py-1.5 bg-black/50 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/25 hover:border-white rounded-md shadow-xl btn-shimmer"
                : "px-3 py-1.5 border border-[#20151125] hover:border-[#201511] bg-white text-[#201511] shadow-sm hover:shadow"
            }`}
            aria-label="Abrir Sacola"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
              Bag
            </span>
            <span
              key={totalCount}
              className={`ml-1 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-sm ${
                isTransparent
                  ? "bg-white text-black shadow"
                  : "bg-[#201511] text-[#f3efe8]"
              } ${totalCount > 0 ? "animate-cart-pop" : ""}`}
            >
              {totalCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
