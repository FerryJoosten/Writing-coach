import { ParsedFeedback, CategoryKey } from '../types';

export interface MarkedIssue {
  id: string;
  category: CategoryKey;
  targetText: string;
  categoryName: string;
  explanation: string;
  suggestion?: string;
  startIndex: number;
  endIndex: number;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
}

export interface TextSegment {
  text: string;
  issue?: MarkedIssue;
}

const CATEGORY_STYLES: Record<
  CategoryKey,
  { name: string; colorClass: string; badgeBg: string; badgeText: string }
> = {
  spelling: {
    name: 'Spelling & Hoofdletters',
    colorClass: 'bg-red-500/25 border-b-2 border-red-500 text-red-200 hover:bg-red-500/35 cursor-pointer',
    badgeBg: 'bg-red-950/80 border-red-800/80',
    badgeText: 'text-red-300',
  },
  grammar: {
    name: 'Grammatica',
    colorClass: 'bg-purple-500/25 border-b-2 border-purple-500 text-purple-200 hover:bg-purple-500/35 cursor-pointer',
    badgeBg: 'bg-purple-950/80 border-purple-800/80',
    badgeText: 'text-purple-300',
  },
  vocabulary: {
    name: 'Woordenschat / Dunglish',
    colorClass: 'bg-blue-500/25 border-b-2 border-blue-500 text-blue-200 hover:bg-blue-500/35 cursor-pointer',
    badgeBg: 'bg-blue-950/80 border-blue-800/80',
    badgeText: 'text-blue-300',
  },
  contractions: {
    name: 'Samentrekking',
    colorClass: 'bg-amber-500/25 border-b-2 border-amber-500 text-amber-200 hover:bg-amber-500/35 cursor-pointer',
    badgeBg: 'bg-amber-950/80 border-amber-800/80',
    badgeText: 'text-amber-300',
  },
  formal_language: {
    name: 'Formeel register',
    colorClass: 'bg-indigo-500/25 border-b-2 border-indigo-500 text-indigo-200 hover:bg-indigo-500/35 cursor-pointer',
    badgeBg: 'bg-indigo-950/80 border-indigo-800/80',
    badgeText: 'text-indigo-300',
  },
  variation: {
    name: 'Variatie in zinsbouw',
    colorClass: 'bg-fuchsia-500/25 border-b-2 border-fuchsia-500 text-fuchsia-200 hover:bg-fuchsia-500/35 cursor-pointer',
    badgeBg: 'bg-fuchsia-950/80 border-fuchsia-800/80',
    badgeText: 'text-fuchsia-300',
  },
  coherence: {
    name: 'Samenhang / Alinea',
    colorClass: 'bg-teal-500/25 border-b-2 border-teal-500 text-teal-200 hover:bg-teal-500/35 cursor-pointer',
    badgeBg: 'bg-teal-950/80 border-teal-800/80',
    badgeText: 'text-teal-300',
  },
  strengths: {
    name: 'Sterk punt',
    colorClass: 'bg-emerald-500/20 text-emerald-200',
    badgeBg: 'bg-emerald-950',
    badgeText: 'text-emerald-300',
  },
  priorities: {
    name: 'Aandachtspunt',
    colorClass: 'bg-amber-500/20 text-amber-200',
    badgeBg: 'bg-amber-950',
    badgeText: 'text-amber-300',
  },
  progress: {
    name: 'Voortgang',
    colorClass: 'bg-sky-500/20 text-sky-200',
    badgeBg: 'bg-sky-950',
    badgeText: 'text-sky-300',
  },
};

/**
 * Extracts quotes and their corresponding explanations from the feedback report
 */
