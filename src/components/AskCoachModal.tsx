import React, { useState } from 'react';
import { X, HelpCircle, Send, Sparkles, MessageSquare } from 'lucide-react';

interface AskCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippet?: string;
  studentText: string;
}

export const AskCoachModal: React.FC<AskCoachModalProps> = ({
  isOpen,
  onClose,
  snippet,
  studentText,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/coach/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          contextSnippet: snippet || '',
          studentText,
        }),
      });

      if (!res.ok) {
        throw new Error('Fout bij het ophalen van het antwoord.');
      }

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setQuestion(q);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Stel een vraag aan de coach
              </h3>
              <p className="text-xs text-slate-400">
                Krijg gerichte uitleg in het Nederlands over grammatica, woordkeuze of register.
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {snippet && (
            <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700 text-xs">
              <div className="text-slate-400 font-semibold mb-1">Geselecteerd feedbackpunt:</div>
              <div className="text-slate-200 font-mono italic">{snippet}</div>
            </div>
          )}

          {/* Quick prompt suggestions */}
          <div className="space-y-1.5">
            <div className="text-xs text-slate-400">Snelle vragen:</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickQuestion('Waarom is dit fout in formeel Engels?')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
              >
                Waarom is dit fout in formeel Engels?
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion('Kun je een ander voorbeeld geven van deze regel?')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
              >
                Geef nog een voorbeeld van deze regel
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion('Wat is het verschil tussen deze twee opties?')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
              >
                Wat is het verschil tussen de opties?
              </button>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Jouw vraag:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="bv. Waarom moet ik hier 'for' gebruiken in plaats van 'since'?"
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Coach denkt na...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Vraag stellen</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Answer display */}
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/40 text-rose-300 rounded-xl text-xs">
              {error}
            </div>
          )}

          {answer && (
            <div className="bg-slate-800/90 border border-sky-500/30 rounded-xl p-4 space-y-2 mt-4">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Uitleg van de Coach</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {answer}
              </div>
            </div>
          )}
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
