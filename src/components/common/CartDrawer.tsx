import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Truck,
  MapPin,
  User,
  Phone,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Business } from '../../types';

interface CartDrawerProps {
  business: Business;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ business }) => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    total,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    deliveryAddress,
    setDeliveryAddress,
    orderNotes,
    setOrderNotes,
    sendWhatsAppOrder,
    generateWhatsAppMessage,
  } = useCart();

  const [showDetails, setShowDetails] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const currency = business.currency || '$';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#253745] text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Tu Pedido
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {business.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-medium transition-colors"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  El carrito está vacío
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Explora el catálogo o menú de {business.name} y agrega los productos que deseas ordenar.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-4 py-2 bg-[#253745] hover:bg-[#1c2a35] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-750 flex items-start gap-3"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {item.product.name}
                          </h4>
                          <span className="font-bold text-xs text-slate-900 dark:text-white shrink-0">
                            {currency}{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {currency}{item.product.price.toFixed(2)} c/u
                        </p>
                        {item.customNotes && (
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 italic truncate mt-0.5">
                            &quot;{item.customNotes}&quot;
                          </p>
                        )}

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1 text-slate-800 dark:text-white min-w-[18px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[11px] text-rose-500 hover:underline font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Customer Information Toggle */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full text-left flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#253745] dark:text-blue-400" />
                      Datos de Envío y Contacto (Opcional)
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                      {showDetails ? 'Ocultar' : 'Agregar'}
                    </span>
                  </button>

                  {showDetails && (
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2.5 border border-slate-200 dark:border-slate-700 animate-fade-in text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                          <User className="w-3 h-3" /> Tu Nombre:
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Laura Gómez"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Tu Teléfono:
                        </label>
                        <input
                          type="tel"
                          placeholder="Ej: +507 6123-4567"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Dirección de Entrega:
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Calle 50, Edif. Torre Marina Apto 4B"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Observaciones o Instrucciones:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Ej: Sin cebolla, llamar al llegar, factura con RUC..."
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp Message Preview Toggle */}
                <div className="pt-1">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
                  >
                    {showPreview ? 'Ocultar vista previa del mensaje' : 'Ver mensaje exacto que se enviará'}
                  </button>
                  {showPreview && (
                    <pre className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 text-[11px] rounded-xl border border-emerald-200 dark:border-emerald-800 whitespace-pre-wrap font-mono">
                      {generateWhatsAppMessage(business)}
                    </pre>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer with Totals and WhatsApp CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {currency}{subtotal.toFixed(2)}
                  </span>
                </div>

                {business.deliveryAvailable && deliveryAddress && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Costo de envío:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {currency}{(business.deliveryCost || 0).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Total a Pagar:</span>
                  <span className="text-base text-emerald-600 dark:text-emerald-400">
                    {currency}
                    {(
                      subtotal +
                      (business.deliveryAvailable && deliveryAddress ? business.deliveryCost || 0 : 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Main CTA: Realizar pedido por WhatsApp */}
              <button
                onClick={() => sendWhatsAppOrder(business)}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 transition-all shine-effect"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Realizar pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                Se abrirá tu WhatsApp con el mensaje pre-cargado para confirmar con {business.name}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
