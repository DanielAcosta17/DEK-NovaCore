import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Check,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { Product, Business } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  business,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addToCart, openCart } = useCart();

  if (!isOpen || !product) return null;

  const currency = business.currency || '$';

  const handleAdd = () => {
    addToCart(product, quantity, notes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
      openCart();
    }, 400);
  };

  const handleQuickWhatsApp = () => {
    const cleanPhone = business.whatsapp.replace(/\D/g, '');
    const lineTotal = (product.price * quantity).toFixed(2);
    let msg = `Hola *${business.name}*, me interesa ordenar directamente este producto:\n\n`;
    msg += `▪ *${product.name}*\n`;
    msg += `▪ Cantidad: ${quantity}\n`;
    msg += `▪ Precio: ${currency}${lineTotal}\n`;
    if (notes.trim()) {
      msg += `▪ Nota o especificación: ${notes.trim()}\n`;
    }
    msg += `\n¿Tienen disponibilidad para entrega?`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100 dark:bg-slate-800">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isFeatured && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-[11px] font-extrabold uppercase tracking-wide rounded-full shadow-md">
              Destacado
            </div>
          )}
          {product.comparePrice && (
            <div className="absolute top-4 right-14 px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-full shadow">
              Oferta
            </div>
          )}
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {product.name}
              </h2>
              <div className="text-right shrink-0">
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {currency}{product.price.toFixed(2)}
                </div>
                {product.comparePrice && (
                  <div className="text-xs text-slate-400 line-through">
                    {currency}{product.comparePrice.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {product.sku && (
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Cód: {product.sku} {product.unit ? `• Unidad: ${product.unit}` : ''}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description || 'Sin descripción adicional para este producto.'}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Special instructions / notes */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Indicaciones especiales o personalización:
            </label>
            <input
              type="text"
              placeholder="Ej: Término medio, sin azúcar, talla M, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
            />
          </div>

          {/* Quantity and Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-full sm:w-auto justify-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAdd}
              disabled={!product.isAvailable}
              className={`flex-1 w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                !product.isAvailable
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#253745] hover:bg-[#1a2630] text-white hover:scale-[1.01]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Agregado al carrito!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Agregar al Pedido • {currency}{(product.price * quantity).toFixed(2)}
                  </span>
                </>
              )}
            </button>

            {/* Direct WhatsApp fast order */}
            <button
              onClick={handleQuickWhatsApp}
              title="Pedir directamente este producto por WhatsApp"
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
