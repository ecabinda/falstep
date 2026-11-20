import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export function DropsPage({ onSelectProduct }) {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, mins: 28, secs: 45 });
  const [vipEmail, setVipEmail] = useState("");
  const [vipSuccess, setVipSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (vipEmail) {
      setVipSuccess(true);
      setTimeout(() => setVipSuccess(false), 5000);
      setVipEmail("");
    }
  };

  const DROP_GARMENTS = [
    {
      id: "drop07-espresso",
      title: "DROP 07: OVERSIZED ESPRESSO HOODIE",
      price: 95.0,
      size: "L",
      color: "ESPRESSO BROWN",
      gsm: "550 GSM",
      units: "150 UNITS WORLDWIDE",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeCFHnYvLQwrQ0F-NEsXdgMnxTQ183xrlSFo8LBQPiINd-CQ-y2JpwZUpmXbUwbbG7Wxe1-mPJY_fpErizTvXhhMg2x2pT--1L_f3NyEBPhc6x1_zTm1aWDQlAdwrGqFnUJLIlFm-mNhmAigmCMFqgHcM_oilbRuZ_yW45f0UxIYa4hH4HoT2bnZgQ3prm8xRNXIAbf1q-AkGUggsRysmkqpPX412r1WrHf7CnFcc"
    },
    {
      id: "drop07-terrain-black",
      title: "DROP 07: RAW TERRAIN NOIR CREWNECK",
      price: 85.0,
      size: "L",
      color: "TERRAIN NOIR",
      gsm: "480 GSM",
      units: "120 UNITS WORLDWIDE",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCosOao_nyTugUorZ7q46hVGS7gl78RiP-iEV0V4YIHxKLgV66tYGZhFUhWtGXEBHjkuql-51hufV-8g6-U4LS61nkJ9XaTYvn6GP6moWoUGbMGNhgHs11k1SQOKsQcavQTpjBDghtucyoxDqBlcKYuEO__yKCOMTR_RLoBSXawb-oBeykZCQaTDfFq7OsbUUvV5PBP_XI0A3aaGJQfM767WMG-tvk8YsVd7L9EqZE"
    },
    {
      id: "drop07-tactical-pant",
      title: "DROP 07: ARCHITECTURAL CARPENTER PANT",
      price: 140.0,
      size: "32",
      color: "RAW OBSIDIAN",
      gsm: "14 OZ RAW COTTON",
      units: "80 UNITS WORLDWIDE",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#fbfbfb]">
      {/* HERO DROPS MATRIX */}
      <section className="border-b border-[#252525] relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)]">
          
          {/* Main Visual Lookbook Banner (8 Cols) */}
          <div className="lg:col-span-8 relative border-b lg:border-b-0 lg:border-r border-[#252525] bg-[#141414] min-h-[500px] lg:min-h-full flex flex-col justify-between p-6 lg:p-12 overflow-hidden group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCosOao_nyTugUorZ7q46hVGS7gl78RiP-iEV0V4YIHxKLgV66tYGZhFUhWtGXEBHjkuql-51hufV-8g6-U4LS61nkJ9XaTYvn6GP6moWoUGbMGNhgHs11k1SQOKsQcavQTpjBDghtucyoxDqBlcKYuEO__yKCOMTR_RLoBSXawb-oBeykZCQaTDfFq7OsbUUvV5PBP_XI0A3aaGJQfM767WMG-tvk8YsVd7L9EqZE"
              alt="Falstep Drops Editorial"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                DROP ARCHIVE // LIVE PROTOCOL
              </span>
            </div>

            {/* Bottom Hero Info */}
            <div className="relative z-10 mt-auto pt-48 max-w-2xl">
              <span className="text-xs font-mono font-bold tracking-widest text-[#a8a39d] uppercase">
                AUTUMN / WINTER 2025 CAPSULE
              </span>
              <h1 className="font-['Anton'] text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-white leading-none mt-2">
                DROP 07: TERRAIN &amp; SHADOW
              </h1>
              <p className="text-sm sm:text-base text-[#cfcac4] mt-3 leading-relaxed max-w-xl font-normal">
                Heavyweight Portuguese milled textiles sculpted with raw brutalist proportions.
                No synthetics, zero restocks. Each numbered garment engineered for generational permanence.
              </p>
            </div>
          </div>

          {/* Right Action & Countdown Matrix (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 lg:p-12 bg-[#121212]">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#252525] pb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a8a39d]">
                  RELEASE STATUS
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  • ALLOCATED (350 PCS)
                </span>
              </div>

              {/* Countdown Timer */}
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#a8a39d] mb-2">
                  TEMPO RESTANTE PARA LIBERAÇÃO PÚBLICA:
                </p>
                <div className="grid grid-cols-4 gap-2 text-center font-['Anton']">
                  <div className="bg-[#181818] border border-[#2b2b2b] p-3">
                    <span className="text-2xl sm:text-3xl text-white block">0{timeLeft.days}</span>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">DIAS</span>
                  </div>
                  <div className="bg-[#181818] border border-[#2b2b2b] p-3">
                    <span className="text-2xl sm:text-3xl text-white block">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">HORAS</span>
                  </div>
                  <div className="bg-[#181818] border border-[#2b2b2b] p-3">
                    <span className="text-2xl sm:text-3xl text-white block">{String(timeLeft.mins).padStart(2, '0')}</span>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">MIN</span>
                  </div>
                  <div className="bg-[#181818] border border-[#2b2b2b] p-3">
                    <span className="text-2xl sm:text-3xl text-white block">{String(timeLeft.secs).padStart(2, '0')}</span>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">SEG</span>
                  </div>
                </div>
              </div>

              {/* Technical Fabrication Specs */}
              <div className="space-y-3 pt-6 border-t border-[#252525] text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-[#202020]">
                  <span className="text-neutral-400">FABRICAÇÃO:</span>
                  <span className="text-white font-bold">550 GSM ALGODÃO PORTO</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#202020]">
                  <span className="text-neutral-400">COLORWAY:</span>
                  <span className="text-white font-bold">ESPRESSO / OBSIDIAN</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#202020]">
                  <span className="text-neutral-400">DISTRIBUIÇÃO:</span>
                  <span className="text-white font-bold">DESPACHO EM 24H DHL</span>
                </div>
              </div>

              {/* Quick Add Featured Drop Item */}
              <div className="pt-4">
                <button
                  onClick={() => addToCart(DROP_GARMENTS[0], "L")}
                  className="w-full py-4 bg-white hover:bg-[#f3efe8] text-[#0e0e0e] font-['Anton'] uppercase tracking-wider text-sm transition flex items-center justify-center gap-2 font-bold shadow-xl"
                >
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  <span>RESERVAR PEÇA DROP 07 (€95.00)</span>
                </button>
              </div>

            </div>

            {/* VIP Pass Form */}
            <div className="pt-8 mt-8 border-t border-[#252525]">
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#a8a39d] uppercase block mb-2">
                VIP PROTOCOL: ACESSO 15 MIN ANTECIPADO
              </span>
              <form onSubmit={handleVipSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={vipEmail}
                  onChange={(e) => setVipEmail(e.target.value)}
                  placeholder="SEU E-MAIL PARA CHAVE VIP"
                  className="flex-1 bg-[#1a1a1a] border border-[#333] px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#252525] hover:bg-white hover:text-black text-white font-mono text-xs uppercase font-bold transition"
                >
                  Entrar
                </button>
              </form>
              {vipSuccess && (
                <p className="text-xs font-mono text-emerald-400 mt-2 font-bold">
                  ✓ ACESSO VIP CONFIRMADO! Chave enviada para sua caixa de entrada.
                </p>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* DROP 07 CAPSULE PIECES GRID */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-12 py-16">
        <div className="flex items-end justify-between border-b border-[#252525] pb-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-[#a8a39d] uppercase tracking-widest">
              LIMITED RUNS // DROP 07
            </span>
            <h2 className="font-['Anton'] text-3xl uppercase tracking-wider text-white mt-1">
              PEÇAS DISPONÍVEIS DA CÁPSULA
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            ESTOQUE RIGOROSAMENTE LIMITADO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DROP_GARMENTS.map((item) => (
            <div key={item.id} className="border border-[#252525] bg-[#141414] flex flex-col justify-between group hover:border-white transition-all duration-200">
              <div>
                <div className="aspect-[4/5] bg-neutral-900 overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-white/20 text-white font-mono text-[10px] px-2.5 py-1 uppercase tracking-widest font-bold">
                    {item.gsm}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">{item.units}</span>
                  <h3 className="font-['Anton'] text-lg uppercase text-white mt-1 leading-tight">{item.title}</h3>
                  <p className="text-sm font-mono font-bold text-white mt-2">€{item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => addToCart(item, item.size)}
                  className="w-full py-3 bg-[#252525] hover:bg-white hover:text-black text-white font-['Anton'] text-xs uppercase tracking-wider transition font-bold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                  <span>ADICIONAR À SACOLA ({item.size})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
