import { getAssetPath } from "../utils/assets";
import React from "react";
import { useCart } from "../context/CartContext";
import { UPSELLS } from "../data/products";

export function CartDrawer({ onCheckout }) {
  const {
    isOpen,
    closeCart,
    items,
    totalCount,
    subtotal,
    shippingPercent,
    shippingRemaining,
    updateQty,
    removeItem,
    addItem
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-out Drawer with spring animation */}
      <aside className="fixed top-0 right-0 h-full w-full sm:w-[480px] max-w-full bg-[#ffffff] z-50 flex flex-col justify-between border-l border-[#d2c3bf] shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#20151115] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">
              Sacola ({totalCount})
            </h2>
            <span className="text-[11px] font-mono text-[#75584a] uppercase">
              // FALSTEP ARCHIVE
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1 hover:bg-[#f3efe8] rounded transition active:scale-90"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Shipping Progress */}
        <div className="px-6 py-4 bg-[#fbf9f5] border-b border-[#20151115]">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-[#4e4541]">
              {shippingRemaining > 0
                ? `Faltam €${shippingRemaining.toFixed(2)} para Envio Grátis`
                : "Envio Grátis Desbloqueado! ✓"}
            </span>
            <span className="font-bold text-[#201511]">{Math.round(shippingPercent)}%</span>
          </div>
          <div className="w-full bg-[#e8e4dc] h-1.5 overflow-hidden">
            <div
              className="bg-[#201511] h-full transition-all duration-500 ease-out"
              style={{ width: `${shippingPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-[#807571] font-mono text-sm space-y-3">
              <span className="material-symbols-outlined text-4xl block opacity-40">
                shopping_bag
              </span>
              <p>A sua sacola está vazia.</p>
              <button
                onClick={closeCart}
                className="mt-2 text-xs font-mono font-bold uppercase underline text-[#201511]"
              >
                Explorar Coleção &rarr;
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemSize = item.size || item.selectedSize || "L";
              const itemQty = Number(item.qty || item.quantity) || 1;
              const itemPrice = Number(item.price) || 0;
              const lineTotal = itemPrice * itemQty;

              return (
                <div
                  key={`${item.id}-${itemSize}`}
                  className="flex gap-4 p-3 border border-[#20151115] bg-[#ffffff] hover:border-[#201511] transition-all"
                >
                  <div className="w-20 h-24 bg-[#fbf9f5] flex-shrink-0 overflow-hidden border border-[#20151115] flex items-center justify-center">
                    <img
                      src={getAssetPath(item.image)}
                      alt={item.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-['Anton'] text-sm uppercase text-[#201511] leading-tight">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id, itemSize)}
                          className="text-[#807571] hover:text-[#ba1a1a] p-1 transition rounded hover:bg-red-50"
                          title="Remover peça"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                      <span className="text-[11px] font-mono text-[#75584a] block mt-0.5">
                        TAMANHO: {itemSize}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#20151110]">
                      <div className="flex items-center border border-[#20151130] bg-[#fbf9f5]">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, itemSize, -1)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-[#201511] hover:text-white transition active:scale-90"
                          title="Diminuir quantidade"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-[#201511]">
                          {itemQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, itemSize, 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-[#201511] hover:text-white transition active:scale-90"
                          title="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#201511]">
                        €{lineTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Upsells Section */}
          <div className="mt-8 pt-6 border-t border-[#20151115]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#75584a] block mb-3">
              COMPLETE O SEU FIT // ATELIER ESSENTIALS
            </span>
            <div className="space-y-2">
              {UPSELLS.map((up) => (
                <div
                  key={up.id}
                  className="flex items-center justify-between p-2.5 border border-[#20151115] hover:border-[#201511] bg-[#fbf9f5] transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getAssetPath(up.image)}
                      alt={up.title}
                      className="w-12 h-12 object-contain bg-white border border-[#20151115] p-1"
                    />
                    <div>
                      <h5 className="font-['Anton'] text-xs uppercase text-[#201511]">
                        {up.title}
                      </h5>
                      <span className="font-mono text-xs text-[#4e4541]">
                        €{up.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem(up, up.size || "M", 1)}
                    className="px-3 py-1.5 bg-[#201511] hover:bg-[#4a3226] text-white font-mono text-[10px] font-bold uppercase transition active:scale-95 btn-shimmer"
                  >
                    + Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#20151115] bg-[#ffffff] space-y-4">
          <div className="flex justify-between items-baseline font-mono">
            <span className="text-xs uppercase text-[#807571]">Subtotal</span>
            <span className="font-['Anton'] text-2xl text-[#201511]">
              €{subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => {
              closeCart();
              onCheckout();
            }}
            disabled={items.length === 0}
            className="w-full py-4 bg-[#201511] hover:bg-[#4a3226] disabled:opacity-40 disabled:cursor-not-allowed text-white font-['Anton'] uppercase text-base tracking-widest transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 shadow-2xl btn-shimmer"
          >
            <span>FINALIZAR COMPRA</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
