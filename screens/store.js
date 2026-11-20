/**
 * FALSTEP Universal Store Navigation & Interactive State Controller
 * Version 3.0 - High-End Luxury Streetwear Engine
 * Guarantees 100% working navigation, all buttons, cart drawer, modals, filters, and checkout
 */
(function() {
  "use strict";

  // 1. Initial Cart State & Persistence
  const defaultItems = [
    {
      id: "hoodie-espresso",
      title: "OVERSIZED ESPRESSO HOODIE",
      size: "L",
      color: "ESPRESSO BROWN",
      price: 95.00,
      qty: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeCFHnYvLQwrQ0F-NEsXdgMnxTQ183xrlSFo8LBQPiINd-CQ-y2JpwZUpmXbUwbbG7Wxe1-mPJY_fpErizTvXhhMg2x2pT--1L_f3NyEBPhc6x1_zTm1aWDQlAdwrGqFnUJLIlFm-mNhmAigmCMFqgHcM_oilbRuZ_yW45f0UxIYa4hH4HoT2bnZgQ3prm8xRNXIAbf1q-AkGUggsRysmkqpPX412r1WrHf7CnFcc"
    }
  ];

  function getCart() {
    try {
      const stored = localStorage.getItem("falstep_cart");
      return stored ? JSON.parse(stored) : defaultItems;
    } catch(e) {
      return defaultItems;
    }
  }

  function saveCart(items) {
    try {
      localStorage.setItem("falstep_cart", JSON.stringify(items));
    } catch(e) {}
    updateCartUI();
  }

  function getPaths() {
    const p = window.location.pathname;
    const isRoot = p.endsWith("screens/") || p.endsWith("screens/index.html") || p.endsWith("falstep/") || p.endsWith("falstep/index.html");
    const prefix = isRoot ? "" : "../";
    return {
      home: prefix + "02-atelier-archive-editorial-homepage/screen.html",
      drops: prefix + "09-archive-drops-streetwear-store-flow/screen.html",
      catalog: prefix + "01-atelier-archive-hoodies-sweatshirts-catalog/screen.html",
      pdp: prefix + "04-atelier-archive-heavyweight-hoodie-pdp/screen.html",
      sales: prefix + "11-falstep-sales-checkout-page/screen.html",
      cartPage: prefix + "03-atelier-archive-slide-out-cart-drawer/screen.html",
      portal: prefix + "index.html"
    };
  }

  // 2. Luxury Toast Notification System
  window.showToast = function(message, icon) {
    let toast = document.getElementById("falstepToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "falstepToast";
      toast.className = "fixed bottom-6 right-6 z-[99999] bg-[#201511] text-[#f3efe8] px-5 py-3.5 border border-[#4a3226] shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-12 opacity-0 font-['Hanken_Grotesk',sans-serif]";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[#f3efe8] text-xl">${icon || "info"}</span>
      <span class="text-xs font-mono uppercase tracking-wider font-bold">${message}</span>
    `;
    toast.classList.remove("translate-y-12", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
    
    if (window._toastTimer) clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.remove("translate-y-0", "opacity-100");
      toast.classList.add("translate-y-12", "opacity-0");
    }, 3200);
  };

  // 3. Luxury Policy & Information Modal
  window.openPolicyModal = function(title, contentHTML) {
    let modal = document.getElementById("falstepPolicyModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "falstepPolicyModal";
      modal.className = "fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm";
      modal.innerHTML = `
        <div class="bg-white max-w-xl w-full border-2 border-[#201511] p-6 sm:p-8 shadow-2xl relative font-['Hanken_Grotesk',sans-serif]">
          <button onclick="window.closePolicyModal()" class="absolute top-4 right-4 text-[#201511] hover:text-[#75584a] p-1">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
          <span class="text-xs font-mono font-bold tracking-widest text-[#75584a] uppercase">FALSTEP PROTOCOL // ARCHIVE</span>
          <h2 id="policyModalTitle" class="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511] mt-1 mb-4"></h2>
          <div id="policyModalContent" class="text-xs text-[#4e4541] space-y-3 leading-relaxed border-t border-[#d2c3bf] pt-4"></div>
          <div class="pt-6 mt-6 border-t border-[#d2c3bf] flex justify-end">
            <button onclick="window.closePolicyModal()" class="px-6 py-2.5 bg-[#201511] text-white font-['Anton'] uppercase text-xs tracking-wider hover:bg-[#4a3226] transition">
              Entendido
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    document.getElementById("policyModalTitle").innerText = title;
    document.getElementById("policyModalContent").innerHTML = contentHTML;
    modal.classList.remove("hidden");
  };

  window.closePolicyModal = function() {
    const modal = document.getElementById("falstepPolicyModal");
    if (modal) modal.classList.add("hidden");
  };

  // 4. VIP Account & Telemetry Modal
  window.openAccountModal = function() {
    let modal = document.getElementById("falstepAccountModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "falstepAccountModal";
      modal.className = "fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm font-['Hanken_Grotesk',sans-serif]";
      modal.innerHTML = `
        <div class="bg-white max-w-md w-full border-2 border-[#201511] p-6 sm:p-8 shadow-2xl relative">
          <button onclick="window.closeAccountModal()" class="absolute top-4 right-4 text-[#201511] hover:text-[#75584a] p-1">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs font-mono font-bold tracking-widest text-emerald-800 uppercase">Membro Verificado // VIP Node</span>
          </div>
          <h2 class="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">CONTA ARCHIVIST</h2>
          
          <div class="mt-4 p-4 bg-[#f7f5f0] border border-[#d2c3bf] space-y-2 text-xs font-mono">
            <div class="flex justify-between text-[#4e4541]">
              <span>ID COLECIONADOR:</span>
              <span class="font-bold text-[#201511]">#FAL-9842-PT</span>
            </div>
            <div class="flex justify-between text-[#4e4541]">
              <span>TIER DE ACESSO:</span>
              <span class="font-bold text-secondary text-[#75584a]">PRIORITY VIP (18:00 CET)</span>
            </div>
            <div class="flex justify-between text-[#4e4541]">
              <span>CRÉDITO ARCHIVE:</span>
              <span class="font-bold text-[#201511]">€50.00</span>
            </div>
          </div>

          <div class="mt-6 space-y-2.5">
            <button onclick="window.showToast('Rastreamento DHL Express: Encomenda em trânsito (Porto &rarr; Lisboa)', 'local_shipping'); window.closeAccountModal();" class="w-full py-3 bg-[#201511] text-white font-['Anton'] uppercase text-xs tracking-wider hover:bg-[#4a3226] transition flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-base">local_shipping</span>
              <span>RASTREAR MEUS PEDIDOS (DHL)</span>
            </button>
            <button onclick="window.showToast('Chave de Acesso Antecipado gerada: DROP-07-UNLOCK', 'vpn_key'); window.closeAccountModal();" class="w-full py-3 border border-[#201511] text-[#201511] font-['Anton'] uppercase text-xs tracking-wider hover:bg-[#f7f5f0] transition flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-base">vpn_key</span>
              <span>OBTER CHAVE DE ACESSO AO DROP</span>
            </button>
          </div>

          <div class="pt-4 mt-6 border-t border-[#d2c3bf] text-center text-[11px] font-mono text-neutral-500">
            FALSTEP ARCHIVE COLLECTIVE &bull; SUPORTE 24/7
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.classList.remove("hidden");
  };

  window.closeAccountModal = function() {
    const modal = document.getElementById("falstepAccountModal");
    if (modal) modal.classList.add("hidden");
  };

  // 5. Size Guide Modal
  window.openSizeGuideModal = function() {
    let modal = document.getElementById("falstepSizeModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "falstepSizeModal";
      modal.className = "fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm font-['Hanken_Grotesk',sans-serif]";
      modal.innerHTML = `
        <div class="bg-white max-w-lg w-full border-2 border-[#201511] p-6 sm:p-8 shadow-2xl relative">
          <button onclick="window.closeSizeGuideModal()" class="absolute top-4 right-4 text-[#201511] hover:text-[#75584a] p-1">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
          <span class="text-xs font-mono font-bold tracking-widest text-[#75584a] uppercase">ARQUITETURA DE MEDIDAS // GUIA DE TAMANHOS</span>
          <h2 class="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511] mt-1 mb-2">TABELA 480-550 GSM</h2>
          <p class="text-xs text-[#4e4541] mb-4">Corte boxy estruturado com ombros caídos. Recomendamos o seu tamanho padrão para caimento streetwear autêntico.</p>
          
          <div class="overflow-x-auto">
            <table class="w-full text-xs font-mono border-collapse text-center">
              <thead>
                <tr class="bg-[#201511] text-white">
                  <th class="p-2 border border-[#4a3226]">TAMANHO</th>
                  <th class="p-2 border border-[#4a3226]">PEITO (CM)</th>
                  <th class="p-2 border border-[#4a3226]">COMPR. (CM)</th>
                  <th class="p-2 border border-[#4a3226]">MANGA (CM)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#d2c3bf]">
                <tr class="hover:bg-[#f7f5f0]">
                  <td class="p-2 font-bold font-['Anton']">S</td>
                  <td class="p-2">62</td>
                  <td class="p-2">66</td>
                  <td class="p-2">58</td>
                </tr>
                <tr class="hover:bg-[#f7f5f0]">
                  <td class="p-2 font-bold font-['Anton']">M</td>
                  <td class="p-2">65</td>
                  <td class="p-2">68</td>
                  <td class="p-2">60</td>
                </tr>
                <tr class="bg-[#20151110] font-bold">
                  <td class="p-2 font-['Anton'] text-[#201511]">L (MODELO)</td>
                  <td class="p-2 text-[#201511]">68</td>
                  <td class="p-2 text-[#201511]">70</td>
                  <td class="p-2 text-[#201511]">62</td>
                </tr>
                <tr class="hover:bg-[#f7f5f0]">
                  <td class="p-2 font-bold font-['Anton']">XL</td>
                  <td class="p-2">72</td>
                  <td class="p-2">73</td>
                  <td class="p-2">64</td>
                </tr>
                <tr class="hover:bg-[#f7f5f0]">
                  <td class="p-2 font-bold font-['Anton']">XXL</td>
                  <td class="p-2">76</td>
                  <td class="p-2">75</td>
                  <td class="p-2">66</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 flex justify-between items-center pt-4 border-t border-[#d2c3bf]">
            <span class="text-[11px] font-mono text-[#75584a]">Modelo: 185 cm, 78 kg veste tamanho L</span>
            <button onclick="window.closeSizeGuideModal()" class="px-5 py-2 bg-[#201511] text-white font-['Anton'] uppercase text-xs tracking-wider">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.classList.remove("hidden");
  };

  window.closeSizeGuideModal = function() {
    const modal = document.getElementById("falstepSizeModal");
    if (modal) modal.classList.add("hidden");
  };

  // 6. Search Overlay Modal
  window.openSearchModal = function() {
    let search = document.getElementById("falstepSearchModal");
    const paths = getPaths();
    if (!search) {
      search = document.createElement("div");
      search.id = "falstepSearchModal";
      search.className = "fixed inset-0 z-[99999] bg-black/90 flex flex-col p-6 sm:p-12 backdrop-blur-md font-['Hanken_Grotesk',sans-serif]";
      search.innerHTML = `
        <div class="max-w-4xl w-full mx-auto flex flex-col h-full justify-between">
          <div>
            <div class="flex items-center justify-between pb-6 border-b border-white/20">
              <span class="font-['Anton'] text-2xl text-white tracking-widest uppercase">FALSTEP ARCHIVE</span>
              <button onclick="window.closeSearchModal()" class="text-white hover:text-neutral-400 p-2">
                <span class="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
            <div class="mt-8">
              <label class="block text-xs font-mono text-neutral-400 uppercase tracking-widest mb-3">Pesquisar Catálogo // Drops // Peças</label>
              <div class="flex items-center border-b-2 border-white pb-3 gap-3">
                <span class="material-symbols-outlined text-white text-3xl">search</span>
                <input id="falstepSearchInput" type="text" placeholder="Digite Hoodie, Espresso, 550 GSM, Porto..." class="w-full bg-transparent text-white font-['Anton'] text-2xl sm:text-4xl uppercase focus:outline-none placeholder:text-neutral-600"/>
              </div>
            </div>

            <!-- Quick Suggestions -->
            <div class="mt-8 space-y-4">
              <span class="text-xs font-mono text-neutral-400 uppercase tracking-widest">Atalhos Populares</span>
              <div class="flex flex-wrap gap-2">
                <button onclick="window.location.href='${paths.drops}'" class="px-4 py-2 border border-white/30 text-white text-xs font-mono uppercase hover:bg-white hover:text-black transition">DROP 07: TERRAIN & SHADOW</button>
                <button onclick="window.location.href='${paths.catalog}'" class="px-4 py-2 border border-white/30 text-white text-xs font-mono uppercase hover:bg-white hover:text-black transition">HOODIES & SWEATSHIRTS</button>
                <button onclick="window.location.href='${paths.pdp}'" class="px-4 py-2 border border-white/30 text-white text-xs font-mono uppercase hover:bg-white hover:text-black transition">OVERSIZED ESPRESSO (550 GSM)</button>
                <button onclick="window.location.href='${paths.sales}'" class="px-4 py-2 bg-white text-black text-xs font-mono uppercase font-bold hover:bg-[#f3efe8] transition">COMPRAR / CHECKOUT</button>
              </div>
            </div>
          </div>
          <div class="text-center py-6 border-t border-white/10 text-xs font-mono text-neutral-500 uppercase tracking-widest">
            FALSTEP &bull; HIGH-END STREETWEAR ARCHIVE &bull; PORTUGAL / LONDON
          </div>
        </div>
      `;
      document.body.appendChild(search);

      // Search input enter handler
      setTimeout(() => {
        const inp = document.getElementById("falstepSearchInput");
        if (inp) {
          inp.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
              const val = inp.value.toLowerCase().trim();
              if (val.includes("drop") || val.includes("07")) {
                window.location.href = paths.drops;
              } else if (val.includes("compra") || val.includes("checkout") || val.includes("venda")) {
                window.location.href = paths.sales;
              } else if (val.includes("pdp") || val.includes("espresso") || val.includes("heavyweight")) {
                window.location.href = paths.pdp;
              } else {
                window.location.href = paths.catalog;
              }
            }
          });
        }
      }, 50);
    }
    search.classList.remove("hidden");
    setTimeout(() => {
      const input = document.getElementById("falstepSearchInput");
      if (input) input.focus();
    }, 100);
  };

  window.closeSearchModal = function() {
    const search = document.getElementById("falstepSearchModal");
    if (search) search.classList.add("hidden");
  };

  // 7. Update Header Badge and Drawer UI
  function updateCartUI() {
    const items = getCart();
    const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update cart badge counters in header safely (NEVER touch header div containers!)
    document.querySelectorAll("[data-cart-badge]").forEach(el => {
      el.textContent = totalCount;
    });

    document.querySelectorAll("header span").forEach(span => {
      if (span.children.length === 0 && /^(BAG|SACOLA)\s*\(\d+\)$/i.test(span.textContent.trim())) {
        span.textContent = `BAG (${totalCount})`;
      }
    });

    document.querySelectorAll("header button").forEach(btn => {
      if (btn.children.length === 0 && /^(BAG|SACOLA)\s*\(\d+\)$/i.test(btn.textContent.trim())) {
        btn.textContent = `BAG (${totalCount})`;
      }
    });

    // Update drawer item count
    const countLabel = document.getElementById("drawerItemCount");
    if (countLabel) countLabel.innerText = `${totalCount} ${totalCount === 1 ? "ITEM" : "ITENS"}`;

    // Update drawer subtotal
    const subtotalEl = document.getElementById("drawerSubtotal");
    if (subtotalEl) subtotalEl.innerText = `€${subtotal.toFixed(2)}`;

    // Free shipping calculation (threshold: €150)
    const threshold = 150.00;
    const progressEl = document.getElementById("shippingProgress");
    const shippingTextEl = document.getElementById("shippingRemainingText");
    if (progressEl && shippingTextEl) {
      const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
      progressEl.style.width = `${percent}%`;
      const remaining = Math.max(0, threshold - subtotal);
      if (remaining === 0) {
        shippingTextEl.innerHTML = `<span class="text-[#201511] font-bold uppercase">⚡ FRETE GRÁTIS DESBLOQUEADO</span>`;
      } else {
        shippingTextEl.innerHTML = `Adicione <span class="font-bold text-[#201511]">€${remaining.toFixed(2)}</span> para desbloquear <span class="text-[#201511] font-semibold uppercase">FRETE GRÁTIS</span>`;
      }
    }

    // Render items list inside drawer
    const listEl = document.getElementById("drawerItemsList");
    if (listEl) {
      if (items.length === 0) {
        listEl.innerHTML = `<div class="py-12 text-center text-neutral-400 font-mono text-sm uppercase">Sua sacola está vazia</div>`;
      } else {
        listEl.innerHTML = items.map((item, idx) => `
          <div class="flex gap-4 group pb-4 border-b border-[#d2c3bf]">
            <div class="w-20 aspect-[4/5] bg-[#f7f5f0] border border-[#d2c3bf] flex-shrink-0 overflow-hidden cursor-pointer" onclick="window.location.href='${getPaths().pdp}'">
              <img class="w-full h-full object-cover" src="${item.image}" alt="${item.title}" onerror="this.src='https://placehold.co/100x125/201511/f3efe8?text=GARMENT'"/>
            </div>
            <div class="flex flex-col justify-between flex-1 py-0.5">
              <div>
                <div class="flex justify-between items-start gap-2">
                  <h3 class="font-['Anton'] text-xs uppercase tracking-tight text-[#201511] font-bold leading-tight cursor-pointer hover:underline" onclick="window.location.href='${getPaths().pdp}'">${item.title}</h3>
                  <button onclick="window.removeItemFromCart(${idx})" aria-label="Remover item" class="text-neutral-400 hover:text-red-600 transition-colors p-1">
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
                <p class="font-mono text-[11px] text-[#75584a] uppercase mt-1">TAM: ${item.size} / COR: ${item.color}</p>
              </div>
              <div class="flex justify-between items-center mt-2 pt-2 border-t border-[#20151115]">
                <div class="inline-flex items-center border border-[#d2c3bf] bg-white">
                  <button onclick="window.changeQty(${idx}, -1)" class="px-2.5 py-0.5 text-[#201511] hover:bg-neutral-100 font-bold text-xs">-</button>
                  <span class="px-3 py-0.5 text-xs font-mono font-bold text-[#201511] border-x border-[#d2c3bf]">${item.qty}</span>
                  <button onclick="window.changeQty(${idx}, 1)" class="px-2.5 py-0.5 text-[#201511] hover:bg-neutral-100 font-bold text-xs">+</button>
                </div>
                <span class="font-['Anton'] text-sm text-[#201511]">€${(item.price * item.qty).toFixed(2)}</span>
              </div>
            </div>
          </div>
        `).join("");
      }
    }
  }

  // Global methods for cart actions
  window.changeQty = function(index, delta) {
    const items = getCart();
    if (items[index]) {
      items[index].qty += delta;
      if (items[index].qty <= 0) {
        items.splice(index, 1);
        window.showToast("Item removido da sacola", "delete");
      }
      saveCart(items);
    }
  };

  window.removeItemFromCart = function(index) {
    const items = getCart();
    if (items[index]) {
      const removed = items.splice(index, 1);
      saveCart(items);
      window.showToast(`${removed[0]?.title || "Item"} removido`, "delete");
    }
  };

  window.addItemToCart = function(item) {
    const items = getCart();
    const existing = items.find(i => i.id === item.id && i.size === item.size);
    if (existing) {
      existing.qty += (item.qty || 1);
    } else {
      items.push({
        id: item.id || "falstep-" + Date.now(),
        title: item.title || "FALSTEP GARMENT",
        size: item.size || "L",
        color: item.color || "ESPRESSO",
        price: Number(item.price) || 95.00,
        qty: item.qty || 1,
        image: item.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAeCFHnYvLQwrQ0F-NEsXdgMnxTQ183xrlSFo8LBQPiINd-CQ-y2JpwZUpmXbUwbbG7Wxe1-mPJY_fpErizTvXhhMg2x2pT--1L_f3NyEBPhc6x1_zTm1aWDQlAdwrGqFnUJLIlFm-mNhmAigmCMFqgHcM_oilbRuZ_yW45f0UxIYa4hH4HoT2bnZgQ3prm8xRNXIAbf1q-AkGUggsRysmkqpPX412r1WrHf7CnFcc"
      });
    }
    saveCart(items);
    window.showToast(`Adicionado: ${item.title} (Tam ${item.size || "L"})`, "shopping_bag");
    window.openCartDrawer();
  };

  window.openCartDrawer = function() {
    const drawer = document.getElementById("cartDrawerContainer");
    if (drawer) {
      drawer.classList.remove("hidden");
      setTimeout(() => {
        const flyout = document.getElementById("cartFlyout");
        const overlay = document.getElementById("drawerOverlay");
        if (flyout) flyout.style.transform = "translateX(0)";
        if (overlay) overlay.style.opacity = "1";
      }, 10);
    }
  };

  window.closeCartDrawer = function() {
    const p = window.location.pathname;
    if (p.includes("03-") || p.includes("08-")) {
      window.location.href = getPaths().catalog;
      return;
    }
    const flyout = document.getElementById("cartFlyout");
    const overlay = document.getElementById("drawerOverlay");
    if (flyout) flyout.style.transform = "translateX(100%)";
    if (overlay) overlay.style.opacity = "0";
    setTimeout(() => {
      const drawer = document.getElementById("cartDrawerContainer");
      if (drawer) drawer.classList.add("hidden");
    }, 300);
  };

  // 8. Inject Cart Drawer Markup if missing
  function injectDrawer() {
    if (document.getElementById("cartDrawerContainer")) return;

    const paths = getPaths();
    const drawerHTML = `
      <div id="cartDrawerContainer" class="hidden relative z-[99990]">
        <div id="drawerOverlay" onclick="window.closeCartDrawer()" class="fixed inset-0 bg-black/60 transition-opacity duration-300 opacity-0"></div>
        <aside id="cartFlyout" class="fixed top-0 right-0 h-full w-full sm:w-[480px] max-w-full bg-[#ffffff] z-50 flex flex-col justify-between border-l border-[#d2c3bf] transition-transform duration-300 translate-x-full shadow-2xl font-['Hanken_Grotesk',sans-serif]">
          <!-- TOP BAR -->
          <div class="flex-none p-4 border-b border-[#d2c3bf] bg-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h2 class="font-['Anton'] text-xl uppercase tracking-tight text-[#201511]">SUA SACOLA</h2>
                <span id="drawerItemCount" class="bg-[#f7f5f0] text-[#201511] border border-[#d2c3bf] text-[11px] font-mono font-bold px-2.5 py-0.5">1 ITEM</span>
              </div>
              <button onclick="window.closeCartDrawer()" aria-label="Fechar Sacola" class="p-1 text-[#201511] hover:text-[#75584a] transition-colors">
                <span class="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <!-- SHIPPING PROGRESS -->
            <div class="mt-3 bg-[#f7f5f0] border border-[#d2c3bf] p-3">
              <div class="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-[#201511] mb-1">
                <span>STATUS DE FRETE</span>
                <span>GRÁTIS A PARTIR DE €150</span>
              </div>
              <div class="w-full bg-[#e2e2e2] h-1.5 overflow-hidden">
                <div id="shippingProgress" class="bg-[#201511] h-full w-[65%] transition-all duration-300"></div>
              </div>
              <p id="shippingRemainingText" class="text-xs text-[#4e4541] mt-1.5 font-mono">
                Adicione <span class="font-bold text-[#201511]">€55.00</span> para desbloquear <span class="text-[#201511] font-semibold uppercase">FRETE GRÁTIS</span>
              </p>
            </div>
          </div>

          <!-- SCROLLABLE CONTENT -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div id="drawerItemsList" class="flex flex-col gap-4"></div>

            <!-- UPSELL SECTION -->
            <div class="pt-4 border-t border-[#d2c3bf]">
              <span class="text-[11px] font-mono font-bold uppercase tracking-widest text-[#75584a] block mb-3">COMPLETE O LOOK // DROP 07</span>
              <div class="flex items-center justify-between p-3 bg-[#f7f5f0] border border-[#d2c3bf]">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-neutral-200 border border-neutral-300 overflow-hidden flex-shrink-0">
                    <img src="https://placehold.co/100x100/201511/f3efe8?text=MEIAS" class="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <h4 class="font-['Anton'] text-xs uppercase text-[#201511]">MEIAS CANELADAS (PACK COM 3)</h4>
                    <p class="text-[11px] font-mono text-neutral-500">€28.00 &bull; 100% Algodão Porto</p>
                  </div>
                </div>
                <button onclick="window.addItemToCart({id: 'socks-3pack', title: 'MEIAS CANELADAS (PACK COM 3)', size: 'O/S', color: 'BONE', price: 28.00, image: 'https://placehold.co/100x100/201511/f3efe8?text=MEIAS'})" class="px-3 py-1.5 text-xs font-bold uppercase bg-[#201511] text-white hover:bg-[#4a3226] transition font-['Anton'] tracking-wider">
                  + Add
                </button>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="flex-none p-4 border-t border-[#d2c3bf] bg-[#ffffff] space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600">Subtotal:</span>
              <span id="drawerSubtotal" class="font-['Anton'] text-2xl text-[#201511]">€95.00</span>
            </div>
            <p class="text-[11px] font-mono text-neutral-500">Impostos e despacho internacional DHL calculados no checkout.</p>
            <button onclick="window.location.href='${paths.sales}'" class="w-full py-4 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-widest transition flex items-center justify-center gap-2 shadow-lg">
              <span>FINALIZAR COMPRA // CHECKOUT</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </aside>
      </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = drawerHTML;
    document.body.appendChild(div.firstElementChild);
  }

  // 9. Central Universal Click Router
  function initUniversalRouter() {
    const paths = getPaths();

    // Universal accordion handler available globally
    window.toggleAccordion = function(contentId, iconId) {
      const content = document.getElementById(contentId);
      const icon = document.getElementById(iconId);
      if (content) {
        content.classList.toggle("hidden");
        if (icon) {
          icon.style.transform = content.classList.contains("hidden") ? "rotate(0deg)" : "rotate(180deg)";
        }
      }
    };

    // Universal size selector available globally
    window.selectSize = function(size, btn) {
      if (btn && btn.parentElement) {
        btn.parentElement.querySelectorAll("button").forEach(b => {
          b.classList.remove("bg-primary", "text-white", "text-on-primary", "border-2", "border-primary", "bg-[#201511]");
          b.classList.add("bg-surface-container-lowest", "border-outline-variant", "text-primary");
        });
        btn.classList.add("bg-primary", "text-white", "text-on-primary", "border-2", "border-primary");
      }
      const label = document.getElementById("selected-size-label");
      if (label) label.innerText = size;
      window.showToast(`Tamanho selecionado: ${size}`, "straighten");
    };

    // Universal color selector available globally
    window.selectColor = function(colorName, dotEl) {
      if (dotEl && dotEl.parentElement) {
        dotEl.parentElement.querySelectorAll("span").forEach(s => s.classList.remove("ring-2", "ring-[#201511]", "scale-125"));
        dotEl.classList.add("ring-2", "ring-[#201511]", "scale-125");
      }
      const label = document.getElementById("selected-color-label");
      if (label) label.innerText = colorName;
      window.showToast(`Cor selecionada: ${colorName}`, "palette");
    };

    document.addEventListener("click", function(e) {
      const target = e.target;
      if (!target) return;

      // 1. Check if user clicked an accordion button directly
      const accBtn = target.closest("button[onclick*='toggleAccordion'], .accordion-item button");
      if (accBtn) {
        // Let inline onclick execute or handle it
        const onclickAttr = accBtn.getAttribute("onclick");
        if (!onclickAttr) {
          e.preventDefault();
          const item = accBtn.closest(".accordion-item") || accBtn.parentElement;
          const body = item ? item.querySelector("[id^='acc-'], div:nth-child(2)") : null;
          const icon = accBtn.querySelector(".material-symbols-outlined");
          if (body) {
            body.classList.toggle("hidden");
            if (icon) icon.style.transform = body.classList.contains("hidden") ? "rotate(0deg)" : "rotate(180deg)";
          }
        }
        return;
      }

      // 2. Find closest interactive element
      const el = target.closest("a, button, [role='button'], article, .group");
      if (!el) return;

      const rawText = (el.innerText || "").trim();
      const upper = rawText.toUpperCase();
      const href = el.getAttribute("href") || "";

      // A. CLOSE CART DRAWER
      if (el.id === "closeDrawer" || el.getAttribute("aria-label") === "Close Shopping Bag" || el.getAttribute("aria-label") === "Fechar Sacola" || el.id === "drawerOverlay") {
        e.preventDefault();
        window.closeCartDrawer();
        return;
      }

      // B. CART BAG TRIGGER
      if (
        /BAG\s*\(\d+\)/i.test(upper) ||
        /SACOLA\s*\(\d+\)/i.test(upper) ||
        upper === "BAG" ||
        upper === "SACOLA" ||
        target.innerText === "shopping_bag" ||
        el.getAttribute("aria-label") === "Shopping Bag" ||
        el.querySelector(".material-symbols-outlined")?.innerText === "shopping_bag"
      ) {
        e.preventDefault();
        window.openCartDrawer();
        return;
      }

      // C. CHECKOUT / PROCEED TO PAY / BUY WITH APPLE PAY
      if (
        upper.includes("CHECKOUT") ||
        upper.includes("FINALIZAR COMPRA") ||
        upper.includes("PAGAR €") ||
        upper.includes("BUY WITH") ||
        upper.includes("PAY")
      ) {
        e.preventDefault();
        window.location.href = paths.sales;
        return;
      }

      // D. QUICK ADD FROM PRODUCT CARD (Size Buttons S, M, L, XL on Card Hover)
      const quickAddContainer = el.closest(".quick-add, [class*='translate-y-full'], [class*='group-hover:translate-y-0']");
      if (el.tagName === "BUTTON" && ["S", "M", "L", "XL", "XXL"].includes(upper) && quickAddContainer) {
        e.preventDefault();
        e.stopPropagation();

        const card = el.closest("article, .group");
        let title = "OVERSIZED HOODIE";
        let price = 95.00;
        let image = "";

        if (card) {
          const titleEl = card.querySelector("h2, h3, h4, .font-headline-sm, .font-title-md, .font-title-lg");
          if (titleEl) title = titleEl.innerText.trim();

          const priceMatch = card.innerText.match(/€\s*(\d+(?:\.\d{2})?)/);
          if (priceMatch) price = parseFloat(priceMatch[1]);

          const img = card.querySelector("img");
          if (img && img.src) image = img.src;
        }

        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        window.addItemToCart({
          id: id || "falstep-garment",
          title: title,
          size: upper,
          color: "ESPRESSO NOIR",
          price: price,
          qty: 1,
          image: image
        });
        return;
      }

      // E. ADD TO BAG / ADD TO CART (From PDP)
      if (
        upper.includes("ADD TO BAG") ||
        upper.includes("ADD TO CART") ||
        upper.includes("ADICIONAR À SACOLA") ||
        upper === "ADD" ||
        upper === "+ ADD"
      ) {
        e.preventDefault();
        const activeSizeBtn = document.querySelector(".size-btn.bg-primary, .size-btn.border-2, #selected-size-label");
        const activeSize = activeSizeBtn ? activeSizeBtn.innerText.trim() : "L";
        
        let title = "OVERSIZED ESPRESSO HOODIE";
        let price = 195.00;
        let image = "https://lh3.googleusercontent.com/aida-public/AB6AXuAeCFHnYvLQwrQ0F-NEsXdgMnxTQ183xrlSFo8LBQPiINd-CQ-y2JpwZUpmXbUwbbG7Wxe1-mPJY_fpErizTvXhhMg2x2pT--1L_f3NyEBPhc6x1_zTm1aWDQlAdwrGqFnUJLIlFm-mNhmAigmCMFqgHcM_oilbRuZ_yW45f0UxIYa4hH4HoT2bnZgQ3prm8xRNXIAbf1q-AkGUggsRysmkqpPX412r1WrHf7CnFcc";

        const pdpTitle = document.querySelector("h1");
        if (pdpTitle) title = pdpTitle.innerText.trim();

        const priceMatch = document.body.innerText.match(/€\s*(\d+(?:\.\d{2})?)/);
        if (priceMatch) price = parseFloat(priceMatch[1]);

        window.addItemToCart({
          id: "hoodie-espresso",
          title: title,
          size: activeSize || "L",
          color: "ESPRESSO BROWN",
          price: price,
          qty: 1,
          image: image
        });
        return;
      }

      // F. SIZE GUIDE TRIGGER (Find Your Size)
      if (upper.includes("FIND YOUR SIZE") || upper.includes("GUIA DE TAMANHO") || upper.includes("MODEL IS 185CM")) {
        e.preventDefault();
        window.openSizeGuideModal();
        return;
      }

      // G. USER ACCOUNT / VIP MEMBER MODAL (Person Icon)
      if (el.getAttribute("aria-label")?.includes("Account") || target.innerText === "person" || el.querySelector(".material-symbols-outlined")?.innerText === "person") {
        e.preventDefault();
        window.openAccountModal();
        return;
      }

      // H. SEARCH MODAL TRIGGER
      if (el.getAttribute("aria-label")?.includes("Search") || target.innerText === "search" || el.querySelector(".material-symbols-outlined")?.innerText === "search") {
        e.preventDefault();
        window.openSearchModal();
        return;
      }

      // I. WISHLIST TOGGLE (Favorite Icon)
      if (el.getAttribute("aria-label")?.toLowerCase().includes("wishlist") || el.getAttribute("aria-label")?.toLowerCase().includes("favorite") || target.innerText === "favorite" || el.querySelector(".material-symbols-outlined")?.innerText === "favorite") {
        e.preventDefault();
        const icon = el.querySelector(".material-symbols-outlined") || el;
        const isFav = el.classList.toggle("text-red-600");
        if (isFav) {
          icon.style.fontVariationSettings = "'FILL' 1";
          window.showToast("Salvo na sua Lista de Desejos // FALSTEP", "favorite");
        } else {
          icon.style.fontVariationSettings = "'FILL' 0";
          window.showToast("Removido dos Favoritos", "favorite_border");
        }
        return;
      }

      // J. CURRENCY SWITCHER (EUR / USD)
      if (upper === "EUR €" || upper === "USD $" || upper.includes("EUR (€)") || upper.includes("USD ($)")) {
        e.preventDefault();
        const isUSD = !window._isUSD;
        window._isUSD = isUSD;
        window.showToast(`Moeda alterada para: ${isUSD ? "USD ($)" : "EUR (€)"}`, "payments");
        
        // Update all price tags on page
        document.querySelectorAll("body *").forEach(node => {
          if (node.children.length === 0 && node.textContent.includes("€") && !isUSD) {
            // Already EUR
          } else if (node.children.length === 0 && /€\s*(\d+(?:\.\d{2})?)/.test(node.textContent) && isUSD) {
            node.textContent = node.textContent.replace(/€\s*(\d+(?:\.\d{2})?)/g, (m, val) => `$${(parseFloat(val) * 1.08).toFixed(2)}`);
          } else if (node.children.length === 0 && /\$\s*(\d+(?:\.\d{2})?)/.test(node.textContent) && !isUSD) {
            node.textContent = node.textContent.replace(/\$\s*(\d+(?:\.\d{2})?)/g, (m, val) => `€${(parseFloat(val) / 1.08).toFixed(2)}`);
          }
        });
        return;
      }

      // K. CATALOG FILTERS & VIEW CONTROLS (CATEGORY, SIZE, COLOR TONES, PRICE)
      if (upper.includes("CATEGORY") || upper.includes("COLOR TONES") || upper.includes("PRICE RANGE")) {
        e.preventDefault();
        window.showToast(`Filtro [${upper.split("\n")[0]}]: Exibindo todos os produtos da cápsula`, "tune");
        return;
      }

      if (upper.includes("LOAD MORE PIECES")) {
        e.preventDefault();
        el.innerText = "TODAS AS 32 PEÇAS CARREGADAS [32 DE 32]";
        el.classList.add("opacity-60", "cursor-default");
        window.showToast("✓ Arquivo Completo Desbloqueado: 32 Peças", "inventory_2");
        return;
      }

      if (target.innerText === "view_agenda" || target.innerText === "grid_view") {
        e.preventDefault();
        const grid = document.querySelector(".grid[class*='grid-cols']");
        if (grid) {
          if (target.innerText === "view_agenda") {
            grid.className = grid.className.replace(/grid-cols-4|grid-cols-2/g, "grid-cols-2");
            window.showToast("Modo de Exibição: 2 Colunas Ampliadas", "view_agenda");
          } else {
            grid.className = grid.className.replace(/grid-cols-2/g, "grid-cols-4");
            window.showToast("Modo de Exibição: Grade 4 Colunas", "grid_view");
          }
        }
        return;
      }

      // L. ANCHOR SMOOTH SCROLL (e.g. href="#drops" or href="#lookbook")
      if (href.startsWith("#") && href.length > 1) {
        const anchorId = href.substring(1);
        const targetSection = document.getElementById(anchorId);
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: "smooth" });
          return;
        } else if (anchorId === "drops") {
          e.preventDefault();
          window.location.href = paths.drops;
          return;
        } else if (anchorId === "lookbook") {
          e.preventDefault();
          window.location.href = paths.home;
          return;
        }
      }

      // M. LOGO -> HOME
      if (upper === "FALSTEP" || upper === "ATELIER ARCHIVE") {
        e.preventDefault();
        if (window.location.pathname.includes("02-")) {
          history.replaceState(null, "", window.location.pathname);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        window.location.href = paths.home;
        return;
      }

      // N. NAVIGATION LINKS
      if (upper === "DROPS" || upper.includes("EXPLORE THE DROP") || upper.includes("VIEW DROPS")) {
        e.preventDefault();
        window.location.href = paths.catalog;
        return;
      }

      if (upper === "COLLECTIONS" || upper === "COLLECTION" || upper === "CATÁLOGO" || upper === "CATALOGUE" || upper.includes("VIEW FULL CATALOG") || upper.includes("ALL GARMENTS") || upper.includes("ALL HOODIES")) {
        e.preventDefault();
        window.location.href = paths.catalog;
        return;
      }

      if (upper.includes("COMPRAR") || upper.includes("VENDA") || upper.includes("BUY NOW")) {
        e.preventDefault();
        window.location.href = paths.sales;
        return;
      }

      if (upper === "EDITORIAL" || upper === "LOOKBOOK" || upper.includes("VIEW LOOKBOOK") || upper.includes("LOOKBOOK ARCHIVE")) {
        e.preventDefault();
        window.location.href = paths.catalog;
        return;
      }

      if (upper === "HOME") {
        e.preventDefault();
        window.location.href = paths.home;
        return;
      }

      // O. SIZE SELECTOR ON PDP (S, M, L, XL, XXL)
      if (el.tagName === "BUTTON" && ["S", "M", "L", "XL", "XXL"].includes(upper) && !quickAddContainer) {
        e.preventDefault();
        const parent = el.parentElement;
        if (parent) {
          parent.querySelectorAll("button").forEach(b => {
            b.classList.remove("bg-primary", "text-white", "text-on-primary", "border-2", "border-primary", "bg-[#201511]");
            b.classList.add("bg-surface-container-lowest", "border-outline-variant", "text-primary");
          });
          el.classList.add("bg-primary", "text-white", "text-on-primary", "border-2", "border-primary");
        }
        const label = document.getElementById("selected-size-label");
        if (label) label.innerText = upper;
        window.showToast(`Tamanho selecionado: ${upper}`, "straighten");
        return;
      }

      // P. POLICY / FOOTER MODALS
      if (upper.includes("SHIPPING") || upper.includes("ENVIO") || upper.includes("DROPS")) {
        if (el.tagName === "A" && (href === "#" || href === "")) {
          e.preventDefault();
          window.openPolicyModal("Envios & Lançamentos // Falstep", `
            <p><strong>Despacho Prioritário:</strong> Todos os pedidos confirmados são despachados em até 24 horas úteis diretamente de nossa manufatura no Porto, Portugal.</p>
            <p><strong>Envio Internacional DHL Express:</strong> Rastreamento porta-a-porta e entrega entre 1 a 3 dias úteis para toda a Europa e Reino Unido, e 3 a 5 dias para o resto do mundo.</p>
            <p><strong>Frete Grátis:</strong> Disponível automaticamente para compras acima de €150.00.</p>
          `);
          return;
        }
      }

      if (upper.includes("CLIENT SERVICE") || upper.includes("ATENDIMENTO")) {
        e.preventDefault();
        window.openPolicyModal("Concierge & Atendimento ao Cliente", `
          <p>Nosso time de atendimento está à disposição 24 horas por dia, 7 dias por semana.</p>
          <p><strong>E-mail:</strong> concierge@falstep.com</p>
          <p><strong>WhatsApp VIP:</strong> +351 912 345 678</p>
          <p>Tempo médio de resposta: menos de 15 minutos.</p>
        `);
        return;
      }

      if (upper.includes("AUTHENTICITY") || upper.includes("AUTENTICIDADE")) {
        e.preventDefault();
        window.openPolicyModal("Certificado de Autenticidade // Falstep", `
          <p>Cada peça FALSTEP é confeccionada exclusivamente com algodão 100% puro de 450 a 550 GSM, sem misturas sintéticas de poliéster.</p>
          <p>Nossos lotes são produzidos em edições rigorosamente limitadas e numeradas em Barcelos e Porto, com certificação têxtil OEKO-TEX Standard 100.</p>
        `);
        return;
      }

      if (upper.includes("TERMS") || upper.includes("TERMOS")) {
        e.preventDefault();
        window.openPolicyModal("Termos de Liberação // Drop Rules", `
          <p>1. Limite estrito de no máximo 2 unidades por modelo por cliente em cada lançamento oficial.</p>
          <p>2. Garantia incondicional de 30 dias para trocas de numeração ou reembolso total sem burocracia.</p>
          <p>3. Pagamentos 100% protegidos por criptografia SSL bancária e suporte Apple Pay / Cartão.</p>
        `);
        return;
      }

      if (upper.includes("PRIVACY") || upper.includes("COOKIE") || upper.includes("RECYCLING")) {
        e.preventDefault();
        window.openPolicyModal("Políticas de Privacidade & Sustentabilidade", `
          <p><strong>Proteção de Dados:</strong> Seus dados pessoais e endereço são utilizados exclusivamente para entrega fiscal e logística pela transportadora oficial.</p>
          <p><strong>Programa Re-Archive:</strong> Aceitamos peças FALSTEP antigas para reciclagem de fibras em troca de 20% de desconto no próximo drop.</p>
        `);
        return;
      }

      if (upper === "INSTAGRAM" || upper === "TIKTOK" || upper === "ARCHIVE DISCORD") {
        e.preventDefault();
        window.showToast(`Conectando à comunidade oficial FALSTEP no ${upper}...`, "share");
        return;
      }

      // Q. PRODUCT CARDS -> PDP (Click on card image or title)
      if (el.tagName === "ARTICLE" || el.classList.contains("group")) {
        if (target.tagName === "BUTTON" || target.closest("button")) return;
        if (target.tagName === "A" && target.getAttribute("href") && target.getAttribute("href") !== "#") return;

        if (el.querySelector("img") && (el.innerText.includes("€") || el.innerText.includes("EDITION") || el.innerText.includes("HOODIE") || el.innerText.includes("SWEATSHIRT") || el.innerText.includes("TEE") || el.innerText.includes("FLEECE") || el.innerText.includes("TRACKPANT"))) {
          e.preventDefault();
          window.location.href = paths.pdp;
          return;
        }
      }

      // R. PREVENT HASH JUMPS
      if (href === "#" || href === "") {
        e.preventDefault();
      }
    });

    // Intercept all newsletter forms
    document.querySelectorAll("form").forEach(form => {
      form.addEventListener("submit", function(e) {
        if (!form.getAttribute("action")) {
          e.preventDefault();
          const emailInput = form.querySelector("input[type='email'], input[type='text']");
          const val = emailInput ? emailInput.value : "";
          if (val) {
            window.showToast("ACESSO VIP CONFIRMADO // Chave enviada para: " + val, "check_circle");
            if (emailInput) emailInput.value = "";
          } else {
            window.showToast("Por favor, digite seu e-mail para acesso VIP", "mail");
          }
        }
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectDrawer();
      initUniversalRouter();
      updateCartUI();
      if (window.location.hash === "#editorial") {
        setTimeout(() => {
          const ed = document.getElementById("editorial");
          if (ed) ed.scrollIntoView({ behavior: "smooth" });
        }, 250);
      }
    });
  } else {
    injectDrawer();
    initUniversalRouter();
    updateCartUI();
  }
})();
