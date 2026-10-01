import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Copy,
  Check,
  RotateCw,
  GitCompare,
  BookOpen,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ParsedFeedback, CategoryKey, ParsedCategory, FeedbackIssue } from '../types';
import { RUBRIC_CATEGORIES } from '../data/rubricData';

interface FeedbackDashboardProps {
  parsedFeedback: ParsedFeedback;
  rawMarkdown: string;
  isStreaming: boolean;
  onStartRevision: () => void;
  onCompareVersions: () => void;
  onAskCoach: (snippet?: string) => void;
  canCompare: boolean;
  versionNumber: number;
  onToggleMarkedView?: () => void;
  isMarkedViewActive?: boolean;
  markedIssuesCount?: number;
}

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({
  parsedFeedback,
  rawMarkdown,
  isStreaming,
  onStartRevision,
  onCompareVersions,
  onAskCoach,
  canCompare,
  versionNumber,
  onToggleMarkedView,
  isMarkedViewActive,
  markedIssuesCount,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'markdown' | 'checklist'>('cards');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [resolvedIssues, setResolvedIssues] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleIssueResolved = (id: string) => {
    setResolvedIssues((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const allIssues = getAllIssues();
      const resolvedCount = Object.values(next).filter(Boolean).length;
      if (allIssues.length > 0 && resolvedCount === allIssues.length) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      return next;
    });
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to extract all actionable issues across categories
  const getAllIssues = (): { categoryTitle: string; issue: FeedbackIssue }[] => {
    const list: { categoryTitle: string; issue: FeedbackIssue }[] = [];
    const catKeys: (keyof ParsedFeedback)[] = [
      'spelling',
      'grammar',
      'vocabulary',
      'variation',
      'coherence',
      'contractions',
      'formalLanguage',
    ];

    catKeys.forEach((key) => {
      const cat = parsedFeedback[key] as ParsedCategory | undefined;
      if (cat && !cat.hasNoIssues && cat.issues) {
        cat.issues.forEach((iss) => {
          list.push({ categoryTitle: cat.title, issue: iss });
        });
      }
    });
    return list;
  };

  const allIssues = getAllIssues();
  const totalIssuesCount = allIssues.length;
  const resolvedIssuesCount = allIssues.filter((item) => resolvedIssues[item.issue.id]).length;

  const categoryList: { key: CategoryKey; cat?: ParsedCategory; iconColor: string }[] = [
    { key: 'spelling', cat: parsedFeedback.spelling, iconColor: 'text-amber-400' },
    { key: 'grammar', cat: parsedFeedback.grammar, iconColor: 'text-rose-400' },
    { key: 'vocabulary', cat: parsedFeedback.vocabulary, iconColor: 'text-blue-400' },
    { key: 'variation', cat: parsedFeedback.variation, iconColor: 'text-purple-400' },
    { key: 'coherence', cat: parsedFeedback.coherence, iconColor: 'text-emerald-400' },
    { key: 'contractions', cat: parsedFeedback.contractions, iconColor: 'text-orange-400' },
    { key: 'formal_language', cat: parsedFeedback.formalLanguage, iconColor: 'text-indigo-400' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Top Header / View controls */}
      <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Feedbackrapport</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                Versie {versionNumber}
              </span>
              {isStreaming && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  Analyseren...
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'cards'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overzicht &amp; Kaarten
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'checklist'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Checklist</span>
              {totalIssuesCount > 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-500/30 text-indigo-300 rounded-full text-[10px]">
                  {resolvedIssuesCount}/{totalIssuesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('markdown')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'markdown'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ruwe Tekst
            </button>
          </div>

          <button
            onClick={handleCopyMarkdown}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
            title="Kopieer feedbackrapport"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {canCompare && (
            <button
              onClick={onCompareVersions}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Bekijk de verschillen met de vorige versie"
            >
              <GitCompare className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Diff</span>
            </button>
          )}

          {rawMarkdown && onToggleMarkedView && (
            <button
              onClick={onToggleMarkedView}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-md flex items-center gap-1.5 border ${
                isMarkedViewActive
                  ? 'bg-sky-600 hover:bg-sky-500 text-white border-sky-400'
                  : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white border-rose-400/60 shadow-rose-900/30'
              }`}
              title="Bekijk de tekst waarin alle fouten gemarkeerd zijn"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isMarkedViewActive ? 'Sluit markeringen' : 'Gemarkeerde tekst'}</span>
              {markedIssuesCount !== undefined && markedIssuesCount > 0 && !isMarkedViewActive && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
                  {markedIssuesCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onStartRevision}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-md flex items-center gap-1.5"
            title="Start een revisie met deze feedback"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Herzie tekst</span>
          </button>
        </div>
      </div>

      {/* Main Feedback Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* EMPTY STATE: Waiting for student text */}
        {!rawMarkdown && !isStreaming && (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-100">
                English Writing Coach – 5 HAVO
              </h3>
              <p className="text-sm text-sky-300 font-medium">
                Paste your own English text below. I will check it and help you improve it yourself.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto pt-1">
                Zodra je links op <strong>&apos;Beoordeel mijn tekst&apos;</strong> klikt, verschijnt hier direct je gestructureerde feedback volgens het 5 HAVO beoordelingsmodel.
              </p>
            </div>

            {/* Preview of the 7 review categories */}
            <div className="w-full bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 text-left space-y-3">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Vaste beoordelingsvolgorde:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>1. Wat gaat al goed?</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>2. Drie aandachtspunten</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span>3. Spelling &amp; Interpunctie</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  <span>4. Grammar (Grammatica)</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span>5. Vocabulary (Woordenschat)</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span>6. Variation &amp; Coherence</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  <span>7. Contractions &amp; Formeel</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  <span>Zelfstandige revisie</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOADING STATE: While analysis is generating */}
        {!rawMarkdown && isStreaming && (
          <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-6 max-w-md mx-auto">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin flex items-center justify-center"></div>
              <div className="absolute inset-0 flex items-center justify-center text-sky-400 font-bold text-sm">
                5 HAVO
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-100 animate-pulse">
                Coach beoordeelt je Engelse tekst...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Beoordelingsmodel controleren op B1/B2 niveau, grammatica, register en de 7 categorieën.
              </p>
            </div>

            <div className="w-full bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 space-y-2 text-xs text-slate-300 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Sterke punten en prioriteiten bepalen...</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span>Spelling, samentrekkingen en woordvolgorde nakijken...</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span>Direct bruikbare feedback in het Nederlands opstellen...</span>
              </div>
            </div>
          </div>
        )}

        {/* CHECKLIST VIEW */}
        {activeTab === 'checklist' && rawMarkdown && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Revisie Voortgang</span>
                </h3>
                <span className="text-xs font-mono font-medium text-emerald-300">
                  {totalIssuesCount > 0
                    ? `${Math.round((resolvedIssuesCount / totalIssuesCount) * 100)}% voltooid`
                    : '100%'}
                </span>
              </div>
              <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                  style={{
                    width: `${totalIssuesCount > 0 ? (resolvedIssuesCount / totalIssuesCount) * 100 : 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Vink de verbeterpunten aan zodra je ze hebt aangepast in je herziene versie.
              </p>
            </div>

            {allIssues.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-200">Geweldig geschreven!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Er zijn geen directe verbeterpunten aangetroffen in de 7 categorieën.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {allIssues.map(({ categoryTitle, issue }) => {
                  const isDone = !!resolvedIssues[issue.id];
                  return (
                    <div
                      key={issue.id}
                      onClick={() => toggleIssueResolved(issue.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-800/40 opacity-75'
                          : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="mt-0.5">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                              : 'border-slate-600 bg-slate-900'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-300">{categoryTitle}</span>
                          {issue.quote && (
                            <span className="font-mono bg-slate-900/80 text-amber-300 px-1.5 py-0.5 rounded border border-slate-700/50">
                              {issue.quote}
                            </span>
                          )}
                        </div>
                        <p className={`text-slate-300 leading-relaxed ${isDone ? 'line-through text-slate-500' : ''}`}>
                          {issue.rawText}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAskCoach(issue.rawText);
                        }}
                        className="text-[11px] text-sky-400 hover:text-sky-300 bg-sky-950/40 border border-sky-800/40 px-2 py-1 rounded transition-colors flex items-center gap-1 shrink-0"
                        title="Vraag om uitleg over deze regel"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Vraag</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* RAW MARKDOWN VIEW */}
        {activeTab === 'markdown' && (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-sans text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {rawMarkdown}
          </div>
        )}

        {/* STRUCTURED CARDS VIEW */}
        {activeTab === 'cards' && rawMarkdown && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Error banner if rawMarkdown indicates error */}
            {(rawMarkdown.includes('Er is een fout opgetreden') || rawMarkdown.includes('**Fout**:')) && (
              <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 text-xs sm:text-sm text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Er kon geen volledige feedback gegenereerd worden</span>
                </div>
                <p className="leading-relaxed text-slate-300 whitespace-pre-wrap">{rawMarkdown}</p>
                <button
                  onClick={onStartRevision}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                >
                  Opnieuw proberen
                </button>
              </div>
            )}

            {/* LIVE STREAMING BANNER: Displays incoming tokens in real-time */}
            {isStreaming && (
              <div className="bg-sky-950/40 border border-sky-500/40 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                  <span>Coach formuleert live de feedback (5 HAVO B1/B2)...</span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                  {rawMarkdown}
                </div>
              </div>
            )}

            {/* If streaming or not yet parsed into standard headings, show readable text directly */}
            {!parsedFeedback.strengths && !parsedFeedback.priorities && !isStreaming && (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {rawMarkdown}
              </div>
            )}

            {/* 1. PROGRESS SECTION (WHEN REVISED) */}
            {parsedFeedback.progress && (
              <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2.5 mb-3 text-emerald-300">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-emerald-200">
                    {parsedFeedback.progress.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Vergelijking met eerdere versie
                  </span>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pl-1">
                  {parsedFeedback.progress.rawContent}
                </div>
              </div>
            )}

            {/* 2. WAT GAAT AL GOED? (STRENGTHS) */}
            {parsedFeedback.strengths && (
              <div className="bg-slate-800/80 border border-sky-500/30 rounded-2xl p-5 shadow-md">
                <div className="flex items-center gap-2.5 mb-3 text-sky-300">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-base text-sky-200">
                    {parsedFeedback.strengths.title}
                  </h3>
                  <span className="text-xs text-slate-400">
                    (2 of 3 concrete sterke punten)
                  </span>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pl-1">
                  {parsedFeedback.strengths.rawContent}
                </div>
              </div>
            )}

            {/* 3. DRIE AANDACHTSPUNTEN (PRIORITIES) */}
            {parsedFeedback.priorities && (
              <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-5 shadow-md">
                <div className="flex items-center gap-2.5 mb-3 text-amber-300">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-amber-200">
                    {parsedFeedback.priorities.title}
                  </h3>
                  <span className="text-xs text-slate-400">
                    (Belangrijkste 3 prioriteiten voor 5 HAVO)
                  </span>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pl-1">
                  {parsedFeedback.priorities.rawContent}
                </div>
              </div>
            )}

            {/* CATEGORY FILTER TABS */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  De 7 Verplichte Beoordelingscategorieën
                </h4>
                <span className="text-xs text-slate-500">
                  Volgens document.xml beoordelingsmodel
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pb-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Alle 7 Categorieën
                </button>
                {categoryList.map(({ key, cat }) => {
                  const title = cat ? cat.title.replace(/^###\s*/, '') : key;
                  const isClean = cat?.hasNoIssues;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedFilter(key)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                        selectedFilter === key
                          ? 'bg-slate-700 text-white ring-1 ring-sky-500'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{title}</span>
                      {isClean ? (
                        <span className="text-emerald-400 text-xs">✓</span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7 CATEGORY CARDS */}
            <div className="space-y-4">
              {categoryList
                .filter(({ key }) => selectedFilter === 'all' || selectedFilter === key)
                .map(({ key, cat, iconColor }) => {
                  if (!cat) return null;
                  const rubric = RUBRIC_CATEGORIES.find((r) => r.key === key);

                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-4 transition-all ${
                        cat.hasNoIssues
                          ? 'bg-slate-900/60 border-emerald-900/40 hover:border-emerald-700/50'
                          : 'bg-slate-800/90 border-slate-700/80 hover:border-slate-600 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                            <span>{cat.title}</span>
                            {rubric && (
                              <span className="text-[11px] font-normal text-slate-400">
                                ({rubric.nameDutch})
                              </span>
                            )}
                          </h4>
                        </div>

                        {cat.hasNoIssues ? (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Geen fouten gevonden ✓</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onAskCoach(cat.rawContent)}
                              className="text-[11px] text-sky-400 hover:text-sky-300 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                              title="Vraag uitleg over deze categorie"
                            >
                              <HelpCircle className="w-3 h-3" />
                              <span>Vraag de coach</span>
                            </button>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-800/40">
                              Aandachtspunten
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pl-1 font-sans">
                        {cat.rawContent}
                      </div>

                      {rubric?.havoTip && !cat.hasNoIssues && (
                        <div className="mt-3 pt-2.5 border-t border-slate-700/50 text-xs text-slate-400 flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg">
                          <span className="font-semibold text-sky-400 shrink-0">5 HAVO Tip:</span>
                          <span>{rubric.havoTip}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* CLOSING CALL TO ACTION */}
            {parsedFeedback.conclusion && (
              <div className="bg-slate-800/60 border border-indigo-500/30 rounded-2xl p-4 text-xs sm:text-sm text-indigo-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="leading-relaxed">{parsedFeedback.conclusion}</p>
                </div>
                <button
                  onClick={onStartRevision}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shrink-0 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Revisie starten</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
