import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  Sparkles,
  Edit3,
  HelpCircle,
  Eye,
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';
import { MarkedIssue, TextSegment } from '../utils/textHighlighter';

interface MarkedTextViewProps {
  segments: TextSegment[];
  issues: MarkedIssue[];
  onApplyCorrection?: (targetText: string, replacement: string) => void;
  onBackToEdit: () => void;
  onAskCoach?: (snippet: string) => void;
}

export const MarkedTextView: React.FC<MarkedTextViewProps> = ({
  segments,
  issues,
  onApplyCorrection,
  onBackToEdit,
  onAskCoach,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<MarkedIssue | null>(
    issues.length > 0 ? issues[0] : null
  );
  const [appliedIssues, setAppliedIssues] = useState<Record<string, boolean>>({});

  const handleApply = (issue: MarkedIssue) => {
    if (issue.suggestion && onApplyCorrection) {
      onApplyCorrection(issue.targetText, issue.suggestion);
      setAppliedIssues((prev) => ({ ...prev, [issue.id]: true }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl overflow-hidden animate-fadeIn">
      {/* Top Banner with prominent badge & back button */}
      <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100">
                Gemarkeerde Tekst
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {issues.length} {issues.length === 1 ? 'fout' : 'fouten'} gemarkeerd
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Klik op een gemarkeerd woord om de uitleg en de verbetering van de coach te zien.
            </p>
          </div>
        </div>

        {/* Back to Edit Button */}
        <button
          onClick={onBackToEdit}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-all flex items-center gap-1.5 shadow-sm border border-slate-600"
          title="Terug naar tekstbewerking"
        >
          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
          <span>Terug naar bewerken</span>
        </button>
      </div>

      {/* Color Legend Bar */}
      <div className="bg-slate-950/70 px-4 py-2 border-b border-slate-800 text-[11px] flex flex-wrap items-center gap-3">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-500" />
          <span>Legenda:</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-800/40">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <span>Spelling &amp; Hoofdletters</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>Grammatica</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/40">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Samentrekkingen</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800/40">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>Woordenschat / Valse vrienden</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-800/40">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          <span>Formeel register</span>
        </span>
      </div>

      {/* Main Text Container with Highlights */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 text-slate-100 text-sm font-sans leading-relaxed whitespace-pre-wrap select-text">
          {segments.map((seg, idx) => {
            if (!seg.issue) {
              return <span key={idx}>{seg.text}</span>;
            }

            const issue = seg.issue;
            const isSelected = selectedIssue?.id === issue.id;
            const isApplied = appliedIssues[issue.id];

            return (
              <mark
                key={idx}
                onClick={() => setSelectedIssue(issue)}
                className={`relative px-1 py-0.5 rounded transition-all font-medium ${
                  issue.colorClass
                } ${isSelected ? 'ring-2 ring-sky-400 font-bold scale-[1.02]' : ''} ${
                  isApplied ? 'line-through opacity-50' : ''
                }`}
                title={`Klik voor uitleg: ${issue.categoryName}`}
              >
                {seg.text}
                <span className="sr-only"> ({issue.categoryName})</span>
              </mark>
            );
          })}
        </div>

        {/* Selected Issue Detail Card */}
        {selectedIssue ? (
          <div className="bg-slate-800/95 border-2 border-sky-500/40 rounded-xl p-4 shadow-xl text-xs space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px] border ${selectedIssue.badgeBg} ${selectedIssue.badgeText}`}
                >
                  {selectedIssue.categoryName}
                </span>
                <span className="text-slate-400">Gemarkeerd fragment:</span>
                <code className="px-1.5 py-0.5 rounded bg-slate-950 text-sky-300 font-bold text-xs border border-slate-700">
                  &quot;{selectedIssue.targetText}&quot;
                </code>
              </div>

              {selectedIssue.suggestion && onApplyCorrection && (
                <button
                  onClick={() => handleApply(selectedIssue)}
                  disabled={appliedIssues[selectedIssue.id]}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    appliedIssues[selectedIssue.id]
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                  title="Pas deze correctie toe in je tekst"
                >
                  {appliedIssues[selectedIssue.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Toegepast!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Vervang door &quot;{selectedIssue.suggestion}&quot;</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <p>{selectedIssue.explanation}</p>
            </div>

            <div className="flex items-center justify-between text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                {selectedIssue.suggestion && (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Voorgestelde aanpassing: <strong>&quot;{selectedIssue.suggestion}&quot;</strong></span>
                  </span>
                )}
              </div>

              {onAskCoach && (
                <button
                  onClick={() => onAskCoach(selectedIssue.targetText)}
                  className="text-sky-400 hover:text-sky-300 text-[11px] flex items-center gap-1 hover:underline"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Vraag de coach om toelichting</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/40 rounded-xl p-3 text-center text-xs text-slate-400 border border-slate-800">
            Klik op een gemarkeerd woord in de tekst hierboven om de toelichting van de coach te bekijken.
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>
          Tip: Je kunt de suggesties bekijken en direct terugkeren om je revisie verder uit te werken.
        </span>
        <button
          onClick={onBackToEdit}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Verder bewerken</span>
        </button>
      </div>
    </div>
  );
};
