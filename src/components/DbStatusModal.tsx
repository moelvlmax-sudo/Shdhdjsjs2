import React, { useState } from 'react';
import { 
  X, Database, CheckCircle2, AlertTriangle, RefreshCw, Copy, Check, 
  ExternalLink, Key, Globe, Shield, ArrowRight 
} from 'lucide-react';
import { DbStatusInfo, User } from '../types';
import { testMongoAtlasUriApi, connectMongoAtlasUriApi, triggerDbReconnect } from '../api';

interface DbStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbStatus: DbStatusInfo | null;
  onRefreshDbStatus: () => Promise<void>;
  currentUser?: User | null;
}

export const DbStatusModal: React.FC<DbStatusModalProps> = ({
  isOpen,
  onClose,
  dbStatus,
  onRefreshDbStatus,
  currentUser,
}) => {
  const [customUri, setCustomUri] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectMessage, setConnectMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [copiedExample, setCopiedExample] = useState(false);

  if (!isOpen) return null;

  const isConnected = dbStatus?.connected === true && dbStatus?.type === 'mongo_atlas';
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const exampleUri = 'mongodb+srv://<tu_usuario>:lRhAlcaCAgMXTxqqdhC7RBHbdaGTkzVV@cluster0.abcde.mongodb.net/los_internacionalitos?retryWrites=true&w=majority';

  const handleTestConnection = async () => {
    if (!customUri.trim()) {
      setTestResult({
        ok: false,
        message: 'Por favor, ingrese la cadena de conexión completa antes de probar.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setConnectMessage(null);

    try {
      const res = await testMongoAtlasUriApi(customUri.trim());
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err.message || 'Error al verificar conexión con MongoDB Atlas.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleApplyConnection = async () => {
    if (!customUri.trim()) return;
    setIsConnecting(true);
    setConnectMessage(null);

    try {
      const res = await connectMongoAtlasUriApi(customUri.trim());
      if (res.success && res.status.connected) {
        setConnectMessage({ text: '¡Conexión establecida exitosamente con MongoDB Atlas!' });
        await onRefreshDbStatus();
      } else {
        setConnectMessage({
          text: res.status.message || 'No se pudo conectar a MongoDB Atlas con la URI indicada.',
          isError: true,
        });
      }
    } catch (err: any) {
      setConnectMessage({
        text: err.message || 'Error al aplicar la conexión con MongoDB Atlas.',
        isError: true,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRefresh = async () => {
    setIsConnecting(true);
    try {
      await triggerDbReconnect();
      await onRefreshDbStatus();
    } catch (err) {
      console.warn('Error refrescando conexión:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  return (
    <div
      id="db-status-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white text-stone-900 w-full max-w-2xl my-8 rounded-xs shadow-2xl border border-stone-300 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xs ${isConnected ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                Infraestructura & Datos
              </span>
              <h3 className="font-editorial text-xl font-bold">
                Estado de Base de Datos y MongoDB Atlas
              </h3>
            </div>
          </div>
          <button
            id="btn-close-db-modal"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Current Status Badge */}
          <div
            className={`p-4 rounded-xs border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isConnected
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/80 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {isConnected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {isConnected
                    ? 'Conectado activamente a MongoDB Atlas'
                    : 'Operando en Almacenamiento Local Persistente'}
                </p>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {dbStatus?.message || 'Iniciando comprobación de estado...'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs font-medium text-stone-700">
                  <span>📰 Noticias en base: <strong>{dbStatus?.collectionCounts?.news ?? 0}</strong></span>
                  <span>•</span>
                  <span>👥 Usuarios registrados: <strong>{dbStatus?.collectionCounts?.users ?? 0}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isConnecting}
              className="bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
              <span>Verificar</span>
            </button>
          </div>

          {/* MongoDB Atlas Configuration Helper */}
          <div className="bg-stone-50 border border-stone-200 rounded-xs p-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-stone-600" />
              Guía de conexión con MongoDB Atlas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white border border-emerald-200 rounded-xs p-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  1. IP Admitida (0.0.0.0/0)
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  ¡Ya configuraste <strong>0.0.0.0/0</strong> en Network Access! El clúster ya permite el tráfico entrante.
                </p>
              </div>

              <div className="bg-white border border-amber-200 rounded-xs p-3">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                  <Key className="w-3.5 h-3.5" />
                  2. Contraseña de Usuario
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  La clave generada es solo la contraseña. Debe ir <strong>dentro</strong> de la URL, no como variable única.
                </p>
              </div>

              <div className="bg-white border border-blue-200 rounded-xs p-3">
                <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1">
                  <Database className="w-3.5 h-3.5" />
                  3. URI Completa
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Copia en Atlas: <em>Database → Connect → Drivers</em> la cadena que comienza con <code>mongodb+srv://</code>.
                </p>
              </div>
            </div>

            {/* Example Format */}
            <div className="mt-2 bg-stone-900 text-stone-200 p-3 rounded-xs text-xs font-mono">
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1 font-sans">
                <span>Formato requerido para MONGODB_URI:</span>
                <button
                  onClick={() => copyToClipboard(exampleUri)}
                  className="text-stone-400 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  {copiedExample ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedExample ? 'Copiado' : 'Copiar formato'}</span>
                </button>
              </div>
              <p className="break-all select-all text-amber-300">
                mongodb+srv://<span className="text-emerald-300">&lt;usuario&gt;</span>:<span className="text-pink-300">&lt;password&gt;</span>@cluster0.xxxx.mongodb.net/los_internacionalitos?retryWrites=true&w=majority
              </p>
            </div>
          </div>

          {/* Interactive Connection / Testing Form */}
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <Key className="w-4 h-4 text-stone-600" />
              Probar o vincular nueva cadena de conexión
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Pega tu URI completa de MongoDB Atlas:
              </label>
              <textarea
                value={customUri}
                onChange={(e) => setCustomUri(e.target.value)}
                placeholder="mongodb+srv://tu_usuario:tu_password@cluster0.xxxx.mongodb.net/los_internacionalitos?retryWrites=true&w=majority"
                rows={2}
                className="w-full bg-white border border-stone-300 rounded-xs p-2 text-xs font-mono text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Test result display */}
            {testResult && (
              <div
                className={`p-3 rounded-xs text-xs border flex items-start gap-2 ${
                  testResult.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Apply result display */}
            {connectMessage && (
              <div
                className={`p-3 rounded-xs text-xs border flex items-start gap-2 ${
                  !connectMessage.isError
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {!connectMessage.isError ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                )}
                <span>{connectMessage.text}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !customUri.trim()}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-semibold px-3 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Verificando ping...' : 'Probar Conexión'}</span>
              </button>

              {isSuperAdmin ? (
                <button
                  type="button"
                  onClick={handleApplyConnection}
                  disabled={isConnecting || !customUri.trim()}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <span>{isConnecting ? 'Conectando...' : 'Conectar y Guardar en App'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <p className="text-[11px] text-stone-500 italic">
                  * Para aplicar la conexión directamente desde este diálogo, inicia sesión con la cuenta de Superadministrador (<code>moelvlmax@gmail.com</code>).
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
