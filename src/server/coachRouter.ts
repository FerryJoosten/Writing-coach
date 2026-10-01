import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const coachRouter = Router();

// Retrieve API key from any supported environment variable
function getApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    ''
  );
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `
## Role

You are an English Writing Coach for Dutch 5 HAVO students, working at approximately B1/B2 level. Help students improve their own English writing through clear, critical, supportive, educational feedback. The student must remain the author.

Use the teacher-provided assessment model in document.xml as additional guidance. Apply its criteria critically, including task completion and genre conventions, vocabulary and register, grammar, spelling and punctuation, coherence, paragraphing, linking words, contractions, repetition, and word-count requirements when the assignment specifies them. If it conflicts with general writing advice, follow the assessment model. Never calculate or provide a score, grade, or predicted grade.

## Start of the conversation

Keep the opening short and use exactly:

**English Writing Coach – 5 HAVO**

Paste your own English text below. I will check it and help you improve it yourself.

Do not ask unnecessary questions before the student can submit a text.

## Core review workflow

Whenever a student submits a text:

1. Start with ### Wat gaat al goed? and name 2 or 3 genuine strengths. Be specific and refer briefly to parts of the student's text. Do not invent praise.
2. Then add ### Drie aandachtspunten with exactly three important priorities based on patterns in the text.
3. Only after this overview, check and explain all seven fixed categories below.
4. Report only genuine issues. Never invent a problem to fill a category.
5. For each issue:
   - quote only the relevant word, phrase, or sentence;
   - clearly mark the problematic part;
   - identify the problem type;
   - explain it briefly in clear Dutch suitable for a 5 HAVO student;
   - give a concrete correction or one or more clear improvement suggestions;
   - briefly explain why the suggested version is better.
6. Do not require the student to discover corrections independently. Make the feedback immediately usable, while avoiding a full rewritten text or paragraph.
7. Keep the feedback visually clear and easy to scan: use the fixed headings, short paragraphs, numbered points or bullets for separate issues, and consistent bold labels. Avoid dense blocks of text.
8. Finish in Dutch by asking the student to revise the text themselves and submit the revised version. Never offer to rewrite the whole text.

Use these headings in this order:

### Wat gaat al goed?

### Drie aandachtspunten

### Spelling

### Grammar

### Vocabulary

### Variation

### Coherence

### Contractions

### Formal language

When a category has no meaningful issue, say so explicitly, for example: **No spelling mistakes found. ✓** (or similar clear confirmation).

Also use the assessment model to notice task-completion, genre-convention, punctuation, paragraphing, or word-count concerns. Place these under the closest fixed heading, usually Spelling for punctuation, Coherence for structure and paragraphing, or Formal language for genre conventions. Mention assignment compliance only when the assignment requirements are available. Do not add a grade section.

## Seven required checks

### Spelling
Check spelling mistakes, typing errors, punctuation, and incorrect word forms that are primarily spelling problems. Mark the problematic part, provide the correction, and briefly explain it.

### Grammar
Check verb forms, tenses, subject–verb agreement, word order, articles, prepositions, singular/plural forms, pronouns, possessive forms, and sentence structure. Mark the relevant part, name or briefly explain the issue, and provide a concrete correction with a short explanation.

### Vocabulary
Check contextual accuracy, natural English, precision, appropriateness for B1/B2, word combinations, possible literal translation from Dutch, and suitability for the text's purpose. Prefer simple accurate language over unnecessarily advanced vocabulary. Explain unsuitable wording and provide one or more suitable replacements.

### Variation
Check repeated words, sentence openings, structures, linking words, and ideas. Mention variation only when it would genuinely improve the text. Do not demand synonyms, idioms, figurative language, or complexity merely for their own sake.

### Coherence
Check logical links, overall structure, paragraph focus and division, order of ideas, transitions, linking words, clarity of references such as this, these, it, and they, and whether required parts such as a conclusion are present. Do not rewrite complete paragraphs. Explain where the connection or structure is weak and give a concrete suggestion for improving the order, transition, paragraphing, or linking word.

### Contractions
In formal writing, mark contractions such as don't, can't, isn't, it's, I'm, they're, and we've. Identify the contraction and provide its full form. Do not mistake possessives such as John's book for contractions.

### Formal language
Check register, genre conventions, informal expressions, conversational language, slang, vague wording, overly casual intensifiers, exclamation marks in formal writing, inappropriate direct address, and wording unsuitable for formal written English. Do not label every simple expression informal. Explain why a phrase is too informal or imprecise and provide one or more suitable formal alternatives.

## Revised versions

When a student submits a revised version, compare it with the previous version instead of treating it as a new text. Start with:

### Progress

State specifically which earlier issues have been solved, partly solved, or not yet solved. Acknowledge only genuine improvement. Then give 2 or 3 current strengths, exactly three attention points, and review the revised version again under all seven fixed headings.

## Direct, concrete support

Give sufficiently strong help immediately:
1. Identify the exact problem.
2. Explain the relevant rule or reason briefly in Dutch.
3. Provide a concrete correction or a small set of suitable alternatives.
4. Explain briefly why the correction or suggestion works.

Do not make the student guess the answer or rely mainly on guiding questions. Keep suggestions local to the quoted word, phrase, or sentence. The student must still apply the feedback and revise the complete text themselves.

For revised versions, compare the student's changes with the earlier feedback and state accurately what improved and what still needs attention.

## Authorship boundary

Do not:
- rewrite the complete text;
- produce an improved complete version;
- rewrite complete paragraphs;
- silently correct everything;
- write the assignment or a replacement paragraph;
- continue the student's text.

You may provide direct corrections and concrete alternatives for individual words, phrases, and sentences as part of the feedback. If the student asks for a full rewrite or perfect version, briefly explain that the coach can give direct corrections and suggestions but the student must revise the complete text. Do not let a sequence of individual requests become a disguised full rewrite.

## Cruciaal: Uitputtende foutendetectie (Geen enkele fout overslaan!)

Studenten en docenten rekenen op een grondige, foutloze controle. Je MOET de tekst woord-voor-woord minutieus scannen en ALLE fouten in de tekst rapporteren:

1. **Spelling & Hoofdletters & Interpunctie (### Spelling)**:
   - Controleer ELK afzonderlijk woord op spelling- en typefouten (bijv. "alot" -> "a lot", "wich" -> "which", "untill" -> "until", "allready" -> "already", "definately" -> "definitely", "seperate" -> "separate", "succesfull" -> "successful", "beleive" -> "believe", "intersting" -> "interesting", etc.).
   - Controleer ALLE hoofdletters: het persoonlijk voornaamwoord **"I"** moet in het Engels ALTIJD met een hoofdletter geschreven worden; talen (**English**, **Dutch**, **French**, **German**) en nationaliteiten moeten ALTIJD met een hoofdletter; dagen van de week en maanden moeten met een hoofdletter. Een kleine letter **"i"** of **"english"** is een ernstige spelfout die je ALTIJD moet noemen onder ### Spelling!
   - Controleer ontbrekende spaties: "a lot" (nooit "alot"), "in front of" (nooit "infront").
   - Controleer interpunctie: ontbrekende komma's na inleidende signaalwoorden ("Furthermore,", "However,", "In conclusion,"), komma-splices, en onnodige uitroeptekens in formele teksten.
   - Zeg UITSLUITEND **No spelling mistakes found. ✓** als de tekst werkelijk 100% vrij is van elke spel-, type-, hoofdletter- en leesteken-onvolkomenheid. Staat er ook maar één spelfout in, noem deze dan expliciet!

2. **Grammatica (### Grammar)**:
   - Controleer alle werkwoordstijden (Past Simple voor afgesloten verleden tijd vs Present Perfect voor verbinding met het heden).
   - Derde persoon enkelvoud -s in de Present Simple (he/she/it).
   - Engelse woordvolgorde (SVOMPT, geen Nederlandse inversie!).
   - Voorzetsels (bv. "since" voor starttijdstip vs "for" voor tijdsduur; "married to", "good at").
   - Woordvormen: bijwoorden vs bijvoeglijke naamwoorden ("speak English very well", niet "very good"; "use them responsibly", niet "responsible").
   - Meervoudsvormen en congruentie.

3. **Samentrekkingen (### Contractions)**:
   - Scan de tekst op ELKE samentrekking: *don't*, *can't*, *isn't*, *it's*, *I'm*, *they're*, *shouldn't*, *wouldn't*, *won't*, *we've*, etc.
   - Noem ze ALLEMAAL onder ### Contractions en geef voor elk de voluit geschreven vorm (*do not*, *cannot*, *is not*, *it is*, etc.).

4. **Woordenschat & Valse vrienden (### Vocabulary)**:
   - Valse vrienden en leenvertalingen uit het Nederlands: *learn* vs *teach*, *become* vs *get*, *make homework* vs *do homework*, *eventually* vs *possibly*.
   - Natuurlijke B1/B2 collocations.

5. **Formeel taalgebruik (### Formal language)**:
   - Informele woorden in formele genres ("kids" -> "children", "stuff/things", "gonna/wanna", overdreven "very nice/super").

## Tone and language

Be clear, encouraging, concise, age-appropriate, specific, and appropriately critical. Avoid childish language, excessive praise, and generic comments such as “Great job!” unless immediately supported by a concrete observation.

Give all feedback, explanations, hints, guiding questions, progress notes, focus points, and revision requests in Dutch. Keep quoted parts of the student's English text in English, and use English grammatical terms only when they are useful; explain them plainly in Dutch. Present feedback in a consistent, spacious, easy-to-scan structure with short bullets or numbered items rather than long paragraphs.
`;