export function extractIssuesFromFeedback(
  fullText: string,
  parsedFeedback: ParsedFeedback
): MarkedIssue[] {
  const issuesList: {
    category: CategoryKey;
    targetText: string;
    explanation: string;
    suggestion?: string;
  }[] = [];

  const categoriesToCheck: { key: CategoryKey; cat: any }[] = [
    { key: 'spelling', cat: parsedFeedback.spelling },
    { key: 'grammar', cat: parsedFeedback.grammar },
    { key: 'vocabulary', cat: parsedFeedback.vocabulary },
    { key: 'contractions', cat: parsedFeedback.contractions },
    { key: 'formal_language', cat: parsedFeedback.formalLanguage },
    { key: 'variation', cat: parsedFeedback.variation },
    { key: 'coherence', cat: parsedFeedback.coherence },
  ];

  categoriesToCheck.forEach(({ key, cat }) => {
    if (!cat || cat.hasNoIssues || !cat.rawContent) return;

    // Split into bullet lines
    const lines = cat.rawContent.split(/\n+/);
    lines.forEach((line: string) => {
      const trimmed = line.trim().replace(/^[-*•\d.]+\s*/, '');
      if (!trimmed || trimmed.toLowerCase().includes('no spelling mistakes') || trimmed.toLowerCase().includes('no grammar mistakes')) return;

      // Match quoted texts e.g. "quote" or 'quote' or *quote*
      const quoteMatches = Array.from(trimmed.matchAll(/["']([^"']{1,60})["']|\*([^*]{1,50})\*/g));
      
      let targetText = '';
      if (quoteMatches.length > 0) {
        // Find match that actually exists in fullText (case-insensitive)
        for (const m of quoteMatches) {
          const candidate = (m[1] || m[2] || '').trim();
          if (candidate && candidate.length > 0 && !candidate.startsWith('http') && candidate.length < 50) {
            const regex = new RegExp(`\\b${escapeRegExp(candidate)}\\b`, 'i');
            if (regex.test(fullText) || fullText.toLowerCase().includes(candidate.toLowerCase())) {
              targetText = candidate;
              break;
            }
          }
        }
      }

      // If no quote match but line has colon e.g. "alot: Dit moet a lot zijn"
      if (!targetText) {
        const colonMatch = trimmed.match(/^([a-zA-Z'\s]{1,30}):\s+(.+)$/);
        if (colonMatch) {
          const candidate = colonMatch[1].trim();
          if (candidate && fullText.toLowerCase().includes(candidate.toLowerCase())) {
            targetText = candidate;
          }
        }
      }

      // Look for suggestion e.g. **suggestion**
      const suggMatch = trimmed.match(/\*\*([^*]+)\*\*/);
      const suggestion = suggMatch ? suggMatch[1] : undefined;

      if (targetText) {
        issuesList.push({
          category: key,
          targetText,
          explanation: trimmed,
          suggestion,
        });
      }
    });
  });

  // Also include obvious spelling/mechanics matches mentioned in feedback
  const fallbackWords = [
    { word: 'alot', cat: 'spelling' as CategoryKey, sugg: 'a lot', expl: 'Spelfout: schrijf altijd als twee woorden: a lot' },
    { word: 'wich', cat: 'spelling' as CategoryKey, sugg: 'which', expl: 'Spelfout: moet which zijn' },
    { word: 'untill', cat: 'spelling' as CategoryKey, sugg: 'until', expl: 'Spelfout: moet until zijn (met één l)' },
    { word: 'succesfull', cat: 'spelling' as CategoryKey, sugg: 'successful', expl: 'Spelfout: moet successful zijn' },
    { word: 'allready', cat: 'spelling' as CategoryKey, sugg: 'already', expl: 'Spelfout: moet already zijn' },
    { word: 'definately', cat: 'spelling' as CategoryKey, sugg: 'definitely', expl: 'Spelfout: moet definitely zijn' },
  ];

  fallbackWords.forEach(({ word, cat, sugg, expl }) => {
    const rx = new RegExp(`\\b${word}\\b`, 'i');
    if (rx.test(fullText)) {
      // Check if not already added
      const already = issuesList.some((i) => i.targetText.toLowerCase() === word.toLowerCase());
      if (!already) {
        issuesList.push({
          category: cat,
          targetText: word,
          explanation: expl,
          suggestion: sugg,
        });
      }
    }
  });

  // Check contractions if feedback mentions contractions or formal writing
  const contractionRx = /\b(don't|can't|won't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|couldn't|shouldn't|wouldn't|it's|I'm|they're|we're|you're)\b/gi;
  let cMatch: RegExpExecArray | null;
  while ((cMatch = contractionRx.exec(fullText)) !== null) {
    const word = cMatch[1];
    const already = issuesList.some((i) => i.targetText.toLowerCase() === word.toLowerCase());
    if (!already) {
      issuesList.push({
        category: 'contractions',
        targetText: word,
        explanation: `Samentrekking "${word}" in formele brief/tekst. Schrijf dit voluit.`,
        suggestion: getFullContractionForm(word),
      });
    }
  }

  // Capitalization for "i" (case-sensitive standalone word)
  if (/\b(i)\b/.test(fullText)) {
    const already = issuesList.some((i) => i.targetText === 'i');
    if (!already) {
      issuesList.push({
        category: 'spelling',
        targetText: 'i',
        explanation: 'Het persoonlijk voornaamwoord "I" moet in het Engels altijd met een hoofdletter geschreven worden.',
        suggestion: 'I',
      });
    }
  }

  // Capitalization for "english" (lowercase)
  if (/\b(english)\b/.test(fullText)) {
    const already = issuesList.some((i) => i.targetText.toLowerCase() === 'english');
    if (!already) {
      issuesList.push({
        category: 'spelling',
        targetText: 'english',
        explanation: 'Talen en nationaliteiten worden in het Engels altijd met een hoofdletter geschreven: English.',
        suggestion: 'English',
      });
    }
  }

  // Now find the start and end positions in fullText
  const results: MarkedIssue[] = [];
  const occupiedRanges: { start: number; end: number }[] = [];

  issuesList.forEach((issue, issueIdx) => {
    const target = issue.targetText;
    if (!target) return;

    // Search with case sensitivity first if target is 'i' or 'english'
    const isCaseSensitive = target === 'i' || target === 'english';
    const regex = new RegExp(`\\b${escapeRegExp(target)}\\b`, isCaseSensitive ? 'g' : 'gi');

    let match: RegExpExecArray | null;
    while ((match = regex.exec(fullText)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // Check if this range overlaps with an already occupied range
      const overlaps = occupiedRanges.some(
        (r) => (start >= r.start && start < r.end) || (end > r.start && end <= r.end)
      );

      if (!overlaps) {
        occupiedRanges.push({ start, end });
        const style = CATEGORY_STYLES[issue.category] || CATEGORY_STYLES.spelling;

        results.push({
          id: `mark-${issue.category}-${issueIdx}-${start}`,
          category: issue.category,
          targetText: match[0],
          categoryName: style.name,
          explanation: issue.explanation,
          suggestion: issue.suggestion,
          startIndex: start,
          endIndex: end,
          colorClass: style.colorClass,
          badgeBg: style.badgeBg,
          badgeText: style.badgeText,
        });
      }
    }
  });

  // Sort by starting index
  return results.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Splits text into marked segments and plain segments
 */
export function segmentTextWithIssues(
  text: string,
  issues: MarkedIssue[]
): TextSegment[] {
  if (!issues || issues.length === 0) {
    return [{ text }];
  }

  const segments: TextSegment[] = [];
  let currentIndex = 0;

  issues.forEach((issue) => {
    if (issue.startIndex > currentIndex) {
      segments.push({
        text: text.substring(currentIndex, issue.startIndex),
      });
    }

    segments.push({
      text: text.substring(issue.startIndex, issue.endIndex),
      issue,
    });

    currentIndex = issue.endIndex;
  });

  if (currentIndex < text.length) {
    segments.push({
      text: text.substring(currentIndex),
    });
  }

  return segments;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getFullContractionForm(c: string): string {
  const lower = c.toLowerCase();
  switch (lower) {
    case "don't": return 'do not';
    case "can't": return 'cannot';
    case "won't": return 'will not';
    case "isn't": return 'is not';
    case "aren't": return 'are not';
    case "wasn't": return 'was not';
    case "weren't": return 'were not';
    case "haven't": return 'have not';
    case "hasn't": return 'has not';
    case "hadn't": return 'had not';
    case "couldn't": return 'could not';
    case "shouldn't": return 'should not';
    case "wouldn't": return 'would not';
    case "it's": return 'it is';
    case "i'm": return 'I am';
    case "they're": return 'they are';
    case "we're": return 'we are';
    case "you're": return 'you are';
    default: return 'voluit schrijven';
  }
}
