import React from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';

export const OrdersManagerView: React.FC = () => {
  const { orders, activeBusiness } = useBusiness();

  const bizOrders = orders.filter((o) => o.businessId === activeBusiness?.id);
  const currency = activeBusiness?.currency || '$';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Historial de Pedidos de {activeBusiness?.name}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Registro de los pedidos enviados por clientes a través del carrito y WhatsApp.
        </p>
      </div>

      {bizOrders.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No hay pedidos registrados aún
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cuando los clientes hagan clic en &quot;Realizar pedido por WhatsApp&quot; desde la página pública, se registrarán automáticamente aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bizOrders.map((order) => {
            const cleanPhone = order.customerPhone.replace(/\D/g, '');
            const customerChatUrl = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(
              order.customerName
            )},%20te%20contactamos%20de%20${encodeURIComponent(
              activeBusiness?.name || 'la tienda'
            )}%20sobre%20tu%20pedido%20reciente.`;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 capitalize">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Info */}
                  <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.customerPhone}</span>
                    </div>
                    {order.deliveryAddress && (
                      <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                    )}
                    {order.notes && (
                      <div className="text-amber-600 dark:text-amber-400 italic pt-1">
                        &quot;{order.notes}&quot;
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Artículos Ordenados:
                    </div>
                    {order.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-slate-600 dark:text-slate-300 py-0.5 border-b border-dashed border-slate-100 dark:border-slate-800"
                      >
                        <span>
                          {it.quantity}x {it.productName}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {currency}{it.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                      <span>Total:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {currency}{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action: Contact customer on WhatsApp */}
                <div className="pt-2 flex justify-end">
                  <a
                    href={customerChatUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Contactar Cliente por WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
