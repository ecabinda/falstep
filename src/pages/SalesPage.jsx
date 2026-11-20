import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { PRODUCTS } from "../data/products";

export function SalesPage({ setActivePage, directCheckoutItem }) {
  const { user, saveOrder, openAuthModal } = useAuth();
  const { items, subtotal, shippingRemaining, addItem, updateQty, removeItem, clearCart } = useCart();
  
  // Selected product for quick single-product sales mode if cart is empty
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [selectedSize, setSelectedSize] = useState("L");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card"); // 'credit_card' | 'pix' | 'apple_pay'
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Customer details form
  const [formData, setFormData] = useState({
    name: user?.name || "Alexandre Silva",
    email: user?.email || "alexandre@falstep.com",
    phone: "+351 912 345 678",
    address: "Rua das Flores, 42",
    city: "Porto",
    postalCode: "4050-265",
    country: "Portugal",
    cardNumber: "•••• •••• •••• 4242",
    cardExpiry: "12/28",
    cardCvc: "892"
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: clean, cartSubtotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Cupom inválido.");
        return;
      }
      if (data.coupon.type === "percentage") {
        setDiscountPercent(data.coupon.value);
      } else {
        const pct = Math.min(100, Math.round((Number(data.coupon.value) / (subtotal || 1)) * 100));
        setDiscountPercent(pct);
      }
      setCouponApplied(true);
    } catch {
      if (clean === "FALSTEP10" || clean === "DROP07") {
        setDiscountPercent(10);
        setCouponApplied(true);
      } else {
        setCouponError("Cupom inválido ou expirado.");
      }
    }
  };

  // Determine items to checkout: if directCheckoutItem is set, checkout that specific item directly!
  // Otherwise, checkout the items in the cart!
  const checkoutItems = directCheckoutItem
    ? [
        {
          id: directCheckoutItem.product.id,
          title: directCheckoutItem.product.title,
          size: directCheckoutItem.size || "L",
          selectedSize: directCheckoutItem.size || "L",
          color: directCheckoutItem.product.color || "DEFAULT",
          price: Number(directCheckoutItem.product.price) || 0,
          qty: directCheckoutItem.qty || 1,
          quantity: directCheckoutItem.qty || 1,
          image: directCheckoutItem.product.image || (directCheckoutItem.product.gallery && directCheckoutItem.product.gallery[0]) || ""
        }
      ]
    : items.length > 0
    ? items.map(i => ({
        id: i.id,
        title: i.title,
        size: i.size || i.selectedSize || "L",
        selectedSize: i.size || i.selectedSize || "L",
        color: i.color || "DEFAULT",
        price: Number(i.price) || 0,
        qty: Number(i.qty || i.quantity) || 1,
        quantity: Number(i.qty || i.quantity) || 1,
        image: i.image
      }))
    : [
        {
          id: selectedProduct.id,
          title: selectedProduct.title,
          size: selectedSize,
          selectedSize: selectedSize,
          color: selectedProduct.color || "DEFAULT",
          price: Number(selectedProduct.price) || 0,
          qty: 1,
          quantity: 1,
          image: selectedProduct.image
        }
      ];

  const currentSubtotal = checkoutItems.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 1),
    0
  );

  const discountAmount = (currentSubtotal * discountPercent) / 100;
  const shippingCost = currentSubtotal >= 150 ? 0.00 : 15.00;
  const finalTotal = Math.max(0, currentSubtotal - discountAmount + shippingCost);

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    const generatedId = "FLS-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);

    // Save order to central database
    const orderData = {
      id: generatedId,
      userId: user ? user.id : null,
      customerName: formData.name || formData.fullName || (user ? user.name : "Cliente"),
      customerEmail: formData.email || (user ? user.email : ""),
      items: checkoutItems.map(it => ({
        id: it.id,
        title: it.title,
        price: Number(it.price) || 0,
        size: it.selectedSize || it.size || "L",
        qty: Number(it.qty || it.quantity) || 1,
        image: it.image
      })),
      subtotal: currentSubtotal,
      shippingCost: shippingCost,
      total: finalTotal,
      shippingAddress: {
        fullName: formData.name || formData.fullName || "Cliente",
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString()
    };

    await saveOrder(orderData);
    if (!directCheckoutItem) {
      clearCart();
    }
    setIsOrderPlaced(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#f7f5f0] min-h-screen text-[#1a1c1c] pb-24 pt-16">
      {/* Top Sales Banner */}
      <div className="bg-[#201511] text-[#f3efe8] py-2.5 px-4 text-center border-b border-[#4a3226]">
        <p className="font-['Anton'] text-xs uppercase tracking-widest flex items-center justify-center gap-3">
          <span>&bull; CHECKOUT OFICIAL &bull;</span>
          <span>DISPONIBILIDADE LIMITADA // ALOCAÇÃO ESTRITA</span>
          <span>&bull; FRETE GRÁTIS A PARTIR DE €150 &bull;</span>
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:pt-24 pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#d2c3bf]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#75584a]">
            <button onClick={() => setActivePage("catalog")} className="hover:text-[#201511] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Catálogo</span>
            </button>
            <span>/</span>
            <span className="text-[#201511]">Página de Venda &amp; Finalização</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Ambiente 100% Seguro (SSL 256-Bit)</span>
          </div>
        </div>

        {/* ORDER SUCCESS MODAL */}
        {isOrderPlaced ? (
          <div className="bg-white border-2 border-[#201511] p-8 md:p-12 shadow-2xl max-w-2xl mx-auto my-12 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-[#201511] text-white flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">check</span>
            </div>
            
            <span className="text-xs font-mono font-bold tracking-widest text-[#75584a] uppercase">
              PEDIDO CONFIRMADO // SUCESSO
            </span>
            <h1 className="font-['Anton'] text-4xl uppercase text-[#201511] mt-1 mb-3">
              OBRIGADO PELA SUA COMPRA
            </h1>
            <p className="text-sm text-[#4e4541] max-w-md mx-auto mb-6 leading-relaxed">
              Seu pedido <strong>{orderId}</strong> foi registrado em nosso laboratório têxtil no Porto. 
              Enviamos os detalhes da remessa e o rastreamento DHL Express para <strong>{formData.email}</strong>.
            </p>

            <div className="bg-[#f7f5f0] border border-[#d2c3bf] p-4 text-left font-mono text-xs space-y-2 mb-8">
              <div className="flex justify-between border-b border-[#d2c3bf] pb-2">
                <span>NÚMERO DO PEDIDO:</span>
                <span className="font-bold text-[#201511]">{orderId}</span>
              </div>
              <div className="flex justify-between border-b border-[#d2c3bf] pb-2">
                <span>DESTINATÁRIO:</span>
                <span className="font-bold text-[#201511]">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#d2c3bf] pb-2">
                <span>ENDEREÇO DE ENTREGA:</span>
                <span className="font-bold text-[#201511]">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between border-b border-[#d2c3bf] pb-2">
                <span>MÉTODO DE PAGAMENTO:</span>
                <span className="font-bold text-[#201511] uppercase">{paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-[#201511]">
                <span>TOTAL PAGO:</span>
                <span>€{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setIsOrderPlaced(false); setActivePage("catalog"); }}
                className="flex-1 py-4 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-wider transition"
              >
                Continuar Comprando
              </button>
              <button
                onClick={() => window.print()}
                className="py-4 px-6 border border-[#201511] hover:bg-[#f3efe8] text-[#201511] font-mono text-xs font-bold uppercase transition"
              >
                Imprimir Recibo
              </button>
            </div>
          </div>
        ) : (
          /* MAIN TWO-COLUMN CHECKOUT / SALES VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: CUSTOMER DATA & PAYMENT (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* IF CART IS EMPTY: QUICK GARMENT SELECTOR */}
              {directCheckoutItem ? (
                <div className="bg-white border-2 border-[#201511] p-5 shadow-sm rounded-sm mb-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#20151115] mb-3">
                    <span className="text-xs font-mono font-bold uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      COMPRA DIRETA // CHECKOUT IMEDIATO
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePage("catalog")}
                      className="text-xs font-mono font-bold uppercase text-[#75584a] hover:text-[#201511] underline underline-offset-4"
                    >
                      Trocar Peça
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-[#fbf9f5] border border-[#20151115] flex-shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={directCheckoutItem.product.image}
                        alt={directCheckoutItem.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-['Anton'] text-lg uppercase text-[#201511] truncate">
                        {directCheckoutItem.product.title}
                      </h4>
                      <p className="font-mono text-xs text-[#75584a] mt-0.5">
                        {directCheckoutItem.product.subtitle || "Edição Limitada 320 GSM"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 font-mono text-xs">
                        <span className="bg-[#201511] text-white px-2 py-0.5 font-bold uppercase">
                          TAMANHO: {directCheckoutItem.size}
                        </span>
                        <span className="font-bold text-[#201511] text-sm">
                          €{Number(directCheckoutItem.product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="bg-white border border-[#20151115] p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-[#20151115] mb-4">
                    <span className="text-xs font-mono font-bold uppercase text-[#75584a]">
                      ETAPA 1: ESCOLHA SUA PEÇA
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase">
                      Algodão 550 GSM Porto
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {PRODUCTS.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className={`p-2 border cursor-pointer transition ${
                          selectedProduct.id === prod.id
                            ? "border-[#201511] bg-[#f7f5f0]"
                            : "border-[#d2c3bf] hover:border-[#20151125]"
                        }`}
                      >
                        <div className="aspect-[4/5] bg-neutral-100 overflow-hidden mb-2">
                          <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-['Anton'] text-xs uppercase leading-tight line-clamp-1">{prod.title}</h4>
                        <p className="font-mono text-xs font-bold text-[#201511] mt-0.5">€{prod.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Size Matrix */}
                  <div className="pt-3 border-t border-[#20151115] flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[#201511]">TAMANHO:</span>
                    <div className="flex gap-1.5">
                      {selectedProduct.sizes?.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`w-9 h-8 text-xs font-mono font-bold uppercase border transition ${
                            selectedSize === size
                              ? "bg-[#201511] text-white border-[#201511]"
                              : "bg-white text-[#201511] border-[#d2c3bf] hover:border-[#201511]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* FORM: IDENTIFICATION & ADDRESS */}
              <form onSubmit={handleCompleteOrder} className="space-y-6">
                
                {/* 1. Identification Box */}
                <div className="bg-white border border-[#20151115] p-6 shadow-sm">
                  <h3 className="font-['Anton'] text-lg uppercase text-[#201511] mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#201511] text-white text-xs font-mono flex items-center justify-center font-bold">1</span>
                    <span>Dados de Envio &amp; Contato</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#d2c3bf] text-sm focus:border-[#201511] outline-none font-sans"
                        placeholder="Nome e Sobrenome"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                        E-mail para Rastreio *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#d2c3bf] text-sm focus:border-[#201511] outline-none font-sans"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                        Endereço Completo (Rua, Número, Apto) *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#d2c3bf] text-sm focus:border-[#201511] outline-none font-sans"
                        placeholder="Ex: Rua das Flores, 42 - Apt 3B"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#d2c3bf] text-sm focus:border-[#201511] outline-none font-sans"
                        placeholder="Cidade"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                        Código Postal / CEP *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#d2c3bf] text-sm focus:border-[#201511] outline-none font-sans"
                        placeholder="0000-000"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method Box */}
                <div className="bg-white border border-[#20151115] p-6 shadow-sm">
                  <h3 className="font-['Anton'] text-lg uppercase text-[#201511] mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#201511] text-white text-xs font-mono flex items-center justify-center font-bold">2</span>
                    <span>Forma de Pagamento</span>
                  </h3>

                  {/* Payment Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`p-3 border text-xs font-mono font-bold uppercase flex flex-col items-center gap-1 transition ${
                        paymentMethod === "credit_card"
                          ? "border-[#201511] bg-[#201511] text-white"
                          : "border-[#d2c3bf] bg-white text-[#201511] hover:border-[#201511]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">credit_card</span>
                      <span>Cartão de Crédito</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("pix")}
                      className={`p-3 border text-xs font-mono font-bold uppercase flex flex-col items-center gap-1 transition ${
                        paymentMethod === "pix"
                          ? "border-[#201511] bg-[#201511] text-white"
                          : "border-[#d2c3bf] bg-white text-[#201511] hover:border-[#201511]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">qr_code</span>
                      <span>PIX Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("apple_pay")}
                      className={`p-3 border text-xs font-mono font-bold uppercase flex flex-col items-center gap-1 transition ${
                        paymentMethod === "apple_pay"
                          ? "border-[#201511] bg-[#201511] text-white"
                          : "border-[#d2c3bf] bg-white text-[#201511] hover:border-[#201511]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">smartphone</span>
                      <span>Apple / Google Pay</span>
                    </button>
                  </div>

                  {/* Card Fields */}
                  {paymentMethod === "credit_card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#d2c3bf] text-sm focus:border-[#201511] outline-none font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                            Validade (MM/AA)
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-[#d2c3bf] text-sm focus:border-[#201511] outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                            CVV (Código de Segurança)
                          </label>
                          <input
                            type="text"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-[#d2c3bf] text-sm focus:border-[#201511] outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pix View */}
                  {paymentMethod === "pix" && (
                    <div className="bg-[#f7f5f0] border border-[#d2c3bf] p-6 text-center space-y-3">
                      <div className="w-36 h-36 bg-white border border-[#201511] mx-auto flex items-center justify-center p-2">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FALSTEP-PAY-PIX-DROP07" 
                          alt="QR Code Pix" 
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-xs font-mono text-[#201511] font-bold">
                        Aponte a câmera do seu aplicativo de banco para pagar via Pix
                      </p>
                      <button 
                        type="button" 
                        onClick={() => alert("Chave Pix Copiada com sucesso!")} 
                        className="px-4 py-2 border border-[#201511] text-xs font-mono font-bold uppercase bg-white hover:bg-[#201511] hover:text-white transition"
                      >
                        Copiar Código Pix
                      </button>
                    </div>
                  )}

                  {/* Express Wallet */}
                  {paymentMethod === "apple_pay" && (
                    <div className="bg-[#f7f5f0] border border-[#d2c3bf] p-6 text-center space-y-3">
                      <span className="material-symbols-outlined text-4xl text-[#201511]">contactless</span>
                      <p className="text-xs font-mono text-[#201511] font-bold">
                        1-Click Checkout via TouchID ou FaceID ativado
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-5 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-lg tracking-widest transition flex items-center justify-center gap-3 shadow-xl active:scale-[0.99]"
                >
                  <span>FINALIZAR PEDIDO // PAGAR €{finalTotal.toFixed(2)}</span>
                  <span className="material-symbols-outlined text-base">lock</span>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & TRUST BADGES (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Order Summary Card */}
              <div className="bg-white border border-[#20151115] p-6 shadow-sm">
                <h3 className="font-['Anton'] text-lg uppercase text-[#201511] pb-3 border-b border-[#20151115] mb-4">
                  Resumo da Compra ({checkoutItems.length} {checkoutItems.length === 1 ? "Item" : "Itens"})
                </h3>

                {/* Items List */}
                <div className="divide-y divide-[#20151115] mb-6">
                  {checkoutItems.map((item, idx) => (
                    <div key={`${item.id}-${item.size}-${idx}`} className="py-3 flex gap-3 items-center">
                      <div className="w-16 h-20 bg-[#f7f5f0] border border-[#d2c3bf] flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-['Anton'] text-xs uppercase text-[#201511] truncate">{item.title}</h4>
                        <p className="font-mono text-[11px] text-[#75584a] uppercase">Tam: {item.size} &bull; Qtd: {item.qty}</p>
                        <p className="font-mono text-xs font-bold text-[#201511] mt-1">€{(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="mb-6 pt-4 border-t border-[#20151115]">
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#4e4541] mb-1">
                    Cupom de Desconto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Ex: FALSTEP10"
                      className="flex-1 p-2.5 border border-[#d2c3bf] text-xs font-mono uppercase focus:border-[#201511] outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#201511] text-white font-['Anton'] text-xs uppercase tracking-wider hover:bg-[#4a3226] transition"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs font-mono text-emerald-700 mt-1.5 font-bold">
                      ✓ Desconto de {discountPercent}% aplicado com sucesso!
                    </p>
                  )}
                  {couponError && (
                    <p className="text-xs font-mono text-red-600 mt-1.5">
                      {couponError}
                    </p>
                  )}
                </form>

                {/* Totals Breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-[#20151115] text-xs font-mono">
                  <div className="flex justify-between text-[#4e4541]">
                    <span>Subtotal:</span>
                    <span className="font-bold text-[#201511]">€{currentSubtotal.toFixed(2)}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Desconto ({discountPercent}%):</span>
                      <span>-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#4e4541]">
                    <span>Frete Internacional (DHL Express):</span>
                    <span>{shippingCost === 0 ? <strong className="text-emerald-700 uppercase">GRÁTIS</strong> : `€${shippingCost.toFixed(2)}`}</span>
                  </div>

                  <div className="pt-3 border-t border-[#201511] flex justify-between items-baseline">
                    <span className="font-['Anton'] text-base uppercase text-[#201511]">TOTAL:</span>
                    <span className="font-['Anton'] text-2xl text-[#201511]">€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees & Trust Banner */}
              <div className="bg-white border border-[#20151115] p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#201511] text-xl">verified</span>
                  <div>
                    <h5 className="font-['Anton'] text-xs uppercase text-[#201511]">Garantia Incondicional 30 Dias</h5>
                    <p className="text-[11px] text-[#4e4541] mt-0.5">Se não servir ou não atender aos padrões da alfaiataria, trocamos sem custo.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#201511] text-xl">local_shipping</span>
                  <div>
                    <h5 className="font-['Anton'] text-xs uppercase text-[#201511]">Despacho Rápido da Europa</h5>
                    <p className="text-[11px] text-[#4e4541] mt-0.5">Rastreamento 24h porta-a-porta via DHL Express.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#201511] text-xl">workspace_premium</span>
                  <div>
                    <h5 className="font-['Anton'] text-xs uppercase text-[#201511]">Certificado de Algodão 550 GSM</h5>
                    <p className="text-[11px] text-[#4e4541] mt-0.5">Algodão orgânico pesado beneficiado em pequenos lotes no Porto.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
