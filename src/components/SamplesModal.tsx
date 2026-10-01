import React from 'react';
import { X, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { SAMPLE_TASKS } from '../data/samples';
import { SampleTask } from '../types';

interface SamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleTask) => void;
}

export const SamplesModal: React.FC<SamplesModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                5 HAVO Oefenopdrachten
              </h3>
              <p className="text-xs text-slate-400">
                Kies een authentieke voorbeeldtekst met typische B1/B2 leerlingfouten om de coach te testen.
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

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {SAMPLE_TASKS.map((sample) => (
            <div
              key={sample.id}
              className="bg-slate-800/60 border border-slate-700/70 hover:border-sky-500/50 rounded-xl p-4 sm:p-5 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-100">
                    {sample.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/60 font-medium">
                      {sample.genre}
                    </span>
                    <span className="text-xs text-slate-400">
                      Doel: {sample.wordTarget}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectSample(sample)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Laad deze tekst</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                {sample.description}
              </p>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 line-clamp-3">
                {sample.sampleText}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