function preScanTextIssues(rawText: string): string[] {
  const issues: string[] = [];

  const spellingChecks = [
    { pattern: /\balot\b/gi, name: '"alot" (is een spelfout, moet "a lot" zijn)' },
    { pattern: /\bwich\b/gi, name: '"wich" (is een spelfout, moet "which" zijn)' },
    { pattern: /\buntill\b/gi, name: '"untill" (is een spelfout, moet "until" zijn)' },
    { pattern: /\ballready\b/gi, name: '"allready" (is een spelfout, moet "already" zijn)' },
    { pattern: /\bdefinately\b/gi, name: '"definately" (is een spelfout, moet "definitely" zijn)' },
    { pattern: /\bseperate\b/gi, name: '"seperate" (is een spelfout, moet "separate" zijn)' },
    { pattern: /\bsuccesfull\b|\bsuccessfull\b/gi, name: '"succesfull" (is een spelfout, moet "successful" zijn)' },
    { pattern: /\bbeleive\b/gi, name: '"beleive" (is een spelfout, moet "believe" zijn)' },
    { pattern: /\brecieve\b/gi, name: '"recieve" (is een spelfout, moet "receive" zijn)' },
    { pattern: /\bdecalred\b/gi, name: '"decalred" (is een spelfout, moet "declared" zijn)' },
    { pattern: /\binfront\b/gi, name: '"infront" (moet "in front of" zijn)' },
    { pattern: /\btommorow\b|\btommorrow\b/gi, name: '"tommorow" (is een spelfout, moet "tomorrow" zijn)' },
    { pattern: /\bintresting\b/gi, name: '"intresting" (is een spelfout, moet "interesting" zijn)' },
    { pattern: /\breponsible\b|\bresponsable\b/gi, name: '"reponsible" (is een spelfout, moet "responsible" zijn)' },
    { pattern: /\bchoise\b/gi, name: '"choise" (is een spelfout, moet "choice" zijn)' },
    { pattern: /\beducative\b/gi, name: '"educative" (ongebruikelijk in modern Engels, gebruik "educational")' },
    { pattern: /\bgoverment\b/gi, name: '"goverment" (is een spelfout, moet "government" zijn)' },
    { pattern: /\benviroment\b/gi, name: '"enviroment" (is een spelfout, moet "environment" zijn)' },
    { pattern: /\bneccessary\b|\bnecesary\b/gi, name: '"neccessary" (is een spelfout, moet "necessary" zijn)' },
  ];

  spellingChecks.forEach((check) => {
    if (check.pattern.test(rawText)) {
      issues.push(check.name);
    }
  });

  if (/\b(i)\b/.test(rawText)) {
    issues.push('Kleine letter "i" als persoonlijk voornaamwoord (moet altijd met hoofdletter "I")');
  }
  if (/\b(english)\b/.test(rawText)) {
    issues.push('Kleine letter "english" (talen moeten altijd met hoofdletter: "English")');
  }
  if (/\b(dutch)\b/.test(rawText)) {
    issues.push('Kleine letter "dutch" (moet met hoofdletter: "Dutch")');
  }

  const contractionMatch = rawText.match(/\b(don't|can't|won't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|couldn't|shouldn't|wouldn't|it's|I'm|they're|we're|you're|there's|that's)\b/gi);
  if (contractionMatch && contractionMatch.length > 0) {
    const unique = Array.from(new Set(contractionMatch.map((c) => c.toLowerCase())));
    issues.push(`Samentrekkingen: ${unique.join(', ')} (moeten voluit geschreven worden in formele tekst)`);
  }

  if (/\bsince\s+\d+\s+(years|months|weeks|days|hours)\b/i.test(rawText)) {
    issues.push('"since [tijdsduur]" is grammaticale fout (moet "for [duur]" zijn bij tijdsduur)');
  }
  if (/\bmarried\s+with\b/i.test(rawText)) {
    issues.push('"married with" is grammaticale fout (moet "married to" zijn)');
  }
  if (/\bgood\s+in\s+english\b/i.test(rawText)) {
    issues.push('"good in English" (moet zijn: "good at English")');
  }
  if (/\blearns?\s+us\b/i.test(rawText)) {
    issues.push('"learns us" is Dunglish (moet zijn: "teaches us")');
  }
  if (/\bin\s+my\s+opinion\s+i\s+think\b/i.test(rawText)) {
    issues.push('"In my opinion I think" is een pleonasme / stijlfout');
  }
  if (/\bkids\b/i.test(rawText)) {
    issues.push('"kids" is te informeel (gebruik "children" of "pupils" of "young people")');
  }

  return issues;
}

// Health check endpoint for checking deployment status
coachRouter.get('/api/health', (_req: Request, res: Response): void => {
  const key = getApiKey();
  res.json({
    status: 'ok',
    geminiKeyConfigured: !!key,
    message: key
      ? 'API is operationeel en gekoppeld aan Gemini.'
      : 'Geen GEMINI_API_KEY gevonden! Voeg in je Vercel Dashboard onder Settings > Environment Variables de variabele GEMINI_API_KEY toe.',
  });
});

// Review feedback endpoint (Streaming)
coachRouter.post('/api/coach/feedback-stream', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, previousVersion, assignment, isRevision } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(500).json({
        error:
          'Geen GEMINI_API_KEY ingesteld op Vercel! Voeg in je Vercel Dashboard onder Settings > Environment Variables de variabele "GEMINI_API_KEY" toe met je Google AI Studio API key (gratis via https://aistudio.google.com/app/apikey).',
      });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof (res as any).flushHeaders === 'function') {
      (res as any).flushHeaders();
    }

    const detectedTraps = preScanTextIssues(text);

    let userPrompt = '';

    if (isRevision && previousVersion) {
      userPrompt = `Dit is een herziene versie van mijn Engelse tekst (5 HAVO).\n\n`;
      if (assignment) {
        userPrompt += `Opdrachtgegevens / Genre:\nGenre: ${assignment.genre || 'Niet gespecificeerd'}\nWoordenlimiet: ${assignment.wordLimit || 'Geen'}\nInstructies: ${assignment.instructions || 'Geen'}\n\n`;
      }
      userPrompt += `--- EERDERE VERSIE (VORIGE) ---\n${previousVersion}\n\n`;
      userPrompt += `--- HUIDIGE HERZIENE VERSIE ---\n${text}\n\n`;
      userPrompt += `Vergelijk mijn herziene versie met de vorige versie. Begin verplicht met ### Progress waarin je exact aangeeft wat is opgelost, deels is opgelost of nog niet is opgelost. Geef daarna 2-3 sterke punten, exact 3 aandachtspunten, en behandel alle 7 vaste categorieën volgens de instructies.`;
    } else {
      userPrompt = `Hier is mijn Engelse tekst voor 5 HAVO ter beoordeling:\n\n`;
      if (assignment) {
        userPrompt += `Opdrachtgegevens / Genre:\nGenre: ${assignment.genre || 'Niet gespecificeerd'}\nWoordenlimiet: ${assignment.wordLimit || 'Geen'}\nInstructies: ${assignment.instructions || 'Geen'}\n\n`;
      }
      userPrompt += `--- TEKST ---\n${text}\n\nBeoordeel deze tekst volgens het vaste format: ### Wat gaat al goed?, ### Drie aandachtspunten, en de 7 verplichte categorieën. Sluit af met de vraag om zelf te reviseren.`;
    }

    if (detectedTraps.length > 0) {
      userPrompt += `\n\n[KRITISCHE AUDIT-INSTRUCTIE]: Controleer de tekst uiterst nauwkeurig op ALLE fouten. Sla GEEN ENKELE spelfout, hoofdletterfout, samentrekking of grammaticafout over. Let onder meer specifiek op de volgende aangetroffen punten en neem ze expliciet op onder de juiste categorie:\n- ${detectedTraps.join('\n- ')}\nControleer ook de rest van de tekst grondig op eventuele overige fouten.`;
    } else {
      userPrompt += `\n\n[KRITISCHE AUDIT-INSTRUCTIE]: Controleer elk woord in de tekst zorgvuldig op spelling, typfouten, hoofdletters, interpunctie, samentrekkingen en grammatica. Sla geen enkele fout over. Alleen als de tekst 100% foutloos is mag je onder Spelling zetten dat er geen spelfouten zijn.`;
    }

    const callStreamWithRetry = async () => {
      const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let lastErr: any = null;

      for (const model of modelsToTry) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const stream = await ai.models.generateContentStream({
              model,
              contents: [
                {
                  role: 'user',
                  parts: [{ text: userPrompt }],
                },
              ],
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.2,
              },
            });
            return stream;
          } catch (err: any) {
            lastErr = err;
            const errStr = String(err?.message || err);
            console.warn(`Attempt ${attempt + 1} with ${model} failed:`, errStr);
            if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
              break;
            }
            await new Promise((r) => setTimeout(r, 800));
          }
        }
      }
      throw lastErr;
    };

    const responseStream = await callStreamWithRetry();

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Error generating coach feedback:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Interne fout bij het genereren van feedback.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Fout opgetreden' })}\n\n`);
      res.end();
    }
  }
});

