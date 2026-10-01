import React from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  versionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  versionCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity matching exact prompt heading */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center shadow-inner font-bold text-lg text-white">
            EN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-2">
                English Writing Coach
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  5 HAVO
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              B1 / B2 Onderwijsfeedback • Taakconventies • Auteurschap blijft bij de leerling
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {versionCount > 1 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Versie {versionCount}
            </span>
          )}

          <button
            onClick={onReset}
            className="text-xs font-medium px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 border border-slate-800 hover:border-rose-900/50"
            title="Nieuwe tekst beginnen"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nieuwe tekst</span>
          </button>
        </div>
      </div>
    </header>
  );
};
