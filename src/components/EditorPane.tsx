import React, { useRef } from 'react';
import {
  Send,
  Trash2,
  Copy,
  Sparkles,
  FileText,
  Check,
  RotateCcw,
  AlertTriangle,
  Eye,
  Edit3
} from 'lucide-react';
import { MarkedIssue, TextSegment } from '../utils/textHighlighter';
import { MarkedTextView } from './MarkedTextView';

interface EditorPaneProps {
  text: string;
  setText: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isRevision: boolean;
  versionNumber: number;
  onCancelRevision: () => void;
  onOpenSamples: () => void;
  hasFeedback?: boolean;
  isMarkedViewActive?: boolean;
  onToggleMarkedView?: () => void;
  markedIssues?: MarkedIssue[];
  segments?: TextSegment[];
  onApplyCorrection?: (targetText: string, replacement: string) => void;
  onAskCoach?: (snippet: string) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  text,
  setText,
  onSubmit,
  isLoading,
  isRevision,
  versionNumber,
  onCancelRevision,
  onOpenSamples,
  hasFeedback = false,
  isMarkedViewActive = false,
  onToggleMarkedView,
  markedIssues = [],
  segments = [],
  onApplyCorrection,
  onAskCoach,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Statistics
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0;
  const readingTimeSec = Math.ceil((words / 150) * 60);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (text.length > 50) {
      if (window.confirm('Weet je zeker dat je het invoerveld wilt leegmaken?')) {
        setText('');
      }
    } else {
      setText('');
    }
  };

  // Live quick detector for common spelling & mechanics traps
  const liveSpellingAlerts = React.useMemo(() => {
    if (!text || text.length < 5) return [];
    const alerts: string[] = [];
    if (/\balot\b/i.test(text)) alerts.push('"alot" -> "a lot"');
    if (/\bwich\b/i.test(text)) alerts.push('"wich" -> "which"');
    if (/\buntill\b/i.test(text)) alerts.push('"untill" -> "until"');
    if (/\bsuccesfull\b|\bsuccessfull\b/i.test(text)) alerts.push('"succesfull" -> "successful"');
    if (/\ballready\b/i.test(text)) alerts.push('"allready" -> "already"');
    if (/\bdefinately\b/i.test(text)) alerts.push('"definately" -> "definitely"');
    if (/\b(i)\b/.test(text)) alerts.push('kleine "i" -> hoofdletter "I"');
    if (/\b(english)\b/.test(text)) alerts.push('"english" -> "English"');
    if (/\b(dutch)\b/.test(text)) alerts.push('"dutch" -> "Dutch"');
    if (/\b(don't|can't|won't|it's|isn't)\b/i.test(text)) alerts.push('samentrekkingen vermijden');
    return alerts;
  }, [text]);

  // If marked view is active and we have feedback, show the interactive MarkedTextView
  if (isMarkedViewActive && onToggleMarkedView) {
    return (
      <MarkedTextView
        segments={segments.length > 0 ? segments : [{ text }]}
        issues={markedIssues}
        onApplyCorrection={onApplyCorrection}
        onBackToEdit={onToggleMarkedView}
        onAskCoach={onAskCoach}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Top Banner with exact instructed greeting & mode */}
      <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/80 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>English Writing Coach – 5 HAVO</span>
            {isRevision ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Revisie Versie {versionNumber}
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Nieuwe tekst
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRevision
              ? 'Pas de suggesties van de coach toe in je tekst en dien je revisie in.'
              : 'Paste your own English text below. I will check it and help you improve it yourself.'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {isRevision && (
            <button
              onClick={onCancelRevision}
              className="text-xs px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
              title="Terug naar eerste versie"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Annuleer revisie</span>
            </button>
          )}

          {text && (
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
              title="Kopieer tekst"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          )}

          {text && (
            <button
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition-colors"
              title="Wis tekst"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* PROMINENT TOGGLE BUTTON: Bekijk tekst met gemarkeerde fouten */}
      {hasFeedback && onToggleMarkedView && (
        <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-200">
              Foutenanalyse voltooid
            </span>
          </div>

          <button
            onClick={onToggleMarkedView}
            className="text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg flex items-center gap-2 bg-gradient-to-r from-rose-600 via-amber-600 to-sky-600 hover:from-rose-500 hover:to-sky-500 text-white border border-rose-400/60 shadow-rose-950/40 hover:scale-[1.02] active:scale-[0.98]"
            title="Bekijk je tekst met alle gevonden fouten gemarkeerd in kleur"
          >
            <Eye className="w-4 h-4 text-white" />
            <span>🎯 Bekijk tekst met gemarkeerde fouten</span>
            {markedIssues.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[11px] font-bold">
                {markedIssues.length} {markedIssues.length === 1 ? 'fout' : 'fouten'}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Revision alert guidance */}
      {isRevision && (
        <div className="bg-emerald-950/30 border-b border-emerald-800/40 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              <strong>Revisie-modus:</strong> De coach vergelijkt deze tekst met je vorige versie en start direct met <code>### Progress</code>.
            </span>
          </div>
        </div>
      )}

      {/* Text Area */}
      <div className="relative flex-1 p-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Paste your English text here...\n\nExample:\nDear Mr Smith,\n\nI am writing to apply for the position...`}
          className="w-full h-full min-h-[300px] p-4 bg-slate-950/60 text-slate-100 rounded-xl border border-slate-800/80 focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 focus:outline-none resize-none font-sans text-sm leading-relaxed placeholder:text-slate-600 transition-all"
        />

        {!text && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300 max-w-sm mb-1">
              Plak of typ hier je Engelse tekst voor 5 HAVO
            </p>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              De coach controleert o.a. Spelling, Grammar, Vocabulary, Variation, Coherence, Contractions en Formal Language.
            </p>
          </div>
        )}
      </div>

      {/* Live quick spelling trap alerts */}
      {liveSpellingAlerts.length > 0 && (
        <div className="bg-amber-950/30 border-t border-amber-800/40 px-3 py-1.5 text-[11px] text-amber-300 flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Snelle spellingsignalen:</span>
          </span>
          {liveSpellingAlerts.map((alert, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded bg-amber-900/40 border border-amber-700/50 font-mono">
              {alert}
            </span>
          ))}
        </div>
      )}

      {/* Footer with metrics & Submit button */}
      <div className="bg-slate-950/90 px-4 py-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Statistics metrics */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div>
            <span className="text-slate-500">Woorden: </span>
            <span className="font-bold text-slate-200">{words}</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-500">Alinea&apos;s: </span>
            <span className="font-bold text-slate-200">{paragraphs}</span>
          </div>
          <div className="hidden md:block">
            <span className="text-slate-500">Leestijd: </span>
            <span className="font-bold text-slate-200">~{readingTimeSec}s</span>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center gap-2">
          {hasFeedback && onToggleMarkedView && (
            <button
              onClick={onToggleMarkedView}
              className="text-xs font-medium px-3 py-2 rounded-xl text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 transition-colors flex items-center gap-1.5"
              title="Toon de tekst met gemarkeerde fouten"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Gemarkeerde tekst</span>
            </button>
          )}

          <button
            onClick={onSubmit}
            disabled={!text.trim() || isLoading}
            className={`font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md ${
              !text.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : isRevision
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40'
                : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-sky-950/40'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Coach analyseert tekst...</span>
              </>
            ) : isRevision ? (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Beoordeel herziene versie</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Beoordeel mijn tekst</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
