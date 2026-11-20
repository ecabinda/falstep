import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AccountPage({ setActivePage, onSelectProduct }) {
  const { user, logout, orders, isLoadingOrders, isAdmin, openAuthModal } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto bg-white border border-[#20151115] p-8 shadow-xl">
          <span className="material-symbols-outlined text-5xl text-[#201511] mb-3">
            lock
          </span>
          <h2 className="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">
            Área de Cliente
          </h2>
          <p className="text-xs text-[#4e4541] font-mono mt-2 mb-6">
            Inicie sessão para consultar as suas compras guardadas e o estado das suas encomendas em qualquer dispositivo.
          </p>
          <button
            onClick={openAuthModal}
            className="w-full py-3.5 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-xs tracking-widest transition shadow-lg"
          >
            Iniciar Sessão / Criar Conta &rarr;
          </button>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Entregue":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Em Trânsito":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Em Preparação":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-[#f3efe8] text-[#201511] border-[#20151120]";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-12 pt-28 pb-24">
      {/* Top Breadcrumb & User Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#20151115] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#75584a]">
              FALSTEP ARCHIVE // CONTA DE CLIENTE
            </span>

          </div>
          <h1 className="font-['Anton'] text-3xl md:text-5xl uppercase tracking-wider text-[#201511]">
            Olá, {user.name}
          </h1>
          <p className="text-xs text-[#4e4541] font-mono mt-1">
            {user.email} &bull; Membro desde {new Date(user.createdAt || Date.now()).toLocaleDateString("pt-PT")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">


          <button
            onClick={() => {
              logout();
              setActivePage("home");
            }}
            className="px-4 py-2 border border-[#20151125] hover:border-[#ba1a1a] hover:text-[#ba1a1a] text-[#201511] font-mono text-xs font-bold uppercase transition bg-white"
          >
            Terminar Sessão
          </button>
        </div>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="p-6 bg-white border border-[#20151115] shadow-sm">
          <span className="text-[11px] font-mono uppercase text-[#75584a] block mb-1">
            TOTAL DE COMPRAS
          </span>
          <span className="font-['Anton'] text-3xl text-[#201511]">
            {orders.length} {orders.length === 1 ? "Pedido" : "Pedidos"}
          </span>
          <span className="text-xs text-[#4e4541] font-mono block mt-1">
            Guardadas e acessíveis de qualquer dispositivo
          </span>
        </div>

        <div className="p-6 bg-white border border-[#20151115] shadow-sm">
          <span className="text-[11px] font-mono uppercase text-[#75584a] block mb-1">
            TOTAL INVESTIDO
          </span>
          <span className="font-['Anton'] text-3xl text-[#201511]">
            €{totalSpent.toFixed(2)}
          </span>
          <span className="text-xs text-[#4e4541] font-mono block mt-1">
            Peças exclusivas de arquivo FALSTEP
          </span>
        </div>

        <div className="p-6 bg-white border border-[#20151115] shadow-sm">
          <span className="text-[11px] font-mono uppercase text-[#75584a] block mb-1">
            ESTATUTO DO MEMBRO
          </span>
          <span className="font-['Anton'] text-3xl text-emerald-700">
            "COLECIONADOR"
          </span>
          <span className="text-xs text-[#4e4541] font-mono block mt-1">
            Acesso prioritário aos próximos drops
          </span>
        </div>
      </div>

      {/* Purchases / Orders List */}
      <div className="bg-white border border-[#20151115] shadow-sm">
        <div className="p-6 border-b border-[#20151115] flex items-center justify-between">
          <div>
            <h2 className="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">
              HISTÓRICO DE COMPRAS
            </h2>
            <p className="text-xs text-[#4e4541] font-mono mt-0.5">
              Todas as compras sincronizadas em tempo real com a base de dados central.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#75584a] uppercase">
            {orders.length} Registo(s)
          </span>
        </div>

        {isLoadingOrders ? (
          <div className="py-16 text-center text-[#75584a] font-mono text-xs">
            <span className="w-6 h-6 border-2 border-[#201511] border-t-transparent rounded-full animate-spin inline-block mb-2" />
            <p>A sincronizar encomendas...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-[#75584a] font-mono space-y-4">
            <span className="material-symbols-outlined text-4xl block opacity-40">
              inventory_2
            </span>
            <p className="text-sm">Ainda não realizou compras com esta conta.</p>
            <button
              onClick={() => setActivePage("catalog")}
              className="px-6 py-3 bg-[#201511] text-white font-['Anton'] uppercase text-xs tracking-wider hover:bg-[#4a3226] transition shadow"
            >
              Explorar Coleção &rarr;
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#20151115]">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-[#fbf9f5] transition">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#20151110]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-['Anton'] text-lg uppercase text-[#201511]">
                      {order.id}
                    </span>
                    <span className="text-xs font-mono text-[#75584a]">
                      &bull; {new Date(order.createdAt).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 text-xs font-mono font-bold uppercase border rounded-sm ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status || "Confirmado"}
                    </span>
                    <span className="font-['Anton'] text-xl text-[#201511]">
                      €{Number(order.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-white border border-[#20151110]"
                    >
                      <div className="w-14 h-16 bg-[#f7f5f0] flex-shrink-0 overflow-hidden border border-[#20151110] flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-['Anton'] text-xs uppercase text-[#201511] truncate">
                          {item.title}
                        </h4>
                        <div className="text-[11px] font-mono text-[#75584a] flex items-center gap-2 mt-0.5">
                          <span>Tam: {item.size}</span>
                          <span>&bull;</span>
                          <span>Qtd: {item.qty}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#201511] block mt-0.5">
                          €{(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping address footer */}
                {order.shippingAddress?.address && (
                  <div className="mt-4 pt-3 border-t border-[#20151108] text-xs font-mono text-[#75584a] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                      <span>
                        Envio para: {order.shippingAddress.address}, {order.shippingAddress.city} ({order.shippingAddress.postalCode})
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#201511] underline hover:text-[#75584a] font-bold uppercase text-[11px]"
                    >
                      Ver Detalhes do Recibo &rarr;
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-white border border-[#201511] p-6 md:p-8 z-10 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-[#20151115]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#75584a]">
                  RECIBO OFICIAL // FALSTEP
                </span>
                <h3 className="font-['Anton'] text-2xl uppercase text-[#201511]">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-[#f7f5f0] rounded"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#75584a]">Data:</span>
                <span className="text-[#201511] font-bold">
                  {new Date(selectedOrder.createdAt).toLocaleString("pt-PT")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75584a]">Estado da Encomenda:</span>
                <span className="text-[#201511] font-bold uppercase">
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75584a]">Destinatário:</span>
                <span className="text-[#201511] font-bold">
                  {selectedOrder.customerName || selectedOrder.shippingAddress?.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75584a]">Morada de Entrega:</span>
                <span className="text-[#201511] text-right font-bold">
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}
                </span>
              </div>
            </div>

            <div className="border-t border-b border-[#20151115] py-4 my-2 space-y-2">
              <span className="font-['Anton'] text-xs uppercase tracking-wider text-[#75584a] block mb-2">
                ITENS ADQUIRIDOS:
              </span>
              {selectedOrder.items?.map((it, i) => (
                <div key={i} className="flex justify-between text-xs font-mono">
                  <span>
                    {it.qty}x {it.title} ({it.size})
                  </span>
                  <span className="font-bold">€{(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-1 font-mono text-xs">
              <div className="flex justify-between text-[#75584a]">
                <span>Subtotal:</span>
                <span>€{Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#75584a]">
                <span>Portes de Envio:</span>
                <span>{selectedOrder.shippingCost === 0 ? "GRÁTIS" : `€${selectedOrder.shippingCost?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-['Anton'] pt-2 text-[#201511] border-t border-[#20151115]">
                <span>TOTAL PAGO:</span>
                <span>€{Number(selectedOrder.total || 0).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 py-3 bg-[#201511] text-white font-['Anton'] uppercase text-xs tracking-wider hover:bg-[#4a3226] transition"
            >
              Fechar Recibo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
