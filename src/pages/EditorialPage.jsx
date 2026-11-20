import React from "react";

export function EditorialPage({ onSelectProduct, setActivePage }) {
  return (
    <div className="bg-[#fbfbfb] text-[#1a1c1c]">
      {/* HERO EDITORIAL BANNER */}
      <section className="relative w-full border-b border-[#20151115] bg-black overflow-hidden">
        <div className="relative w-full min-h-[600px] lg:min-h-[75vh] flex flex-col justify-between">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Y1nelK19EwCkNjXkNAE31Af6FdjEmbJQBeP1qFFHD-dTCNvf_OfMFNdsSfh8k5G0VyK90Zuo43HTRGo6HA7UHo2EYVxleIxp7AT90KQbL9UR6bzrQenAXzLrZhCHvb3rVyGchwpMgqNk1WQP03sGpEUwb8dVRGyRIFzsp7xl6zuTGMzxzSEt_j-JEn1C3Bm_F_rzGlRj7YBzHBGxLz3nTWJTDMDlWH--HNujRoM"
            alt="FALSTEP Lookbook Editorial Campaign"
            className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

          <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 md:px-12 pb-12 pt-28 mt-auto">
            <div className="max-w-3xl">
              <span className="text-xs font-mono font-bold uppercase text-[#f3efe8] tracking-widest bg-[#201511] px-3 py-1 border border-white/20 inline-block mb-3">
                EDITORIAL ARCHIVE // VOLUME 07
              </span>
              <h1 className="font-['Anton'] text-5xl sm:text-7xl lg:text-8xl uppercase tracking-wider text-white leading-none">
                RAW LEISURE &amp; CONCRETE CULTURE
              </h1>
              <p className="text-sm sm:text-base text-[#e5ded8] pt-4 max-w-2xl leading-relaxed font-mono">
                Uma fusão entre o hedonismo solar do Mediterrâneo e a disciplina das ruas de Londres.
                Sem coleções sazonais descartáveis — apenas cápsulas de tiragem limitada confeccionadas em teares tradicionais no Norte de Portugal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO SPREAD & DISPATCH */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 pb-6 border-b border-[#20151115]">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#75584a] block mb-1">
              FIELD DISPATCH // PARIS &amp; LONDON
            </span>
            <h2 className="font-['Anton'] text-3xl sm:text-4xl uppercase tracking-wider text-[#201511]">
              ENSAIO VISUAL: CÁPSULA 07
            </h2>
          </div>
          <div className="lg:col-span-4 text-xs font-mono text-[#4e4541] border-l-2 border-[#201511] pl-4">
            Fotografia analógica 35mm com iluminação natural em concreto brutalista. Sem filtros digitais sintéticos.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Photo 1 */}
          <div className="md:col-span-7 bg-[#f7f5f0] border border-[#20151115] relative overflow-hidden group h-[500px]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCosOao_nyTugUorZ7q46hVGS7gl78RiP-iEV0V4YIHxKLgV66tYGZhFUhWtGXEBHjkuql-51hufV-8g6-U4LS61nkJ9XaTYvn6GP6moWoUGbMGNhgHs11k1SQOKsQcavQTpjBDghtucyoxDqBlcKYuEO__yKCOMTR_RLoBSXawb-oBeykZCQaTDfFq7OsbUUvV5PBP_XI0A3aaGJQfM767WMG-tvk8YsVd7L9EqZE"
              alt="Look 01 Le Marais"
              className="w-full h-full object-cover object-top grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#201511] font-bold">
              LOOK 01 // OVERSIZED ESPRESSO 550 GSM
            </div>
          </div>

          {/* Photo 2 */}
          <div className="md:col-span-5 bg-[#f7f5f0] border border-[#20151115] relative overflow-hidden group h-[500px]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKha3doZepP-aoMAlnHp6TWMyRVkW6qMC26d6L5syXd9IR2c5dMyprJjAWbtKQn9qnFLkECFTKoSHyxEzK2gUcBrYgRl7a3T-61XeqpyGjfFHqK7ZtCHaJ9Wap_TWqscUb-r1BRWBeTIjBYYXbxjbV9Lg3SQ6PE_-2_WJvaoEes0mh5Rz-8HMFMdylM4xFfD1XBQQhkCWLdSYFlLxU7FjaODH5PHe69gGTvSUwpZY"
              alt="Look 02 East London"
              className="w-full h-full object-cover object-top contrast-125 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#201511] font-bold">
              LOOK 02 // EAST LONDON ARCHIVE
            </div>
          </div>

          {/* MANIFESTO BOX */}
          <div className="md:col-span-12 border-2 border-[#201511] bg-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold text-[#75584a] uppercase tracking-widest block mb-2">
                FALSTEP CRAFT MANIFESTO
              </span>
              <p className="font-['Anton'] text-2xl md:text-3xl uppercase tracking-tight text-[#201511] leading-tight">
                "PEÇAS CONSTRUÍDAS PARA QUEM VIVE ENTRE NOITES DE MÚSICA UNDERGROUND E O ESCAPISMO DO VERÃO MEDITERRÂNEO. NUNCA PRODUZIDAS EM MASSA. NUNCA LIQUIDADAS."
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setActivePage("drops")}
                className="px-6 py-3.5 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-xs tracking-wider transition"
              >
                VER DROPS ATIVOS
              </button>
              <button
                onClick={() => setActivePage("catalog")}
                className="px-6 py-3.5 border border-[#201511] text-[#201511] hover:bg-[#f7f5f0] font-['Anton'] uppercase text-xs tracking-wider transition font-bold"
              >
                EXPLORAR CATÁLOGO
              </button>
            </div>
          </div>
        </div>

        {/* TECHNICAL SPECS DIVISION */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-[#20151115]">
          <div className="p-6 bg-[#f7f5f0] border border-[#20151115] space-y-2">
            <span className="material-symbols-outlined text-3xl text-[#201511]">texture</span>
            <h4 className="font-['Anton'] text-lg uppercase text-[#201511]">ALGODÃO 480-550 GSM</h4>
            <p className="text-xs text-[#4e4541] font-mono leading-relaxed">
              Fleece e French Terry penteados com fio duplo encorpado. Estrutura boxy rígida que mantém a silhueta mesmo após centenas de lavagens.
            </p>
          </div>
          <div className="p-6 bg-[#f7f5f0] border border-[#20151115] space-y-2">
            <span className="material-symbols-outlined text-3xl text-[#201511]">precision_manufacturing</span>
            <h4 className="font-['Anton'] text-lg uppercase text-[#201511]">MANUFATURA NO PORTO</h4>
            <p className="text-xs text-[#4e4541] font-mono leading-relaxed">
              Costura overlock reforçada com agulha dupla e acabamento artesanal em teares centenários no norte de Portugal.
            </p>
          </div>
          <div className="p-6 bg-[#f7f5f0] border border-[#20151115] space-y-2">
            <span className="material-symbols-outlined text-3xl text-[#201511]">verified</span>
            <h4 className="font-['Anton'] text-lg uppercase text-[#201511]">EDICÕES NUMERADAS</h4>
            <p className="text-xs text-[#4e4541] font-mono leading-relaxed">
              Tiragens estritamente limitadas a 350 peças por cápsula. Cada peça acompanha selo de autenticidade têxtil.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
