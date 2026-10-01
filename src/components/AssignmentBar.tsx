import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { AssignmentDetails } from '../types';

interface AssignmentBarProps {
  assignment: AssignmentDetails;
  onChange: (updated: AssignmentDetails) => void;
  currentWordCount: number;
}

const GENRES = [
  'Formal Letter / Email',
  'Opinion Essay',
  'Article',
  'Review (Book / Film)',
  'Formal Report',
  'Informal Email',
  'Overig / Algemeen',
];

export const AssignmentBar: React.FC<AssignmentBarProps> = ({
  assignment,
  onChange,
  currentWordCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const wordLimitSatisfied =
    assignment.minWords > 0 || assignment.maxWords > 0
      ? currentWordCount >= (assignment.minWords || 0) &&
        (assignment.maxWords === 0 || currentWordCount <= assignment.maxWords)
      : true;

  return (
    <div className="bg-slate-900/60 border-b border-slate-800 backdrop-blur px-4 py-2.5 transition-all text-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Compact summary bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 font-medium text-xs text-sky-400 hover:text-sky-300 bg-sky-950/40 border border-sky-800/40 px-2.5 py-1 rounded-md transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Opdrachtdetails</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Genre:</span>
            <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {assignment.genre || 'Formal Letter / Essay'}
            </span>
          </div>

          {(assignment.minWords > 0 || assignment.maxWords > 0) && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Woorden:</span>
              <span
                className={`font-mono font-medium px-2 py-0.5 rounded border flex items-center gap-1 ${
                  wordLimitSatisfied
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                }`}
              >
                {wordLimitSatisfied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                )}
                {currentWordCount} / {assignment.minWords > 0 ? `${assignment.minWords}-` : ''}
                {assignment.maxWords} w
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Doelniveau: <strong>5 HAVO (CEFR B1/B2)</strong></span>
        </div>
      </div>

      {/* Expanded configuration */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-800 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Genre / Teksttype</label>
            <select
              value={assignment.genre}
              onChange={(e) => onChange({ ...assignment, genre: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Min. woorden</label>
              <input
                type="number"
                min="0"
                step="10"
                value={assignment.minWords || ''}
                onChange={(e) =>
                  onChange({ ...assignment, minWords: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="bv. 150"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Max. woorden</label>
              <input
                type="number"
                min="0"
                step="10"
                value={assignment.maxWords || ''}
                onChange={(e) =>
                  onChange({ ...assignment, maxWords: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="bv. 250"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Opdrachtinstructies van docent (optioneel)
            </label>
            <input
              type="text"
              value={assignment.instructions}
              onChange={(e) => onChange({ ...assignment, instructions: e.target.value })}
              placeholder="bv. Noem 2 ervaringen en vraag naar slaapplek"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
