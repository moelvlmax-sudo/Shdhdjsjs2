import React, { useState } from 'react';
import { 
  Search, Shield, ShieldCheck, User as UserIcon, LogOut, PlusCircle, 
  Newspaper, Download, Sun, CloudSun, CloudRain, RefreshCw, X 
} from 'lucide-react';
import { Category, User, DbStatusInfo } from '../types';
import { triggerDbReconnect } from '../api';

interface HeaderProps {
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdminPanel: (articleToEdit?: any) => void;
  dbStatus?: DbStatusInfo | null;
  onRefreshDbStatus?: () => void;
}

const CATEGORIES: Category[] = [
  'Todas',
  'Local',
  'Comunidad',
  'Deportes',
  'Cultura',
  'Seguridad',
  'Economía',
  'Medio Ambiente'
];

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  user,
  onOpenAuth,
  onLogout,
  onOpenAdminPanel,
  dbStatus,
  onRefreshDbStatus,
}) => {
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isMongoOk = dbStatus?.connected === true && dbStatus?.type === 'mongo_atlas';
  const hasDbError = !isMongoOk && Boolean(
    dbStatus?.message && (
      dbStatus.message.toLowerCase().includes('error') ||
      dbStatus.message.toLowerCase().includes('incorrecto') ||
      dbStatus.message.toLowerCase().includes('inválid') ||
      dbStatus.message.toLowerCase().includes('fall') ||
      dbStatus.message.toLowerCase().includes('solicitud') ||
      dbStatus.message.toLowerCase().includes('failed')
    )
  );

  // Status: green (atlas ok), red (atlas error/bad URI), yellow (local fallback)
  const weatherMode: 'green' | 'red' | 'yellow' = isMongoOk
    ? 'green'
    : hasDbError
    ? 'red'
    : 'yellow';

  const handleSyncDb = async () => {
    setIsSyncing(true);
    try {
      await triggerDbReconnect();
      if (onRefreshDbStatus) {
        await onRefreshDbStatus();
      }
    } catch (e) {
      console.warn('Error syncing DB:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header id="header-main" className="border-b border-stone-200 bg-[#fcfbf9] sticky top-0 z-30 shadow-xs">
      {/* Top utility ticker bar */}
      <div id="header-top-bar" className="border-b border-stone-200 text-xs text-stone-600 px-4 py-1.5 bg-stone-100/70">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="capitalize font-medium text-stone-800">{currentDate}</span>
            <span className="hidden sm:inline text-stone-400">|</span>
            <span className="hidden sm:inline">Edición Diaria • Ciudad y Región</span>
            <span className="text-stone-400">|</span>

            {/* Disguised weather widget reflecting database state */}
            <button
              id="weather-widget-btn"
              type="button"
              onClick={() => setShowWeatherModal(!showWeatherModal)}
              title="Condiciones meteorológicas & sincronización del servidor"
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                weatherMode === 'green'
                  ? 'text-emerald-800 bg-emerald-50/90 border-emerald-200 hover:bg-emerald-100'
                  : weatherMode === 'red'
                  ? 'text-rose-900 bg-rose-50/90 border-rose-300 hover:bg-rose-100 animate-pulse'
                  : 'text-amber-900 bg-amber-50/90 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {weatherMode === 'green' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-emerald-600" />
                  <span>22°C Despejado</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </>
              ) : weatherMode === 'red' ? (
                <>
                  <CloudRain className="w-3.5 h-3.5 text-rose-600" />
                  <span>18°C Inestable</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                </>
              ) : (
                <>
                  <CloudSun className="w-3.5 h-3.5 text-amber-600" />
                  <span>20°C Parcial</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">

            {/* Download project ZIP */}
            <a
              id="btn-download-zip"
              href="/api/download-zip"
              download="los-internacionalitos.zip"
              title="Descargar código fuente completo en archivo .ZIP"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Descargar .ZIP</span>
            </a>

            {/* User auth state */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'superadmin' ? (
                  <span className="bg-amber-100 text-amber-950 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-800" /> Superadmin
                  </span>
                ) : user.role === 'admin' ? (
                  <span className="bg-stone-200 text-stone-900 border border-stone-300 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> Admin
                  </span>
                ) : null}
                <span className="font-medium text-stone-800 hidden sm:inline">{user.name}</span>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="text-stone-500 hover:text-red-700 p-1 rounded-md transition-colors flex items-center gap-1 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Salir</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-open-login"
                onClick={onOpenAuth}
                className="flex items-center gap-1 text-stone-800 hover:text-red-800 font-semibold transition-colors text-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Ingresar / Registrarse</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Newspaper Masthead */}
      <div id="header-masthead" className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col items-center justify-center border-b border-stone-200">
        <div className="w-full flex items-center justify-between">
          <div className="w-28 hidden lg:block text-xs text-stone-500 leading-tight">
            Fundado para la comunidad.<br />Periodismo veraz y cercano.
          </div>

          <div className="flex-1 text-center">
            <h1 className="font-brand text-3xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-wider uppercase hover:opacity-95 transition-opacity cursor-pointer select-none">
              Los Internacionalitos
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm font-editorial italic mt-1 tracking-wide">
              Noticiero Local & Crónica Comunitaria • Información en tiempo real
            </p>
          </div>

          <div className="w-32 hidden lg:flex flex-col items-end gap-1.5">
            {(user?.role === 'admin' || user?.role === 'superadmin') ? (
              <button
                id="btn-masthead-admin"
                onClick={() => onOpenAdminPanel()}
                className="bg-red-900 hover:bg-red-950 text-white text-xs font-semibold px-3 py-1.5 rounded-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{user.role === 'superadmin' ? 'Gestión & Redacción' : 'Redactar'}</span>
              </button>
            ) : (
              <div className="text-xs text-right text-stone-500 leading-tight">
                Noticias verificadas.<br />Acceso libre y público.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation & Search toolbar */}
      <div id="header-nav-toolbar" className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none" aria-label="Categorías">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap px-3 py-1 rounded-sm text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-transparent text-stone-700 hover:bg-stone-200/80 hover:text-stone-950'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        {/* Search bar & Admin Action */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="search-articles-input"
              type="text"
              placeholder="Buscar noticias, autores..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-sm pl-8 pr-7 py-1 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <button
              id="btn-admin-panel"
              onClick={() => onOpenAdminPanel()}
              className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-1 text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{user.role === 'superadmin' ? 'Panel Superadmin' : 'Panel Admin'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Disguised Weather / Server Database Diagnostics Modal */}
      {showWeatherModal && (
        <div
          id="weather-diagnostic-modal"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-stone-950/40 backdrop-blur-xs"
          onClick={() => setShowWeatherModal(false)}
        >
          <div
            className="bg-white border border-stone-300 shadow-2xl rounded-xs w-full max-w-md p-5 text-stone-900 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xs ${
                  weatherMode === 'green'
                    ? 'bg-emerald-100 text-emerald-700'
                    : weatherMode === 'red'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {weatherMode === 'green' ? (
                    <Sun className="w-5 h-5" />
                  ) : weatherMode === 'red' ? (
                    <CloudRain className="w-5 h-5" />
                  ) : (
                    <CloudSun className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-editorial font-bold text-base text-stone-900 leading-tight">
                    Estación & Estado de Conexión
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {weatherMode === 'green'
                      ? 'Atlas sincronizado • Operación normal'
                      : weatherMode === 'red'
                      ? 'Alerta • Incidencia en MongoDB Atlas'
                      : 'Modo local de contingencia'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWeatherModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Diagnostic Alert Box */}
            <div
              className={`p-3.5 rounded-xs text-xs border leading-relaxed space-y-1.5 ${
                weatherMode === 'green'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : weatherMode === 'red'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="font-bold flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  weatherMode === 'green'
                    ? 'bg-emerald-600'
                    : weatherMode === 'red'
                    ? 'bg-rose-600 animate-pulse'
                    : 'bg-amber-600'
                }`} />
                <span>
                  {weatherMode === 'green'
                    ? 'MongoDB Atlas en línea (Verde)'
                    : weatherMode === 'red'
                    ? 'Fallo o formato inválido en Atlas (Rojo)'
                    : 'Almacenamiento Local (Amarillo)'}
                </span>
              </div>
              <p className="text-[11px] text-stone-700 font-mono break-words leading-normal bg-white/80 p-2 rounded-xs border border-stone-200/60">
                {dbStatus?.message || 'Iniciando diagnóstico...'}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-xs border border-stone-200">
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                  Motor de datos
                </span>
                <span className="font-bold text-stone-900">
                  {dbStatus?.type === 'mongo_atlas' ? 'MongoDB Atlas Cloud' : 'Almacenamiento Local'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                  Artículos / Usuarios
                </span>
                <span className="font-bold text-stone-900">
                  {dbStatus?.collectionCounts?.news ?? 0} noticias • {dbStatus?.collectionCounts?.users ?? 0} usuarios
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowWeatherModal(false)}
                className="text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleSyncDb}
                disabled={isSyncing}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Verificando...' : 'Reintentar sincronización'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
