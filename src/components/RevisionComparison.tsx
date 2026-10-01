import React from 'react';
import { X, GitCompare, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { computeWordDiff } from '../utils/diffHelper';

interface RevisionComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  oldText: string;
  newText: string;
  oldVersionNum: number;
  newVersionNum: number;
  progressSummary?: string;
}

export const RevisionComparison: React.FC<RevisionComparisonProps> = ({
  isOpen,
  onClose,
  oldText,
  newText,
  oldVersionNum,
  newVersionNum,
  progressSummary,
}) => {
  if (!isOpen) return null;

  const diffTokens = computeWordDiff(oldText, newText);

  const oldWordCount = oldText.trim() ? oldText.trim().split(/\s+/).length : 0;
  const newWordCount = newText.trim() ? newText.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>Versievergelijking</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  V{oldVersionNum} → V{newVersionNum}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Bekijk direct welke zinsdelen zijn aangepast tussen de twee versies.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Progress note from coach if present */}
          {progressSummary && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Coach Voortgangsbeoordeling</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {progressSummary}
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
              <span className="text-slate-400">Versie {oldVersionNum} woorden:</span>
              <span className="font-mono font-bold text-slate-200">{oldWordCount}</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
              <span className="text-slate-400">Versie {newVersionNum} woorden:</span>
              <span className="font-mono font-bold text-emerald-400">{newWordCount}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50"></span>
              <span>Toegevoegd / Verbeterd</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-rose-500/30 border border-rose-500/50"></span>
              <span>Verwijderd / Vervangen</span>
            </div>
          </div>

          {/* Diff View */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-sm leading-relaxed font-sans whitespace-pre-wrap">
            {diffTokens.map((token, idx) => {
              if (token.type === 'added') {
                return (
                  <span
                    key={idx}
                    className="bg-emerald-950/80 text-emerald-300 border-b border-emerald-500 px-0.5 rounded font-medium"
                  >
                    {token.value}
                  </span>
                );
              }
              if (token.type === 'removed') {
                return (
                  <span
                    key={idx}
                    className="bg-rose-950/60 text-rose-400 line-through px-0.5 rounded opacity-75"
                  >
                    {token.value}
                  </span>
                );
              }
              return <span key={idx} className="text-slate-300">{token.value}</span>;
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-xl text-xs font-semibold transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