// Non-streaming direct JSON endpoint for maximum reliability across any network proxy
coachRouter.post('/api/coach/feedback', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, previousVersion, assignment, isRevision } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(500).json({
        error:
          'Geen GEMINI_API_KEY ingesteld op Vercel! Voeg in je Vercel Dashboard onder Settings > Environment Variables de variabele "GEMINI_API_KEY" toe met je Google AI Studio API key (gratis via https://aistudio.google.com/app/apikey).',
      });
      return;
    }

    const detectedTraps = preScanTextIssues(text);

    let userPrompt = '';
    if (isRevision && previousVersion) {
      userPrompt = `Dit is een herziene versie van mijn Engelse tekst (5 HAVO).\n\n`;
      if (assignment) {
        userPrompt += `Opdrachtgegevens / Genre:\nGenre: ${assignment.genre || 'Niet gespecificeerd'}\nWoordenlimiet: ${assignment.wordLimit || 'Geen'}\nInstructies: ${assignment.instructions || 'Geen'}\n\n`;
      }
      userPrompt += `--- EERDERE VERSIE (VORIGE) ---\n${previousVersion}\n\n`;
      userPrompt += `--- HUIDIGE HERZIENE VERSIE ---\n${text}\n\n`;
      userPrompt += `Vergelijk mijn herziene versie met de vorige versie. Begin verplicht met ### Progress waarin je exact aangeeft wat is opgelost, deels is opgelost of nog niet is opgelost. Geef daarna 2-3 sterke punten, exact 3 aandachtspunten, en behandel alle 7 vaste categorieën volgens de instructies.`;
    } else {
      userPrompt = `Hier is mijn Engelse tekst voor 5 HAVO ter beoordeling:\n\n`;
      if (assignment) {
        userPrompt += `Opdrachtgegevens / Genre:\nGenre: ${assignment.genre || 'Niet gespecificeerd'}\nWoordenlimiet: ${assignment.wordLimit || 'Geen'}\nInstructies: ${assignment.instructions || 'Geen'}\n\n`;
      }
      userPrompt += `--- TEKST ---\n${text}\n\nBeoordeel deze tekst volgens het vaste format: ### Wat gaat al goed?, ### Drie aandachtspunten, en de 7 verplichte categorieën. Sluit af met de vraag om zelf te reviseren.`;
    }

    if (detectedTraps.length > 0) {
      userPrompt += `\n\n[KRITISCHE AUDIT-INSTRUCTIE]: Controleer de tekst uiterst nauwkeurig op ALLE fouten. Sla GEEN ENKELE spelfout, hoofdletterfout, samentrekking of grammaticafout over. Let onder meer specifiek op de volgende aangetroffen punten en neem ze expliciet op onder de juiste categorie:\n- ${detectedTraps.join('\n- ')}\nControleer ook de rest van de tekst grondig op eventuele overige fouten.`;
    } else {
      userPrompt += `\n\n[KRITISCHE AUDIT-INSTRUCTIE]: Controleer elk woord in de tekst zorgvuldig op spelling, typfouten, hoofdletters, interpunctie, samentrekkingen en grammatica. Sla geen enkele fout over. Alleen als de tekst 100% foutloos is mag je onder Spelling zetten dat er geen spelfouten zijn.`;
    }

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let resultText = '';
    let lastErr: any = null;

    for (const model of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const resp = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.2,
            },
          });
          resultText = resp.text || '';
          break;
        } catch (err: any) {
          lastErr = err;
          const errStr = String(err?.message || err);
          console.warn(`Attempt ${attempt + 1} with ${model} failed:`, errStr);
          if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
            break;
          }
          await new Promise((r) => setTimeout(r, 800));
        }
      }
      if (resultText) break;
    }

    if (!resultText) {
      throw lastErr || new Error('Geen feedback ontvangen van het model.');
    }

    res.json({ feedback: resultText });
  } catch (error: any) {
    console.error('Error generating direct coach feedback:', error);
    res.status(500).json({ error: error.message || 'Interne fout bij het genereren van feedback.' });
  }
});

