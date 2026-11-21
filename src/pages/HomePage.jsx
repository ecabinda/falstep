import { getAssetPath } from "../utils/assets";
import React from "react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import { HeroVideoBackground } from "../components/HeroVideoBackground";
import { MarqueeTicker } from "../components/MarqueeTicker";
import { ScrollReveal } from "../components/ScrollReveal";
import { TiltCard } from "../components/TiltCard";

export function HomePage({ setActivePage, onSelectProduct, onCheckout, onBuyNow }) {
  const { products, storeSettings } = useProducts();
  const heroProduct = products[0] || {};
  const pinkProduct = products[1] || heroProduct;

  const heroBadge = storeSettings?.heroBadge || "DROP 07 // FEROZ SAVAGE CAPSULE";
  const heroTitle = storeSettings?.heroTitle || "FEROZ SAVAGE &\nDIAMOND DIET";
  const heroSubtitle = storeSettings?.heroSubtitle || "Classical sculpture reimagined through contemporary underground brutalism. Heavyweight 320 GSM boxy proportions sculpted from bespoke Portuguese milled textiles.";
  const heroCta1 = storeSettings?.heroCta1 || "EXPLORAR COLEÇÃO";
  const heroCta2 = storeSettings?.heroCta2 || "VER DETALHES (320 GSM)";
  const heroBgType = storeSettings?.heroBgType || "video";
  const heroBgImage = getAssetPath(storeSettings?.heroBgImage || "/images/products/hero_david_feroz_black.jpg");

  return (
    <div>
      {/* 1. FULL-BLEED EDITORIAL HERO VIDEO SECTION (Extends all the way behind header) */}
      <section className="relative w-full border-b border-[#20151115] bg-black overflow-hidden">
        <div className="relative w-full min-h-[750px] lg:min-h-[95vh] flex flex-col justify-end group">
          {heroBgType === "video" ? (
            <HeroVideoBackground totalFrames={190} fps={24} />
          ) : (
            <div className="absolute inset-0 bg-black overflow-hidden">
              <img
                src={heroBgImage}
                alt="Hero Background"
                className="w-full h-full object-cover object-center opacity-80 scale-105"
              />
            </div>
          )}

          {/* Luxury Scrim Overlay: transparent at top so video is vibrant under header, gradient at bottom for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 via-50% to-transparent pointer-events-none" />

          {/* Bottom Hero Content / Action Overlay */}
          <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 md:px-12 pb-14 pt-32">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#f3efe8] rounded-full animate-ping" />
                <span className="text-xs font-mono font-bold uppercase text-[#f3efe8] tracking-widest">
                  {heroBadge}
                </span>
              </div>
              <h1 className="font-['Anton'] text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-white leading-none drop-shadow-md whitespace-pre-line">
                {heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#e5ded8] pt-4 max-w-xl leading-relaxed drop-shadow">
                {heroSubtitle}
              </p>

              {/* CTAs with specular shimmer animation */}
              <div className="flex flex-col sm:flex-row gap-3 pt-8 max-w-md">
                <button
                  onClick={() => setActivePage("catalog")}
                  className="flex-1 py-4 px-6 bg-white hover:bg-[#f3efe8] text-[#201511] font-['Anton'] uppercase text-sm tracking-wider transition-all duration-200 active:scale-95 font-bold shadow-2xl btn-shimmer"
                >
                  {heroCta1}
                </button>
                <button
                  onClick={() => onSelectProduct(heroProduct)}
                  className="flex-1 py-4 px-6 bg-black/60 backdrop-blur-sm border border-white hover:bg-white hover:text-black text-white font-['Anton'] uppercase text-sm tracking-wider transition-all duration-200 active:scale-95 font-bold btn-shimmer"
                >
                  {heroCta2}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRUTALIST RUNNING MARQUEE TICKER */}
      <section className="bg-[#201511] text-[#f3efe8] border-b border-[#201511]">
        <MarqueeTicker speed="28s" />
      </section>

      {/* 3. EDITORIAL CAPSULE HIGHLIGHT WITH 3D TILT */}
      <section className="bg-[#f7f5f0] border-b border-[#20151115] py-20">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: 3D Tilt Diamond Diet Showcase */}
            <ScrollReveal direction="left" delay={100}>
              <TiltCard
                maxTilt={8}
                scale={1.01}
                className="group relative overflow-hidden bg-black aspect-[4/5] border border-[#20151115] cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div onClick={() => onSelectProduct(pinkProduct)} className="w-full h-full relative">
                  <img
                    src={getAssetPath("/images/products/hero_david_pink_diet.jpg")}
                    alt="DIAMOND DIET Editorial"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20 pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f3efe8]/80 block mb-1">
                      LIMITED RUN // 150 PIECES
                    </span>
                    <h3 className="font-['Anton'] text-2xl sm:text-4xl uppercase tracking-wider text-white">
                      DIAMOND DIET OVERSIZED TEE
                    </h3>
                    <p className="text-xs text-[#e5ded8] mt-1 font-mono">
                      "Keep The Calories, I'll Take Carats" &bull; 320 GSM Pigment Pink
                    </p>
                    <span className="inline-block mt-4 text-xs font-mono font-bold uppercase underline underline-offset-4 tracking-wider">
                      COMPRAR AGORA (€65.00) &rarr;
                    </span>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Right: Retro Dunk & Graphic Archive with ScrollReveal */}
            <ScrollReveal direction="right" delay={200} className="flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#75584a]">
                  FALSE STEP® ARCHIVE
                </span>
                <h2 className="font-['Anton'] text-3xl sm:text-5xl uppercase tracking-wider text-[#201511] mt-2 leading-tight">
                  AUTHENTIC STREETWEAR SCULPTING
                </h2>
                <p className="text-sm text-[#4e4541] mt-4 leading-relaxed max-w-xl">
                  Cada peça da coleção False Step é desenvolvida em oficinas têxteis no norte de Portugal, utilizando malhas orgânicas pesadas e lavagens enzimáticas que conferem um toque macio e caimento arquitetônico boxy impecável.
                </p>
              </div>

              {/* Ultra-Fluid Interactive Highlight Card (Zero Jitter, Pure Fluidity) */}
              <div
                onClick={() => onSelectProduct(products[2] || heroProduct)}
                className="group relative cursor-pointer bg-white border border-[#20151120] hover:border-[#201511] p-6 transition-all duration-300 ease-out hover:shadow-xl shadow-sm rounded-sm flex items-center justify-between gap-6 overflow-hidden"
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-24 h-24 bg-[#fbf9f5] flex-shrink-0 overflow-hidden border border-[#20151115] flex items-center justify-center rounded-sm">
                    <img
                      src={getAssetPath("/images/products/tee_dunk_white.png")}
                      alt="Retro Dunk Tee"
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#75584a] animate-pulse" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#75584a]">
                        CORE GRAPHIC // ARCHIVE
                      </span>
                    </div>
                    <h4 className="font-[Anton] text-xl uppercase text-[#201511] group-hover:text-[#75584a] transition-colors truncate">
                      RETRO DUNK ARCHIVE TEE
                    </h4>
                    <p className="text-xs text-[#4e4541] font-mono mt-1">
                      Porsche 911 &bull; Slam Dunk &bull; Optic White (€60.00)
                    </p>
                  </div>
                </div>

                {/* Animated Action Pill */}
                <div className="flex-shrink-0 w-11 h-11 rounded-full border border-[#20151120] group-hover:border-[#201511] group-hover:bg-[#201511] text-[#201511] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-300">
                    arrow_forward
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActivePage("catalog")}
                  className="w-full py-4 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-widest transition-all active:scale-98 text-center shadow-lg btn-shimmer"
                >
                  VER TODO O CATÁLOGO ({products.length} MODELOS)
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. REVERSE INVERTED MARQUEE */}
      <section className="bg-[#f3efe8] text-[#201511] border-b border-[#20151115]">
        <MarqueeTicker speed="32s" reverse={true} />
      </section>

      {/* 5. CURATED ARCHIVE GRID WITH STAGGERED SCROLL REVEAL */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-12 py-20">
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-6 mb-10 border-b border-[#20151115] gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#75584a]">
                COLEÇÃO ATUAL
              </span>
              <h2 className="font-['Anton'] text-3xl sm:text-4xl uppercase tracking-wider text-[#201511] mt-1">
                PEÇAS DISPONÍVEIS
              </h2>
            </div>
            <button
              onClick={() => setActivePage("catalog")}
              className="text-xs font-bold uppercase tracking-widest text-[#201511] hover:text-[#75584a] flex items-center gap-1 group"
            >
              <span>VER TODAS AS PEÇAS ({products.length})</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((prod, index) => (
            <ScrollReveal key={prod.id} delay={index * 80} direction="up">
              <ProductCard
                product={prod}
                onSelect={onSelectProduct}
                onBuyNow={onBuyNow}
                onCheckout={onCheckout}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
