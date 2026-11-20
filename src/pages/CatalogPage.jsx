import React, { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import { ScrollReveal } from "../components/ScrollReveal";
import { MarqueeTicker } from "../components/MarqueeTicker";

export function CatalogPage({ onSelectProduct, onCheckout, onBuyNow }) {
  const { products, collections } = useProducts();
  const [columns, setColumns] = useState(3);
  const [activeCollectionId, setActiveCollectionId] = useState("ALL");
  const [activeFilter, setActiveFilter] = useState("TODAS");

  const activeCollection = collections?.find((c) => c.id === activeCollectionId);

  // Filter products by collection first, then by category
  const collectionProducts = activeCollectionId === "ALL" || !activeCollection
    ? products
    : products.filter((p) => activeCollection.productIds?.includes(p.id));

  const filtered = activeFilter === "TODAS"
    ? collectionProducts
    : collectionProducts.filter((p) => p.category === activeFilter || p.title.includes(activeFilter));

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-12 pt-24 pb-12">
      {/* Catalog Header with Scroll Reveal */}
      <ScrollReveal direction="down" delay={50}>
        <div className="pb-8 border-b border-[#20151115] mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#75584a] inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#75584a] animate-pulse" />
                {activeCollection ? activeCollection.badge || "CATÁLOGO EXCLUSIVO" : "DROP 07 // FALSE STEP® ARCHIVE"}
              </span>
              <h1 className="font-['Anton'] text-4xl md:text-5xl uppercase tracking-wider text-[#201511] mt-1">
                {activeCollection ? activeCollection.name : "LIMITED EDITION COLLECTION"}
              </h1>
              <p className="text-sm text-[#4e4541] mt-2 max-w-xl leading-relaxed">
                {activeCollection?.tagline || "Malhas pesadas arquitetônicas desenvolvidas em Portugal com corte boxy contemporâneo. Peças de edição limitada numerada com estampagem em serigrafia de alta densidade."}
              </p>

              {/* Collections / Catalogs Switcher Pills */}
              {collections && collections.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#20151110]">
                  <span className="text-[10px] font-mono uppercase text-[#75584a] font-bold mr-1">Catálogos:</span>
                  <button
                    onClick={() => setActiveCollectionId("ALL")}
                    className={`px-3 py-1 text-xs font-mono font-bold uppercase transition rounded-sm ${
                      activeCollectionId === "ALL"
                        ? "bg-[#201511] text-white shadow"
                        : "bg-[#f7f5f0] text-[#4e4541] hover:text-[#201511]"
                    }`}
                  >
                    Todos os Produtos ({products.length})
                  </button>
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setActiveCollectionId(col.id)}
                      className={`px-3 py-1 text-xs font-mono font-bold uppercase transition rounded-sm flex items-center gap-1.5 ${
                        activeCollectionId === col.id
                          ? "bg-[#201511] text-white shadow"
                          : "bg-[#f7f5f0] text-[#4e4541] hover:text-[#201511]"
                      }`}
                    >
                      <span>{col.name}</span>
                      <span className="text-[10px] opacity-60">({col.productIds?.length || 0})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DENSITY TOGGLE & FILTERS */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Filter tags */}
              <div className="flex items-center gap-1 border border-[#20151115] p-1 bg-[#f7f5f0] shadow-sm">
                {[
                  { label: "TODAS", val: "TODAS" },
                  { label: "T-SHIRTS", val: "T-SHIRTS" },
                  { label: "GRAPHICS", val: "GRAPHICS" },
                  { label: "ARCHIVE", val: "ARCHIVE" }
                ].map((filter) => (
                  <button
                    key={filter.val}
                    onClick={() => setActiveFilter(filter.val)}
                    className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-all duration-200 active:scale-95 ${
                      activeFilter === filter.val
                        ? "bg-[#201511] text-white shadow"
                        : "text-[#4e4541] hover:text-[#201511]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Grid Density */}
              <div className="hidden sm:flex items-center gap-1 border border-[#20151115] p-1 bg-white shadow-sm">
                <span className="text-[10px] font-mono uppercase px-2 text-[#807571]">Grelha:</span>
                <button
                  onClick={() => setColumns(2)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold transition-all active:scale-95 ${
                    columns === 2 ? "bg-[#201511] text-white shadow" : "text-[#4e4541] hover:text-[#201511]"
                  }`}
                >
                  2-COL
                </button>
                <button
                  onClick={() => setColumns(3)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold transition-all active:scale-95 ${
                    columns === 3 ? "bg-[#201511] text-white shadow" : "text-[#4e4541] hover:text-[#201511]"
                  }`}
                >
                  3-COL
                </button>
                <button
                  onClick={() => setColumns(4)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold transition-all active:scale-95 ${
                    columns === 4 ? "bg-[#201511] text-white shadow" : "text-[#4e4541] hover:text-[#201511]"
                  }`}
                >
                  4-COL
                </button>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Grid with Staggered ScrollReveal */}
      <div
        className={`grid gap-6 transition-all duration-300 ${
          columns === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : columns === 3
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {filtered.map((prod, idx) => (
          <ScrollReveal key={prod.id} delay={idx * 60} direction="up">
            <ProductCard
              product={prod}
              onSelect={onSelectProduct}
              onBuyNow={onBuyNow}
              onCheckout={onCheckout}
            />
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-[#20151115]">
        <MarqueeTicker speed="30s" className="text-[#75584a] text-sm" />
      </div>
    </div>
  );
}
