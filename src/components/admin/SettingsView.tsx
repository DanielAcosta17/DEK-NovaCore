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
} from 'lucide-react';
import { firebaseStatus } from '../../firebase/config';
import { FIRESTORE_RULES_TEMPLATE, STORAGE_RULES_TEMPLATE } from '../../firebase/rules';
import { useBusiness } from '../../contexts/BusinessContext';

export const SettingsView: React.FC = () => {
  const { resetData } = useBusiness();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReset = () => {
    if (confirm('¿Deseas restablecer los datos de prueba iniciales (4 negocios, productos y categorías)?')) {
      resetData();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-xs">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Configuración del Sistema & Firebase
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
          Verifica la conexión con Google Cloud Firestore, reglas de seguridad y datos del entorno.
        </p>
      </div>

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
              Arquitectura Local-First con persistencia dual
            </span>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            firebaseStatus.isConfigured
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          {firebaseStatus.isConfigured ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold text-sm">
              {firebaseStatus.isConfigured
                ? `Conectado a Firebase Project: ${firebaseStatus.projectId}`
                : 'Modo Local-First Activo'}
            </div>
            <p className="mt-1 leading-relaxed opacity-90 text-[11px]">
              {firebaseStatus.isConfigured
                ? 'Todos los cambios en negocios, productos, categorías y pedidos se guardan y leen directamente de Cloud Firestore en la nube.'
                : 'La app utiliza almacenamiento optimizado con fallback local. Puedes añadir las credenciales en .env para sincronización permanente.'}
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
              <span className="text-slate-500">VITE_FIREBASE_PROJECT_ID:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {firebaseStatus.projectId || '(No configurado)'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between">
              <span className="text-slate-500">VITE_FIREBASE_AUTH_DOMAIN:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {firebaseStatus.authDomain || '(No configurado)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules quick copy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-slate-900 dark:text-white">
                Reglas de Firestore
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(FIRESTORE_RULES_TEMPLATE, 'fs')}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1"
            >
              {copiedKey === 'fs' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'fs' ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Reglas con política de menor privilegio. Lectura pública solo para negocios activos; escritura solo para administradores.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-900 dark:text-white">
                Reglas de Storage
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(STORAGE_RULES_TEMPLATE, 'st')}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1"
            >
              {copiedKey === 'st' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'st' ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Permite lectura pública de logos e imágenes de productos y restringe la subida a usuarios autenticados con límite de 5MB.
          </p>
        </div>
      </div>

      {/* Reset Data Section */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">
            Restablecer Datos de Demostración
          </h4>
          <p className="text-slate-500 mt-0.5">
            Restaura los 4 negocios iniciales (Pastelería, Restaurante, Moda, Ferretería) con sus fotos y productos.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2 shrink-0 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetDone ? 'animate-spin text-emerald-500' : ''}`} />
          <span>{resetDone ? 'Restablecido' : 'Restablecer'}</span>
        </button>
      </div>
    </div>
  );
};