// Follow-up question endpoint (asking the coach for clarification on an issue)
coachRouter.post('/api/coach/ask', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, contextSnippet, studentText } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question is required' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(500).json({
        error:
          'Geen GEMINI_API_KEY ingesteld op Vercel! Voeg in je Vercel Dashboard onder Settings > Environment Variables de variabele "GEMINI_API_KEY" toe.',
      });
      return;
    }

    const prompt = `De leerling heeft een vraag over de feedback of over een specifiek fragment in hun Engelse 5 HAVO tekst.

Leerlingtekst:
"${studentText || 'Niet meegeleverd'}"

Geciteerd fragment/onderwerp:
"${contextSnippet || 'Algemeen'}"

Vraag van de leerling:
"${question}"

Beantwoord deze vraag in het Nederlands, passend voor een 5 HAVO leerling (B1/B2 niveau).
Houd je strikt aan de regels:
- Herschrijf NOOIT de hele tekst of hele alinea's voor de leerling.
- Bied heldere uitleg van de grammatica-, woordenschat- of stijlregel.
- Geef 1 of 2 concrete voorbeelden of gerichte opties voor het woord of zinsdeel.
- Moedig de leerling aan om zelf de keuze en aanpassing in de tekst te maken.`;

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let response: any = null;
    let lastErr: any = null;

    for (const model of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.3,
            },
          });
          break;
        } catch (err: any) {
          lastErr = err;
          const errStr = String(err?.message || err);
          if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
            break;
          }
          await new Promise((r) => setTimeout(r, 800));
        }
      }
      if (response) break;
    }

    if (!response) {
      throw lastErr || new Error('Kon geen reactie ophalen van het model.');
    }

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error in follow-up endpoint:', error);
    res.status(500).json({ error: error.message || 'Fout bij het beantwoorden van de vraag.' });
  }
});
