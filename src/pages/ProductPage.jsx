import { getAssetPath } from "../utils/assets";
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { TiltCard } from "../components/TiltCard";
import { ScrollReveal } from "../components/ScrollReveal";

export function ProductPage({ product, onBack, onCheckout, onBuyNow }) {
  const { addItem, openCart, closeCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("L");
  const [activeTab, setActiveTab] = useState("ESPECIFICAÇÕES");
  const [currentImage, setCurrentImage] = useState(product?.image);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isMockup = (currentImage || product.image)?.endsWith(".png");
  const gallery = product.gallery || [product.image];

  const handleAddToCart = () => {
    addItem(product, selectedSize, 1);
    setIsAdded(true);
    openCart(); // Opens cart drawer immediately!
    setTimeout(() => setIsAdded(false), 900);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-12 pt-24 pb-10">
      {/* Breadcrumb navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#75584a] hover:text-[#201511] mb-8 transition group"
      >
        <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        <span>Voltar ao Catálogo</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Gallery with 3D Tilt */}
        <ScrollReveal direction="left" delay={50} className="lg:col-span-7 space-y-4">
          <TiltCard
            maxTilt={6}
            scale={1.01}
            className="aspect-[4/5] bg-[#fbf9f5] border border-[#20151115] overflow-hidden flex items-center justify-center relative shadow-lg hover:shadow-2xl transition-shadow"
          >
            <img
              src={getAssetPath(currentImage || product.image)}
              alt={product.title}
              className={`w-full h-full transition-all duration-500 ${
                isMockup ? "object-contain p-8" : "object-cover object-center"
              }`}
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/800x1000/201511/f3efe8?text=FALSE+STEP";
              }}
            />
          </TiltCard>

          {/* Gallery Thumbnails (if > 1 image) */}
          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(img)}
                  className={`w-20 h-24 border overflow-hidden bg-[#fbf9f5] transition-all active:scale-95 ${
                    (currentImage || product.image) === img
                      ? "border-[#201511] ring-2 ring-[#201511] shadow-md"
                      : "border-[#20151120] hover:border-[#201511] opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getAssetPath(img)}
                    alt=""
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#fbf9f5] border border-[#20151115] font-mono text-xs hover:border-[#201511] transition-colors">
              <span className="text-[#807571] uppercase block">PESO DA MALHA</span>
              <span className="text-[#201511] font-bold text-sm">{product.specs?.weight || "320 GSM"}</span>
            </div>
            <div className="p-4 bg-[#fbf9f5] border border-[#20151115] font-mono text-xs hover:border-[#201511] transition-colors">
              <span className="text-[#807571] uppercase block">ORIGEM / ATELIER</span>
              <span className="text-[#201511] font-bold text-sm">{product.specs?.origin || "Porto, Portugal"}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Product Details & Actions */}
        <ScrollReveal direction="right" delay={100} className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#75584a] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-ping" />
              <span>{product.edition || "FALSE STEP® ARCHIVE"}</span>
              <span>&bull;</span>
              <span className="text-[#201511]">EM STOCK</span>
            </div>

            <h1 className="font-['Anton'] text-3xl sm:text-5xl uppercase tracking-wider text-[#201511] leading-tight">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-['Anton'] text-3xl sm:text-4xl text-[#201511]">
                €{product.price.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-[#807571] uppercase">
                Impostos incluídos &bull; Envio Expresso
              </span>
            </div>

            <p className="text-sm text-[#4e4541] mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size Matrix Selector */}
            <div className="mt-8 pt-6 border-t border-[#20151115]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#201511]">
                  SELECIONAR TAMANHO
                </span>
                <span className="text-xs font-mono text-[#75584a] uppercase">
                  Corte Boxy Streetwear
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-mono font-bold uppercase border transition-all active:scale-95 ${
                      selectedSize === size
                        ? "bg-[#201511] text-white border-[#201511] shadow-inner"
                        : "bg-white text-[#201511] border-[#20151125] hover:border-[#201511]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Adicionar ao Carrinho & Comprar */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 font-['Anton'] uppercase text-sm tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border shadow-lg active:scale-98 ${
                  isAdded
                    ? "bg-[#2e7d32] text-white border-[#2e7d32]"
                    : "bg-white hover:bg-[#f3efe8] text-[#201511] border-[#201511]"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isAdded ? "check" : "add_shopping_cart"}
                </span>
                <span>{isAdded ? "ADICIONADO COM SUCESSO ✓" : "ADICIONAR AO CARRINHO"}</span>
              </button>

              <button
                onClick={() => {
                  if (onBuyNow) {
                    onBuyNow(product, selectedSize);
                  } else {
                    addItem(product, selectedSize, 1);
                    if (onCheckout) onCheckout();
                  }
                }}
                className="flex-1 py-4 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-xl active:scale-98"
              >
                <span className="material-symbols-outlined text-base">bolt</span>
                <span>COMPRAR AGORA ({selectedSize})</span>
              </button>
            </div>
          </div>

          {/* Accordion Tabs */}
          <div className="mt-10 pt-6 border-t border-[#20151115]">
            <div className="flex border-b border-[#20151115]">
              {["ESPECIFICAÇÕES", "ENVIO", "CUIDADOS"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 text-xs font-mono font-bold uppercase transition-all duration-150 border-b-2 ${
                    activeTab === tab
                      ? "border-[#201511] text-[#201511]"
                      : "border-transparent text-[#807571] hover:text-[#201511]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-4 text-xs text-[#4e4541] leading-relaxed">
              {activeTab === "ESPECIFICAÇÕES" && (
                <ul className="space-y-2 font-mono">
                  <li><strong>Composição:</strong> {product.specs?.composition || "100% Algodão Orgânico"}</li>
                  <li><strong>Gramagem:</strong> {product.specs?.weight || "320 GSM"}</li>
                  <li><strong>Tratamento:</strong> {product.specs?.treatment || "Lavagem Enzimática a Frio"}</li>
                  <li><strong>Origem:</strong> {product.specs?.origin || "Porto, Portugal"}</li>
                </ul>
              )}
              {activeTab === "ENVIO" && (
                <p>
                  Envios expedidos em 24h via transportadora expresso com tracking rastreado. Entregas em 2-4 dias úteis.
                </p>
              )}
              {activeTab === "CUIDADOS" && (
                <p>
                  Lavar à máquina a frio (30°C) virado do avesso. Não usar lixívia. Não secar na máquina. Passar a ferro do avesso sobre os grafismos.
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
