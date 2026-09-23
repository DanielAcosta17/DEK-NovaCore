import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  QrCode,
  Check,
  X,
  Palette,
  Image as ImageIcon,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Business, TemplateType } from '../../types';
import { useBusiness } from '../../contexts/BusinessContext';
import { AVAILABLE_TEMPLATES } from '../../data/initialData';
import { QRCodeModal } from '../common/QRCodeModal';

interface BusinessManagerViewProps {
  isCreateOpenInitially?: boolean;
}

export const BusinessManagerView: React.FC<BusinessManagerViewProps> = ({
  isCreateOpenInitially = false,
}) => {
  const {
    businesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    toggleBusinessActive,
    goToPublicStore,
    setSelectedBusinessId,
    selectedBusinessId,
    purgeAllData,
  } = useBusiness();

  const [isModalOpen, setIsModalOpen] = useState(isCreateOpenInitially);
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [qrBiz, setQrBiz] = useState<Business | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    slug: '',
    businessType: 'Restaurante / Cafetería',
    tagline: '',
    description: '',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    phone: '+507 6024-4779',
    whatsapp: '50760244779',
    address: 'Ciudad de Panamá',
    schedule: 'Lunes a Sábado: 11:00 AM - 10:00 PM',
    instagram: '',
    facebook: '',
    primaryColor: '#253745',
    template: 'restaurant',
    currency: '$',
    deliveryAvailable: true,
    deliveryCost: 3.0,
    featuredNotice: '',
    isActive: true,
  });

  const openCreateModal = () => {
    setEditingBiz(null);
    setFormData({
      name: '',
      slug: '',
      businessType: 'Restaurante / Cafetería',
      tagline: 'Lo mejor en sabor y calidad',
      description: 'Bienvenido a nuestro menú digital interactivo.',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      phone: '+507 6024-4779',
      whatsapp: '50760244779',
      address: 'Ciudad de Panamá',
      schedule: 'Lunes a Sábado: 10:00 AM - 9:00 PM',
      instagram: '@minegocio',
      facebook: '',
      primaryColor: '#253745',
      template: 'restaurant',
      currency: '$',
      deliveryAvailable: true,
      deliveryCost: 2.5,
      featuredNotice: '¡Envío gratis en compras mayores a $25!',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (biz: Business) => {
    setEditingBiz(biz);
    setFormData({ ...biz });
    setIsModalOpen(true);
  };

  const handleNameChange = (nameVal: string) => {
    const rawSlug = nameVal
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: editingBiz ? prev.slug : rawSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (editingBiz) {
      await updateBusiness({
        ...editingBiz,
        ...(formData as Business),
      });
    } else {
      await createBusiness(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (biz: Business) => {
    if (confirm(`¿Estás seguro de eliminar el negocio "${biz.name}"? Esta acción no se puede deshacer.`)) {
      await deleteBusiness(biz.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Gestor de Negocios y Clientes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Crea y administra sitios web independientes para cada uno de tus clientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {businesses.length > 0 && (
            <button
              onClick={() => {
                if (
                  confirm(
                    '¿Deseas eliminar TODOS los negocios, productos y pedidos de Firestore y dejar la plataforma en CERO (0)?'
                  )
                ) {
                  purgeAllData();
                }
              }}
              className="py-2.5 px-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              title="Eliminar todo de Firestore y dejar la web en 0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar Todo (0)</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="py-2.5 px-4 bg-[#253745] hover:bg-[#1a2630] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Negocio</span>
          </button>
        </div>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {businesses.length === 0 ? (
          <div className="col-span-full p-10 text-center bg-white dark:bg-slate-850 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white">Aún no hay negocios creados</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              La plataforma está en 0. Haz clic en "Crear Nuevo Negocio" para registrar tu primer catálogo o menú digital con enlace a WhatsApp y código QR.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#253745] hover:bg-[#1a2630] text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Crear mi primer negocio</span>
            </button>
          </div>
        ) : (
          businesses.map((biz) => {
          const isSelected = selectedBusinessId === biz.id;
          return (
            <div
              key={biz.id}
              className={`bg-white dark:bg-slate-850 rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-sm ${
                isSelected
                  ? 'border-[#253745] dark:border-blue-500 ring-2 ring-[#253745]/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Cover and header */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-800">
                  <img
                    src={biz.coverUrl}
                    alt={biz.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        biz.isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {biz.isActive ? 'Activo' : 'Pausado'}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 flex items-center gap-2.5">
                    <img
                      src={biz.logoUrl}
                      alt={biz.name}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-white bg-white shadow-sm"
                    />
                    <div className="text-white">
                      <h3 className="text-xs font-bold leading-tight drop-shadow truncate max-w-[180px]">
                        {biz.name}
                      </h3>
                      <span className="text-[10px] opacity-80 capitalize">
                        Plantilla: {biz.template}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2 text-xs">
                  <div className="text-[11px] font-mono text-slate-500 truncate">
                    /negocio/{biz.slug}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                    {biz.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <MessageCircle className="w-3 h-3 text-emerald-500" /> WhatsApp
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <Palette className="w-3 h-3" style={{ color: biz.primaryColor }} /> {biz.primaryColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedBusinessId(biz.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#253745] text-white'
                        : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Seleccionado' : 'Seleccionar'}
                  </button>
                  <button
                    onClick={() => setQrBiz(biz)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Ver Código QR"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => goToPublicStore(biz.slug)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Abrir Sitio Público"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(biz)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Editar Negocio"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(biz)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Eliminar Negocio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Add / Edit Business Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#253745] text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {editingBiz ? `Editar Negocio: ${editingBiz.name}` : 'Crear Nuevo Negocio / Cliente'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Configura la identidad, plantilla y datos de contacto para la página web
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Row 1: Name and Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Negocio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Dulce Encanto Pastelería"
                    value={formData.name || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enlace / Slug Público (URL) *
                  </label>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5">
                    <span className="text-slate-400 text-[11px] font-mono">/negocio/</span>
                    <input
                      type="text"
                      required
                      placeholder="dulce-encanto"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="w-full px-1 py-2 bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Business Type & Template */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rubro / Tipo de Negocio *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Pastelería Artesanal, Restaurante, Boutique"
                    value={formData.businessType || ''}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Plantilla Visual de Diseño *
                  </label>
                  <select
                    value={formData.template || 'general'}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value as TemplateType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  >
                    {AVAILABLE_TEMPLATES.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name} ({tmpl.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline and Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Eslogan / Frase Destacada
                </label>
                <input
                  type="text"
                  placeholder="Ej: Postres hechos a mano con amor"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción General del Negocio
                </label>
                <textarea
                  rows={2}
                  placeholder="Explica qué ofreces, especialidades, historia breve..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                />
              </div>

              {/* Logo URL and Cover URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    URL del Logotipo
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  />
                  {formData.logoUrl && (
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="w-10 h-10 rounded-lg object-cover mt-2 border border-slate-200"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    URL Imagen de Portada (Banner)
                  </label>
                  <input
                    type="url"
                    value={formData.coverUrl || ''}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  />
                </div>
              </div>

              {/* Contact Information: WhatsApp & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp para Pedidos (Sin signos +, ej: 50760000000) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="50760000000"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono Fijo / Móvil de Llamadas
                  </label>
                  <input
                    type="text"
                    placeholder="+507 6000-0000"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  />
                </div>
              </div>

              {/* Address and Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección Física
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Calle 50, San Francisco, Panamá"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    placeholder="Lunes a Domingo: 8:00 AM - 8:00 PM"
                    value={formData.schedule || ''}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                  />
                </div>
              </div>

              {/* Color picker & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color Primario de Marca
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor || '#253745'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || '#253745'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Símbolo de Moneda
                  </label>
                  <select
                    value={formData.currency || '$'}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="$">Dólares ($ USD / B/.)</option>
                    <option value="€">Euros (€ EUR)</option>
                    <option value="MXN $">Pesos Mexicanos (MXN $)</option>
                    <option value="COL $">Pesos Colombianos (COL $)</option>
                    <option value="S/">Soles Peruanos (S/)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Costo de Entrega / Delivery
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.deliveryCost ?? 3}
                    onChange={(e) => setFormData({ ...formData, deliveryCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Announcement Bar */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Anuncio Destacado (Opcional en la parte superior)
                </label>
                <input
                  type="text"
                  placeholder="Ej: ¡2x1 en cafés todos los jueves! o Envío gratis este fin de semana"
                  value={formData.featuredNotice || ''}
                  onChange={(e) => setFormData({ ...formData, featuredNotice: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#253745]"
                />
              </div>

              {/* Footer Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#253745] hover:bg-[#1a2630] text-white font-bold rounded-xl shadow-md transition-all"
                >
                  {editingBiz ? 'Guardar Cambios' : 'Crear Negocio Ahora'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal for selected business */}
      {qrBiz && (
        <QRCodeModal
          business={qrBiz}
          isOpen={!!qrBiz}
          onClose={() => setQrBiz(null)}
        />
      )}
    </div>
  );
};
