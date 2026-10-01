export interface AssignmentDetails {
  genre: string;
  minWords: number;
  maxWords: number;
  instructions: string;
}

export type CategoryKey =
  | 'progress'
  | 'strengths'
  | 'priorities'
  | 'spelling'
  | 'grammar'
  | 'vocabulary'
  | 'variation'
  | 'coherence'
  | 'contractions'
  | 'formal_language';

export interface FeedbackIssue {
  id: string;
  category: CategoryKey;
  quote?: string;
  problemType?: string;
  explanation: string;
  suggestion?: string;
  whyBetter?: string;
  rawText: string;
  isResolved?: boolean;
}

export interface ParsedCategory {
  key: CategoryKey;
  title: string;
  rawContent: string;
  hasNoIssues: boolean;
  issues: FeedbackIssue[];
  bullets: string[];
}

export interface ParsedFeedback {
  opening: string;
  progress?: ParsedCategory;
  strengths?: ParsedCategory;
  priorities?: ParsedCategory;
  spelling?: ParsedCategory;
  grammar?: ParsedCategory;
  vocabulary?: ParsedCategory;
  variation?: ParsedCategory;
  coherence?: ParsedCategory;
  contractions?: ParsedCategory;
  formalLanguage?: ParsedCategory;
  conclusion?: string;
  rawMarkdown: string;
}

export interface TextVersion {
  id: string;
  versionNumber: number;
  timestamp: number;
  text: string;
  wordCount: number;
  feedback: string;
  isRevision: boolean;
}

export interface SampleTask {
  id: string;
  title: string;
  genre: string;
  wordTarget: string;
  description: string;
  sampleText: string;
}
