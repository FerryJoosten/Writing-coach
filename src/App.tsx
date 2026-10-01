import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { AssignmentBar } from './components/AssignmentBar';
import { EditorPane } from './components/EditorPane';
import { FeedbackDashboard } from './components/FeedbackDashboard';
import { RevisionComparison } from './components/RevisionComparison';
import { SamplesModal } from './components/SamplesModal';
import { AskCoachModal } from './components/AskCoachModal';
import { AssignmentDetails, TextVersion, SampleTask, ParsedFeedback } from './types';
import { parseCoachFeedback } from './utils/feedbackParser';
import { extractIssuesFromFeedback, segmentTextWithIssues } from './utils/textHighlighter';

export default function App() {
  const [text, setText] = useState<string>('');
  const [assignment, setAssignment] = useState<AssignmentDetails>({
    genre: 'Formal Letter / Email',
    minWords: 150,
    maxWords: 200,
    instructions: '',
  });

  const [versions, setVersions] = useState<TextVersion[]>([]);
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(-1);
  const [isRevision, setIsRevision] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rawFeedback, setRawFeedback] = useState<string>('');
  const [parsedFeedback, setParsedFeedback] = useState<ParsedFeedback>({
    opening: '',
    rawMarkdown: '',
  });
  const [isMarkedViewActive, setIsMarkedViewActive] = useState<boolean>(false);

  // Modals
  const [isSamplesOpen, setIsSamplesOpen] = useState<boolean>(false);
  const [isDiffOpen, setIsDiffOpen] = useState<boolean>(false);
  const [isAskCoachOpen, setIsAskCoachOpen] = useState<boolean>(false);
  const [coachSnippet, setCoachSnippet] = useState<string>('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Sync parsed feedback whenever rawFeedback updates
  useEffect(() => {
    if (rawFeedback) {
      setParsedFeedback(parseCoachFeedback(rawFeedback));
    } else {
      setParsedFeedback({ opening: '', rawMarkdown: '' });
      setIsMarkedViewActive(false);
    }
  }, [rawFeedback]);

  // Compute marked issues in text
  const markedIssues = useMemo(() => {
    if (!text || !rawFeedback) return [];
    return extractIssuesFromFeedback(text, parsedFeedback);
  }, [text, rawFeedback, parsedFeedback]);

  // Compute text segments for highlighting
  const segments = useMemo(() => {
    return segmentTextWithIssues(text, markedIssues);
  }, [text, markedIssues]);

  // One-click quick apply correction from marked text view
  const handleApplyCorrection = (targetText: string, replacement: string) => {
    setText((prev) => {
      const idx = prev.indexOf(targetText);
      if (idx !== -1) {
        return prev.substring(0, idx) + replacement + prev.substring(idx + targetText.length);
      }
      const regex = new RegExp(targetText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      return prev.replace(regex, replacement);
    });
  };

  // Submit text to coach
  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setRawFeedback('');
    setIsMarkedViewActive(false);

    const previousVersion = isRevision && versions.length > 0 ? versions[versions.length - 1].text : undefined;
    const versionNum = versions.length + 1;
    let accumulatedText = '';

    try {
      // 1. Attempt streaming endpoint
      const response = await fetch('/api/coach/feedback-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          previousVersion,
          assignment,
          isRevision,
        }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6).trim();
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setRawFeedback(accumulatedText);
                }
                if (parsed.error) {
                  accumulatedText += `\n\n**Fout**: ${parsed.error}`;
                  setRawFeedback(accumulatedText);
                }
              } catch {
                // Ignore parse errors on partial strings
              }
            }
          }
        }
      }

      // 2. If streaming returned nothing, fallback to direct JSON endpoint
      if (!accumulatedText.trim()) {
        const directRes = await fetch('/api/coach/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            previousVersion,
            assignment,
            isRevision,
          }),
        });

        if (!directRes.ok) {
          let errorMsg = `Serverfout (${directRes.status})`;
          try {
            const errData = await directRes.json();
            if (errData && errData.error) {
              errorMsg = errData.error;
            }
          } catch {
            if (directRes.status === 404) {
              errorMsg = 'De API route (/api/coach/feedback) werd niet gevonden op Vercel (HTTP 404). Zorg dat je de nieuwste code (met de /api map en vercel.json) naar je GitHub repository hebt gepusht.';
            } else if (directRes.status === 500) {
              errorMsg = 'Serverfout (HTTP 500). Controleer of de variabele GEMINI_API_KEY in Vercel is ingevuld en of je daarna op "Redeploy" hebt geklikt.';
            }
          }
          throw new Error(errorMsg);
        }

        const directData = await directRes.json();
        if (directData.feedback) {
          accumulatedText = directData.feedback;
          setRawFeedback(accumulatedText);
        } else {
          throw new Error('Geen feedback ontvangen van de coach.');
        }
      }

      // Record finished version
      const newVersion: TextVersion = {
        id: `v-${Date.now()}`,
        versionNumber: versionNum,
        timestamp: Date.now(),
        text,
        wordCount,
        feedback: accumulatedText,
        isRevision,
      };

      setVersions((prev) => [...prev, newVersion]);
      setActiveVersionIndex(versionNum - 1);
    } catch (err: any) {
      console.error('Error submitting text to coach:', err);
      setRawFeedback(
        `**Er is een fout opgetreden bij het beoordelen**: ${err.message || 'Onbekende serverfout'}\n\nKlik op 'Opnieuw proberen' of controleer je internetverbinding.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Start revising with feedback open
  const handleStartRevision = () => {
    setIsRevision(true);
    setIsMarkedViewActive(false);
  };

  const handleCancelRevision = () => {
    setIsRevision(false);
  };

  // Select sample task
  const handleSelectSample = (sample: SampleTask) => {
    setText(sample.sampleText);
    setAssignment((prev) => ({
      ...prev,
      genre: sample.genre,
    }));
    setIsSamplesOpen(false);
    setIsRevision(false);
    setRawFeedback('');
    setIsMarkedViewActive(false);
  };

  // Reset entire session
  const handleReset = () => {
    if (text && !window.confirm('Wil je een hele nieuwe sessie starten? Alle ingevoerde tekst en versies worden gewist.')) {
      return;
    }
    setText('');
    setVersions([]);
    setActiveVersionIndex(-1);
    setIsRevision(false);
    setRawFeedback('');
    setIsMarkedViewActive(false);
  };

  const handleAskCoach = (snippet?: string) => {
    setCoachSnippet(snippet || '');
    setIsAskCoachOpen(true);
  };

  const currentVersionNum = versions.length > 0 ? versions.length : 1;
  const previousVersionText = versions.length > 1 ? versions[versions.length - 2].text : versions.length === 1 ? versions[0].text : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
      {/* Top Header without removed buttons */}
      <Header
        onReset={handleReset}
        versionCount={versions.length}
      />

      {/* Assignment / Genre Bar */}
      <AssignmentBar
        assignment={assignment}
        onChange={setAssignment}
        currentWordCount={wordCount}
      />

      {/* Main Dual-Pane Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch min-h-[680px]">
          {/* Left Column: Student Editor or Marked Text View (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col min-h-[420px] lg:min-h-full">
            <EditorPane
              text={text}
              setText={setText}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isRevision={isRevision}
              versionNumber={currentVersionNum + (isRevision ? 1 : 0)}
              onCancelRevision={handleCancelRevision}
              onOpenSamples={() => setIsSamplesOpen(true)}
              hasFeedback={!!rawFeedback && !isLoading}
              isMarkedViewActive={isMarkedViewActive}
              onToggleMarkedView={() => setIsMarkedViewActive((prev) => !prev)}
              markedIssues={markedIssues}
              segments={segments}
              onApplyCorrection={handleApplyCorrection}
              onAskCoach={handleAskCoach}
            />
          </div>

          {/* Right Column: Feedback Dashboard (7 cols on desktop) - ALWAYS VISIBLE */}
          <div className="lg:col-span-7 flex flex-col min-h-[420px] lg:min-h-full">
            <FeedbackDashboard
              parsedFeedback={parsedFeedback}
              rawMarkdown={rawFeedback}
              isStreaming={isLoading}
              onStartRevision={handleStartRevision}
              onCompareVersions={() => setIsDiffOpen(true)}
              onAskCoach={handleAskCoach}
              canCompare={versions.length > 1 || isRevision}
              versionNumber={currentVersionNum}
              onToggleMarkedView={() => setIsMarkedViewActive((prev) => !prev)}
              isMarkedViewActive={isMarkedViewActive}
              markedIssuesCount={markedIssues.length}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <SamplesModal
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        onSelectSample={handleSelectSample}
      />
      <RevisionComparison
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        oldText={previousVersionText}
        newText={text}
        oldVersionNum={Math.max(1, currentVersionNum - 1)}
        newVersionNum={currentVersionNum}
        progressSummary={parsedFeedback.progress?.rawContent}
      />
      <AskCoachModal
        isOpen={isAskCoachOpen}
        onClose={() => setIsAskCoachOpen(false)}
        snippet={coachSnippet}
        studentText={text}
      />
    </div>
  );
}
