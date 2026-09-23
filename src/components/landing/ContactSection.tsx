import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Restaurante / Cafetería');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct WhatsApp message
    const msg = `Hola *D. E. K NovaCore*, quiero solicitar información para digitalizar mi negocio:\n\n` +
      `▪ *Nombre:* ${name.trim() || 'No especificado'}\n` +
      `▪ *Negocio:* ${businessName.trim() || 'No especificado'}\n` +
      `▪ *Tipo:* ${businessType}\n` +
      `▪ *Teléfono:* ${phone.trim() || 'No especificado'}\n` +
      (message.trim() ? `▪ *Mensaje:* ${message.trim()}\n\n` : '\n') +
      `_Enviado desde el formulario web de deknovacore.com_`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/50760244779?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left information */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#253745] dark:text-blue-400">
                Hablemos de tu Proyecto
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                ¿Listo para lanzar el catálogo o menú de tu negocio?
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Escríbenos directamente o completa el formulario. Te responderemos en minutos para asesorarte en la mejor plantilla y configuración para tu marca.
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <a
                href="https://wa.me/50760244779?text=Hola%20D.%20E.%20K%20NovaCore,%20quiero%20m%C3%A1s%20informaci%C3%B3n"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3.5 text-emerald-900 dark:text-emerald-200 hover:scale-[1.01] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-sm">WhatsApp Directo</div>
                  <div className="text-[11px] opacity-80">+507 6024-4779 (Atención Rápida)</div>
                </div>
              </a>

              <a
                href="mailto:danielacostaperez17@gmail.com"
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3.5 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Correo Electrónico de Contacto</div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">danielacostaperez17@gmail.com</div>
                </div>
              </a>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Horario de Soporte</div>
                  <div className="text-[11px] text-slate-500">Lunes a Sábado: 8:00 AM - 7:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-750 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Solicita tu Sitio o Catálogo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Completa tus datos y te enviaremos una propuesta inmediata por WhatsApp.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    ¡Mensaje Abierto en WhatsApp!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                    Tu solicitud ha sido formateada. Presiona enviar en WhatsApp y nuestro equipo te responderá enseguida.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline pt-2"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Carlos Santana"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253745]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre de tu Negocio *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Panadería El Sol"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253745]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tipo de Negocio *
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253745]"
                      >
                        <option value="Restaurante / Cafetería">Restaurante / Cafetería</option>
                        <option value="Pastelería / Repostería">Pastelería / Repostería</option>
                        <option value="Tienda de Ropa / Moda">Tienda de Ropa / Moda</option>
                        <option value="Ferretería / Materiales">Ferretería / Materiales</option>
                        <option value="Barbería / Salón de Belleza">Barbería / Salón de Belleza</option>
                        <option value="Supermercado / Mini Market">Supermercado / Mini Market</option>
                        <option value="Tienda de Accesorios / Regalos">Tienda de Accesorios / Regalos</option>
                        <option value="Tecnología / Accesorios">Tecnología / Accesorios</option>
                        <option value="Otro Emprendimiento">Otro Emprendimiento</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tu Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+507 6000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253745]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ¿Qué necesitas? (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Cuéntanos sobre tus productos o servicios, cuántos productos tienes, si necesitas código QR para mesas, etc."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253745]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shine-effect"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Enviar Solicitud por WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
