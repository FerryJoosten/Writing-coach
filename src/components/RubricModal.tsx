import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle, ArrowRight, Table, ShieldCheck } from 'lucide-react';
import { RUBRIC_CATEGORIES, LINKING_WORDS } from '../data/rubricData';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RubricModal: React.FC<RubricModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'linking' | 'rules'>('categories');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>Beoordelingsmodel 5 HAVO</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  document.xml richtlijnen
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Criteria voor B1/B2 niveau, taakeisen, de 7 verplichte categorieën en schoolonderzoek schrijfvaardigheid.
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

        {/* Tab Bar */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'categories'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            De 7 Vaste Categorieën
          </button>
          <button
            onClick={() => setActiveTab('linking')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'linking'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Verbindingswoorden (Linking Words)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'rules'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Belangrijke Examenregels &amp; Auteurschap
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {RUBRIC_CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                      <span className="text-sky-400 font-mono text-xs uppercase px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60">
                        {cat.badge}
                      </span>
                      <span>{cat.nameDutch}</span>
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                    <div className="font-semibold text-slate-400">Waar let de docent op:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {cat.criteria.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {cat.examples && cat.examples.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-semibold text-slate-400">Typische 5 HAVO voorbeelden:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {cat.examples.map((ex, i) => (
                          <div key={i} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
                            <div className="text-rose-400 line-through">✗ {ex.wrong}</div>
                            <div className="text-emerald-400 font-medium">✓ {ex.right}</div>
                            <div className="text-[11px] text-slate-400">{ex.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs bg-indigo-950/30 border border-indigo-800/40 p-2.5 rounded-lg text-indigo-300">
                    <strong>5 HAVO Tip:</strong> {cat.havoTip}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'linking' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Een tekst op B1/B2 niveau vereist duidelijke samenhang tussen alinea&apos;s en zinnen. Gebruik deze signaalwoorden om je tekst soepel te laten lopen:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LINKING_WORDS.map((lw, idx) => (
                  <div key={idx} className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-4">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 mb-2">
                      {lw.category}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {lw.words.map((w, wIdx) => (
                        <span
                          key={wIdx}
                          className="text-xs px-2.5 py-1 rounded-md bg-slate-900 text-slate-200 border border-slate-700/60 font-medium"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                <div className="font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Het Auteurschapsprincipe (De leerling blijft auteur)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  De writing coach herschrijft NOOIT je hele tekst of hele alinea&apos;s. De coach geeft gerichte correcties en concrete alternatieven voor woorden, zinsdelen en zinnen. Jij past de feedback zelfstandig toe om je schrijfvaardigheid echt te verbeteren.
                </p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                <div className="font-bold text-slate-100">Contractions in Formele Schrijfopdrachten</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In formele brieven, sollicitaties, recensies en betogen worden samentrekkingen zoals <code>don&apos;t</code>, <code>can&apos;t</code>, <code>it&apos;s</code> en <code>I&apos;m</code> als stijlfout aangemerkt. Schrijf ze altijd voluit: <code>do not</code>, <code>cannot</code>, <code>it is</code>, <code>I am</code>.
                </p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                <div className="font-bold text-slate-100">Geen Cijfer of Voorspelling</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Conform de onderwijsrichtlijnen berekent of voorspelt de coach nooit een cijfer (zoals een 6.5 of 8). De focus ligt 100% op formatieve feedback: <em>Wat gaat al goed?</em> en <em>Drie concrete aandachtspunten</em> om direct te verbeteren.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Begrepen, terug naar coach
          </button>
        </div>
      </div>
    </div>
  );
};
