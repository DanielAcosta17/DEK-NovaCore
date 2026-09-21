import React, { useState } from 'react';
import {
  X,
  Database,
  ShieldCheck,
  HardDrive,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { firebaseStatus } from '../../firebase/config';
import { FIRESTORE_RULES_TEMPLATE, STORAGE_RULES_TEMPLATE } from '../../firebase/rules';

interface FirebaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'firestore' | 'storage' | 'guide'>('status');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const envTemplate = `# Configuración de Firebase para D. E. K NovaCore
VITE_FIREBASE_API_KEY="${firebaseStatus.apiKey || 'AIzaSy...'}"
VITE_FIREBASE_AUTH_DOMAIN="${firebaseStatus.authDomain || 'tu-proyecto.firebaseapp.com'}"
VITE_FIREBASE_PROJECT_ID="${firebaseStatus.projectId || 'tu-proyecto-id'}"
VITE_FIREBASE_STORAGE_BUCKET="${firebaseStatus.storageBucket || 'tu-proyecto.appspot.com'}"
VITE_FIREBASE_MESSAGING_SENDER_ID="${firebaseStatus.messagingSenderId || '123456789'}"
VITE_FIREBASE_APP_ID="${firebaseStatus.appId || '1:123456789:web:abcdef'}"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#253745] text-white flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Centro de Conexión Firebase
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cloud Firestore, Authentication y Cloud Storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/30 dark:bg-slate-850">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'status'
                ? 'border-[#253745] text-[#253745] dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Estado de Variables (.env)
          </button>
          <button
            onClick={() => setActiveTab('firestore')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'firestore'
                ? 'border-[#253745] text-[#253745] dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Reglas de Firestore
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'storage'
                ? 'border-[#253745] text-[#253745] dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            Reglas de Storage
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-[#253745] text-[#253745] dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Paso a Paso
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'status' && (
            <div className="space-y-5">
              {/* Status Banner */}
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
                  <h4 className="text-sm font-bold">
                    {firebaseStatus.isConfigured
                      ? 'Conexión Activa con Firebase'
                      : 'Modo Local-First Activo (Sin credenciales en .env)'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {firebaseStatus.isConfigured
                      ? `Conectado al proyecto "${firebaseStatus.projectId}". Las altas y bajas se sincronizan en Cloud Firestore en tiempo real.`
                      : 'La plataforma está completamente funcional con almacenamiento local optimizado y datos de prueba. Para sincronización en la nube, añade tus variables de entorno.'}
                  </p>
                </div>
              </div>

              {/* Variables checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Variables de Entorno Requeridas:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'VITE_FIREBASE_API_KEY', val: firebaseStatus.apiKey },
                    { key: 'VITE_FIREBASE_AUTH_DOMAIN', val: firebaseStatus.authDomain },
                    { key: 'VITE_FIREBASE_PROJECT_ID', val: firebaseStatus.projectId },
                    { key: 'VITE_FIREBASE_STORAGE_BUCKET', val: firebaseStatus.storageBucket },
                    { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', val: firebaseStatus.messagingSenderId },
                    { key: 'VITE_FIREBASE_APP_ID', val: firebaseStatus.appId },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200 truncate mr-2">
                        {item.key}
                      </span>
                      {item.val ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" /> Configurado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          Pendiente
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy template block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Plantilla para archivo .env
                  </span>
                  <button
                    onClick={() => copyToClipboard(envTemplate, 'env')}
                    className="text-xs text-[#253745] dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'env' ? '¡Copiado!' : 'Copiar bloque .env'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  {envTemplate}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'firestore' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Reglas de Seguridad Cloud Firestore
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pega estas reglas en la consola de Firebase &gt; Firestore Database &gt; Rules
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(FIRESTORE_RULES_TEMPLATE, 'firestore')}
                  className="px-3 py-1.5 bg-[#253745] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  {copiedKey === 'firestore' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'firestore' ? 'Copiado' : 'Copiar Reglas'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                {FIRESTORE_RULES_TEMPLATE}
              </pre>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Reglas de Seguridad Firebase Storage
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pega estas reglas en Firebase &gt; Storage &gt; Rules
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(STORAGE_RULES_TEMPLATE, 'storage')}
                  className="px-3 py-1.5 bg-[#253745] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  {copiedKey === 'storage' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'storage' ? 'Copiado' : 'Copiar Reglas'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-sky-400 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                {STORAGE_RULES_TEMPLATE}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  1. Crear proyecto en Firebase Console
                </span>
                <p className="mt-1">
                  Ingresa a{' '}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5"
                  >
                    console.firebase.google.com <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  y presiona &quot;Crear un proyecto&quot; (ej: D. E. K NovaCore).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  2. Habilitar Firestore, Authentication & Storage
                </span>
                <p className="mt-1">
                  - En <b>Firestore Database</b>, haz clic en Crear base de datos en modo de prueba o producción.<br />
                  - En <b>Authentication</b>, habilita el proveedor <b>Email/Password</b>.<br />
                  - En <b>Storage</b>, crea el bucket para imágenes de catálogo y portadas.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  3. Registrar App Web y Obtener Credenciales
                </span>
                <p className="mt-1">
                  En la rueda de engranaje &gt; <b>Project Settings</b> &gt; <b>Your apps</b> &gt; Agregar app web (&lt;/&gt;). Copia los valores de apiKey, projectId, appId, etc., y colócalos en tu archivo <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">.env</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  4. ¡Listo! La sincronización será automática
                </span>
                <p className="mt-1">
                  Al recargar, el sistema detectará las credenciales y comenzará a sincronizar catálogos, productos, pedidos y fotos en tiempo real con la nube.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#253745] hover:bg-[#1a2630] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Entendido y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
