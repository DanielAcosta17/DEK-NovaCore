import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Lock,
  CloudUpload,
  Store,
  DollarSign,
  Phone,
  Truck,
  Clock,
  Megaphone,
  Trash2,
} from 'lucide-react';
import { firebaseStatus } from '../../firebase/config';
import { FIRESTORE_RULES_TEMPLATE, STORAGE_RULES_TEMPLATE } from '../../firebase/rules';
import { useBusiness } from '../../contexts/BusinessContext';

export const SettingsView: React.FC = () => {
  const {
    activeBusiness,
    updateBusiness,
    purgeAllData,
    resetData,
    syncAllToFirestore,
    lastFirestoreSyncTime,
  } = useBusiness();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Business settings state
  const [currency, setCurrency] = useState(activeBusiness?.currency || '$');
  const [whatsapp, setWhatsapp] = useState(activeBusiness?.whatsapp || '');
  const [deliveryCost, setDeliveryCost] = useState(activeBusiness?.deliveryCost?.toString() || '0');
  const [deliveryAvailable, setDeliveryAvailable] = useState(activeBusiness?.deliveryAvailable ?? true);
  const [schedule, setSchedule] = useState(activeBusiness?.schedule || '');
  const [featuredNotice, setFeaturedNotice] = useState(activeBusiness?.featuredNotice || '');
  const [isSavingBiz, setIsSavingBiz] = useState(false);
  const [saveBizFeedback, setSaveBizFeedback] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncAllToFirestore();
      setSyncFeedback(res.message);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 6000);
    }
  };

  const handleSaveBizSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness) return;
    setIsSavingBiz(true);
    try {
      await updateBusiness({
        ...activeBusiness,
        currency,
        whatsapp,
        deliveryCost: parseFloat(deliveryCost) || 0,
        deliveryAvailable,
        schedule,
        featuredNotice,
      });
      setSaveBizFeedback('Configuración guardada exitosamente en Cloud Firestore.');
      setTimeout(() => setSaveBizFeedback(null), 4000);
    } finally {
      setIsSavingBiz(false);
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        '¿Deseas dejar la web completamente en CERO (0)?\n\nEsta acción eliminará todos los negocios, categorías, productos y pedidos tanto de Firestore como de la memoria local para que tú mismo llenes la información desde cero.'
      )
    ) {
      setIsPurging(true);
      try {
        await purgeAllData();
        setResetDone(true);
        setTimeout(() => setResetDone(false), 4000);
      } finally {
        setIsPurging(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-xs">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Configuración & Firebase
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
          Conexión con Google Cloud Firestore, sincronización directa de datos y reglas de seguridad.
        </p>
      </div>

      {/* Sync to Firestore Hero Card */}
      <div className="bg-gradient-to-r from-[#253745] to-[#1d2b36] rounded-2xl p-6 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Sincronización Directa a Firestore
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Guarda todos los Negocios, Productos, Categorías y Pedidos directamente en las colecciones de Firestore.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Todo a Firestore'}</span>
          </button>
        </div>

        {lastFirestoreSyncTime && (
          <div className="text-[11px] text-blue-200/80 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Última sincronización a Firestore: {lastFirestoreSyncTime}</span>
          </div>
        )}

        {syncFeedback && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-semibold animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* Active Business Settings Form */}
      {activeBusiness && (
        <form
          onSubmit={handleSaveBizSettings}
          className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Ajustes Comerciales de &quot;{activeBusiness.name}&quot;
                </h3>
                <span className="text-[11px] text-slate-500">
                  Se guardan directamente en el documento de Firestore: <code>businesses/{activeBusiness.id}</code>
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingBiz}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSavingBiz ? 'Guardando...' : 'Guardar en Firestore'}</span>
            </button>
          </div>

          {saveBizFeedback && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{saveBizFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Símbolo de Moneda
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="$ o € o S/ o MXN"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Teléfono / WhatsApp para Pedidos
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+52 55 1234 5678"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                Costo de Envío a Domicilio ({currency})
              </label>
              <input
                type="number"
                step="0.5"
                value={deliveryCost}
                onChange={(e) => setDeliveryCost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Horario de Atención
              </label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Lun-Sáb 9:00 AM - 8:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-slate-400" />
                Aviso Destacado o Promo en la Tienda Pública
              </label>
              <input
                type="text"
                value={featuredNotice}
                onChange={(e) => setFeaturedNotice(e.target.value)}
                placeholder="¡Envío gratis en compras mayores a $25! Usa el código..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </form>
      )}

      {/* Firebase Status Card */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#253745] text-white flex items-center justify-center shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Estado de Google Firebase (Firestore & Auth)
            </h3>
            <span className="text-[11px] text-slate-500">
              Conectado a proyecto: <strong>dek-novacore</strong>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-3.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm">
              Conectado a Firebase Project: {firebaseStatus.projectId}
            </div>
            <p className="mt-1 leading-relaxed opacity-90 text-[11px]">
              Todos los cambios en negocios, productos, categorías y pedidos se guardan directamente en Cloud Firestore.
            </p>
          </div>
        </div>

        {/* Variables details */}
        <div className="space-y-2 pt-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Variables de Entorno Detectadas:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between">
              <span className="text-slate-500">PROJECT_ID:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {firebaseStatus.projectId}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between">
              <span className="text-slate-500">AUTH_DOMAIN:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {firebaseStatus.authDomain}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules full preview and copy */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Reglas de Seguridad Cloud Firestore
                </span>
                <p className="text-[11px] text-slate-500">
                  Copia estas reglas y pégalas en Firebase Console &gt; Firestore Database &gt; pestaña &quot;Reglas&quot; (Rules).
                </p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(FIRESTORE_RULES_TEMPLATE, 'fs')}
              className="px-3 py-1.5 rounded-xl bg-[#253745] hover:bg-[#1a2630] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {copiedKey === 'fs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'fs' ? '¡Copiado con Éxito!' : 'Copiar Reglas Firestore'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-56">
            {FIRESTORE_RULES_TEMPLATE}
          </pre>
        </div>

        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-500" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Reglas de Seguridad Firebase Storage
                </span>
                <p className="text-[11px] text-slate-500">
                  Pega estas reglas en Firebase Console &gt; Storage &gt; pestaña &quot;Reglas&quot; (Rules).
                </p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(STORAGE_RULES_TEMPLATE, 'st')}
              className="px-3 py-1.5 rounded-xl bg-[#253745] hover:bg-[#1a2630] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {copiedKey === 'st' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'st' ? '¡Copiado con Éxito!' : 'Copiar Reglas Storage'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-sky-400 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-48">
            {STORAGE_RULES_TEMPLATE}
          </pre>
        </div>
      </div>

      {/* Reset Data Section / Dejar en 0 */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Poner Plataforma en Cero (0)
            </h4>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed max-w-xl">
            Elimina por completo todos los negocios, productos, categorías y pedidos tanto de Firestore como del almacenamiento local, para que la web quede 100% limpia y comiences a llenarla con tu propia información.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={isPurging}
          className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 transition-colors shadow-sm"
        >
          <Trash2 className={`w-3.5 h-3.5 ${isPurging ? 'animate-spin' : ''}`} />
          <span>{isPurging ? 'Eliminando...' : resetDone ? '¡Limpieza en 0 Exitosa!' : 'Eliminar Todo y Dejar en 0'}</span>
        </button>
      </div>
    </div>
  );
};

