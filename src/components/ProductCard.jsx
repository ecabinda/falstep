import React, { useState } from "react";
import { useCart } from "../context/CartContext";

export function ProductCard({ product, onSelect, onCheckout, onBuyNow }) {
  const { addItem, openCart, closeCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "L");
  const [isAdded, setIsAdded] = useState(false);
  const isMockup = product.image?.endsWith(".png");

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product, selectedSize, 1);
    setIsAdded(true);
    openCart(); // Instantly open cart drawer
    setTimeout(() => setIsAdded(false), 900);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    try {
      if (typeof closeCart === "function") closeCart();
    } catch (err) {}
    if (typeof onBuyNow === "function") {
      onBuyNow(product, selectedSize);
    } else if (typeof onCheckout === "function") {
      addItem(product, selectedSize, 1);
      onCheckout();
    }
  };

  const handleOpenProduct = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(product);
  };

  return (
    <article className="group bg-[#ffffff] border border-[#20151115] hover:border-[#201511] transition-all duration-300 hover:shadow-2xl flex flex-col h-full overflow-hidden rounded-sm relative">
      <div
        className="aspect-[4/5] bg-[#fbf9f5] overflow-hidden relative cursor-pointer flex items-center justify-center"
        onClick={handleOpenProduct}
      >
        <img
          src={product.image}
          alt={product.title}
          className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
            isMockup ? "object-contain p-4" : "object-cover object-center"
          }`}
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/800x1000/201511/f3efe8?text=FALSE+STEP";
          }}
        />

        {product.edition && (
          <div className="absolute top-3 left-3 bg-[#f3efe8]/95 backdrop-blur-sm text-[#201511] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border border-[#20151120] shadow-sm animate-pulse-badge">
            {product.edition}
          </div>
        )}

        {/* Quick View Tag on Hover */}
        <div className="absolute inset-x-0 bottom-0 py-2.5 bg-black/80 backdrop-blur-sm text-white text-center font-mono text-[11px] font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center justify-center gap-1.5">
          <span>Ver Peça em Detalhe</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between border-t border-[#20151115]">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={handleOpenProduct}
              className="font-['Anton'] text-base uppercase text-[#201511] leading-tight cursor-pointer hover:text-[#75584a] transition-colors"
            >
              {product.title}
            </h3>
            <span className="font-mono text-sm font-bold text-[#201511] flex-shrink-0">
              €{product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-[#4e4541] mt-1 line-clamp-1 font-mono">{product.subtitle}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#20151115] flex flex-col gap-2">
          {/* Quick-add Size Matrix */}
          <div className="flex items-center gap-1">
            {product.sizes?.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`flex-1 py-1 text-[11px] font-mono font-bold uppercase border transition-all active:scale-95 ${
                  selectedSize === size
                    ? "bg-[#201511] text-white border-[#201511] shadow-inner"
                    : "bg-white text-[#201511] border-[#20151120] hover:border-[#201511]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Button 1: Adicionar ao Carrinho */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-2 border font-['Anton'] uppercase text-xs tracking-wider transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-1.5 ${
                isAdded
                  ? "bg-[#2e7d32] text-white border-[#2e7d32]"
                  : "bg-white hover:bg-[#f3efe8] text-[#201511] border-[#201511]"
              }`}
              title="Adicionar à sacola de compras"
            >
              <span className="material-symbols-outlined text-[15px]">
                {isAdded ? "check" : "add_shopping_cart"}
              </span>
              <span>{isAdded ? "Adicionado ✓" : "Adicionar"}</span>
            </button>

            {/* Button 2: Comprar (Direto ao Checkout) */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-2.5 px-2 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-xs tracking-wider transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
              title="Comprar agora e finalizar encomenda"
            >
              <span className="material-symbols-outlined text-[15px]">
                bolt
              </span>
              <span>Comprar ({selectedSize})</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
