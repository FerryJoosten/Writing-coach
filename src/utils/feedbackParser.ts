import { ParsedCategory, ParsedFeedback, FeedbackIssue, CategoryKey } from '../types';

export function parseCoachFeedback(rawMarkdown: string): ParsedFeedback {
  if (!rawMarkdown) {
    return { opening: '', rawMarkdown: '' };
  }

  const result: ParsedFeedback = {
    opening: '',
    rawMarkdown,
  };

  // Split content by standard markdown headings (### Heading)
  const headingRegex = /^###\s+(.+)$/gm;
  const sections: { title: string; content: string; startIndex: number }[] = [];

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let previousTitle = '';

  while ((match = headingRegex.exec(rawMarkdown)) !== null) {
    if (previousTitle) {
      const content = rawMarkdown.substring(lastIndex, match.index).trim();
      sections.push({ title: previousTitle, content, startIndex: lastIndex });
    } else {
      result.opening = rawMarkdown.substring(0, match.index).trim();
    }
    previousTitle = match[1].trim();
    lastIndex = match.index + match[0].length;
  }

  if (previousTitle) {
    const remaining = rawMarkdown.substring(lastIndex).trim();
    sections.push({ title: previousTitle, content: remaining, startIndex: lastIndex });
  }

  // Look for closing revision request at the bottom if any
  if (sections.length > 0) {
    const lastSection = sections[sections.length - 1];
    // Check if the last section has trailing text after bullet points
    const splitConclusion = lastSection.content.split(/\n\n(?=(?:Herschrijf|Pas|Succes|Probeer|Herzie|Ga aan de slag|Laat me|Kortom|Nu ben jij).*)/i);
    if (splitConclusion.length > 1) {
      lastSection.content = splitConclusion[0].trim();
      result.conclusion = splitConclusion.slice(1).join('\n\n').trim();
    }
  }

  // Map sections into category objects
  sections.forEach((sec) => {
    const lowerTitle = sec.title.toLowerCase();

    let catKey: CategoryKey | null = null;
    if (lowerTitle.includes('progress') || lowerTitle.includes('voortgang')) {
      catKey = 'progress';
    } else if (lowerTitle.includes('wat gaat al goed') || lowerTitle.includes('sterke punten') || lowerTitle.includes('goed')) {
      catKey = 'strengths';
    } else if (lowerTitle.includes('drie aandachtspunten') || lowerTitle.includes('aandachtspunten')) {
      catKey = 'priorities';
    } else if (lowerTitle.includes('spelling')) {
      catKey = 'spelling';
    } else if (lowerTitle.includes('grammar') || lowerTitle.includes('grammatica')) {
      catKey = 'grammar';
    } else if (lowerTitle.includes('vocabulary') || lowerTitle.includes('woordenschat')) {
      catKey = 'vocabulary';
    } else if (lowerTitle.includes('variation') || lowerTitle.includes('variatie')) {
      catKey = 'variation';
    } else if (lowerTitle.includes('coherence') || lowerTitle.includes('samenhang')) {
      catKey = 'coherence';
    } else if (lowerTitle.includes('contraction') || lowerTitle.includes('samentrekking')) {
      catKey = 'contractions';
    } else if (lowerTitle.includes('formal') || lowerTitle.includes('formeel')) {
      catKey = 'formal_language';
    }

    if (catKey) {
      const parsedCat = buildCategory(catKey, sec.title, sec.content);
      if (catKey === 'progress') result.progress = parsedCat;
      else if (catKey === 'strengths') result.strengths = parsedCat;
      else if (catKey === 'priorities') result.priorities = parsedCat;
      else if (catKey === 'spelling') result.spelling = parsedCat;
      else if (catKey === 'grammar') result.grammar = parsedCat;
      else if (catKey === 'vocabulary') result.vocabulary = parsedCat;
      else if (catKey === 'variation') result.variation = parsedCat;
      else if (catKey === 'coherence') result.coherence = parsedCat;
      else if (catKey === 'contractions') result.contractions = parsedCat;
      else if (catKey === 'formal_language') result.formalLanguage = parsedCat;
    }
  });

  return result;
}

function buildCategory(key: CategoryKey, title: string, content: string): ParsedCategory {
  const lower = content.toLowerCase();
  const hasNoIssues =
    lower.includes('no spelling mistakes') ||
    lower.includes('no grammar mistakes') ||
    lower.includes('geen fouten') ||
    lower.includes('no mistakes') ||
    lower.includes('geen opmerkingen') ||
    lower.includes('geen problemen') ||
    lower.includes('no issues') ||
    lower.includes('geen samentrekkingen') ||
    lower.includes('voldoet prima') ||
    content.includes('✓');

  const bullets: string[] = [];
  const issues: FeedbackIssue[] = [];

  // Parse lines or numbered/bullet items
  const items = content.split(/(?=(?:^\s*[-*•]|\n\s*[-*•]|\n\s*\d+\.\s+))/m).map((s) => s.trim()).filter(Boolean);

  items.forEach((item, idx) => {
    const cleanItem = item.replace(/^[-*•\d.]+\s*/, '').trim();
    if (cleanItem) {
      bullets.push(cleanItem);

      // Attempt to extract quote and explanation
      const quoteMatch = cleanItem.match(/["']([^"']+)["']|`([^`]+)`/);
      const quote = quoteMatch ? (quoteMatch[1] || quoteMatch[2]) : undefined;

      issues.push({
        id: `${key}-${idx}-${Date.now()}`,
        category: key,
        rawText: cleanItem,
        quote,
        explanation: cleanItem,
        isResolved: false,
      });
    }
  });

  return {
    key,
    title,
    rawContent: content,
    hasNoIssues,
    issues,
    bullets,
  };
}
