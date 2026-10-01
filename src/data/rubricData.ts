export interface RubricCategoryInfo {
  key: string;
  nameDutch: string;
  nameEnglish: string;
  badge: string;
  description: string;
  criteria: string[];
  examples: { wrong: string; right: string; explanation: string }[];
  havoTip: string;
}

export const RUBRIC_CATEGORIES: RubricCategoryInfo[] = [
  {
    key: 'spelling',
    nameDutch: 'Spelling & Interpunctie',
    nameEnglish: 'Spelling & Punctuation',
    badge: 'Spelling',
    description: 'Foutloze spelling van B1/B2 basis- en doelwoordenschat, correcte hoofdletterregels en leestekens.',
    criteria: [
      'Geen typfouten of elementaire spelfouten (bijv. "alot" -> "a lot", "wich" -> "which").',
      'Hoofdletters bij dagen, maanden, nationaliteiten en talen (Monday, Dutch, English).',
      'Correct gebruik van komma’s bij bijzinnen en verbindingswoorden (bijv. "However, ...").',
      'Geen onnodige uitroeptekens in formele teksten.',
    ],
    examples: [
      { wrong: 'alot', right: 'a lot', explanation: '"A lot" bestaat altijd uit twee losse woorden.' },
      { wrong: 'wich', right: 'which', explanation: '"Which" met -wh- voor betrekkelijke voornaamwoorden.' },
      { wrong: 'i speak english', right: 'I speak English', explanation: 'Het persoonlijk voornaamwoord "I" en talen krijgen altijd een hoofdletter.' },
    ],
    havoTip: 'Let op veelgemaakte leenvertalingen uit het Nederlands: "decalred" (declared), "succesfull" (successful, dubbel l alleen bij -ly: successfully).',
  },
  {
    key: 'grammar',
    nameDutch: 'Grammatica',
    nameEnglish: 'Grammar',
    badge: 'Grammar',
    description: 'Werkwoordstijden (Present Perfect vs Past Simple), woordvolgorde (SVOMPT), congruentie en lidwoorden.',
    criteria: [
      'Subject-Verb Agreement (derde persoon enkelvoud -s in de Present Simple).',
      'Correcte keuze tussen Past Simple (vast tijdstip) en Present Perfect (begonnen in verleden, loopt door / resultaat nu).',
      'Engelse woordvolgorde: Subject - Verb - Object - Manner - Place - Time (geen Nederlandse volgorde!).',
      'Correcte voorzetsels (bijv. "married to" i.p.v. "married with", "good at" i.p.v. "good in").',
      'Lidwoorden: "a" voor medeklinkergeluid, "an" voor klinkergeluid (an hour, a university).',
    ],
    examples: [
      { wrong: 'I have worked there since 2 years.', right: 'I have worked there for two years.', explanation: 'Gebruik "for" bij een tijdsduur en "since" bij een startpunt in de tijd (bijv. since 2022).' },
      { wrong: 'She married with Tom.', right: 'She is married to Tom.', explanation: 'In het Engels trouw je "to" iemand, niet "with".' },
      { wrong: 'Yesterday went I to school.', right: 'Yesterday I went to school.', explanation: 'In het Engels blijft het onderwerp vóór de persoonsvorm (SVOMPT).' },
    ],
    havoTip: 'Vermijd de Nederlandse inversie (inversion). In een normale Engelse zin staat het onderwerp (I, she, they) bijna altijd vóór de persoonsvorm, ook na een tijdsbepaling!',
  },
  {
    key: 'vocabulary',
    nameDutch: 'Woordenschat & Valse Vrienden',
    nameEnglish: 'Vocabulary',
    badge: 'Vocabulary',
    description: 'Natuurlijk B1/B2 Engels, vermijden van letterlijke vertalingen uit het Nederlands (Dunglish) en valse vrienden.',
    criteria: [
      'Natuurlijk idioom passend bij het doel van de tekst.',
      'Geen valse vrienden ("false friends") die de betekenis veranderen.',
      'Woordcombinaties (collocations) kloppen (bijv. "make a decision", "take an exam").',
      'Eenvoudig maar accuraat taalgebruik heeft altijd voorrang op gekunstelde dure woorden.',
    ],
    examples: [
      { wrong: 'Students will become bored.', right: 'Students will get / become bored.', explanation: '"Become" betekent worden, maar "become" wordt soms verward met "bekomen" of "krijgen".' },
      { wrong: 'It learns us a lot.', right: 'It teaches us a lot.', explanation: '"To learn" is leren/ontvangen, "to teach" is iemand iets bijbrengen.' },
      { wrong: 'eventually (als je "eventueel" bedoelt)', right: 'possibly / potentially', explanation: '"Eventually" betekent "uiteindelijk", niet "eventueel".' },
    ],
    havoTip: 'Pas op met "I think that...": varieer liever met "In my view", "From my perspective" of formuleer het direct.',
  },
  {
    key: 'variation',
    nameDutch: 'Zinsvariatie & Afwisseling',
    nameEnglish: 'Variation',
    badge: 'Variation',
    description: 'Afwisseling in zinslengte, zinsopeningen en het vermijden van herhaalde woorden binnen één alinea.',
    criteria: [
      'Niet elke zin beginnen met "I", "Also" of "The".',
      'Mix van kortere kernachtige zinnen en samengestelde zinnen met voegwoorden.',
      'Herhaling van dezelfde signaalwoorden voorkomen.',
    ],
    examples: [
      { wrong: 'I think... Also I think... Also we can...', right: 'Furthermore, students can... In addition, it allows...', explanation: 'Varieer in signaalwoorden en zinsopbouw om de lezer geboeid te houden.' },
    ],
    havoTip: 'Lees je eigen tekst hardop voor of tel met hoeveel dezelfde woorden je alinea’s of zinnen beginnen. Zie je 3 keer "I" achter elkaar? Herschik er één.',
  },
  {
    key: 'coherence',
    nameDutch: 'Samenhang & Alinea-indeling',
    nameEnglish: 'Coherence',
    badge: 'Coherence',
    description: 'Logische alinea-opbouw (inleiding, kernalinea’s met kernzin, conclusie) en effectief gebruik van signaalwoorden.',
    criteria: [
      'Duidelijke witregels tussen alinea’s (geen lange muur van tekst).',
      'Elke alinea behandelt één centraal deelaspect (topic sentence).',
      'Logische overgangen met verbindingswoorden (Firstly, In addition, However, On the other hand, In conclusion).',
      'Verwijzingen (it, this, these, they) zijn ondubbelzinnig helder.',
    ],
    examples: [
      { wrong: 'In my opinion I think...', right: 'In my opinion, ... of I believe that...', explanation: '"In my opinion" en "I think" betekenen hetzelfde; samen is het een pleonasme.' },
    ],
    havoTip: 'Gebruik in een betoog de vaste structuur: Inleiding met stelling -> Argument 1 -> Argument 2 -> Tegenargument + weerlegging -> Conclusie.',
  },
  {
    key: 'contractions',
    nameDutch: 'Samentrekkingen (Contractions)',
    nameEnglish: 'Contractions',
    badge: 'Contractions',
    description: 'In formele teksten (zoals brieven, essays en verslagen) mogen GEEN samentrekkingen voorkomen.',
    criteria: [
      'Schrijf samentrekkingen altijd voluit in formele teksten.',
      'don’t -> do not',
      'can’t -> cannot (aan elkaar!)',
      'it’s -> it is',
      'I’m -> I am / they’re -> they are / won’t -> will not',
      'Let op: bezittelijke vormen zoals "the student\'s book" zijn GEEN samentrekking en mogen wel!',
    ],
    examples: [
      { wrong: "don't / can't / isn't", right: 'do not / cannot / is not', explanation: 'In formele 5 HAVO examens kost elke samentrekking punten voor register.' },
    ],
    havoTip: 'Controleer je formele tekst voor inleveren altijd met Ctrl+F op apostrofs (\') om alle samentrekkingen eruit te filteren!',
  },
  {
    key: 'formal_language',
    nameDutch: 'Formeel Taalgebruik & Register',
    nameEnglish: 'Formal Language',
    badge: 'Formal register',
    description: 'Passende toon voor het gekozen genre (geen spreektaal, chattaal of straattaal).',
    criteria: [
      'Geen informele spreektaalwoorden ("kids" -> "children", "gonna" -> "going to", "stuff/things" -> "equipment/aspects").',
      'Vermijd informele versterkers zoals "super nice", "really cool", "awesome".',
      'Correcte aanhef en afsluiting bij formele brieven ("Dear Mr Smith, ... Yours sincerely," / "Dear Sir or Madam, ... Yours faithfully,").',
    ],
    examples: [
      { wrong: 'kids', right: 'children / pupils / young people', explanation: '"Kids" is spreektaal en ongeschikt voor formele brieven of betogen.' },
      { wrong: 'Can you inform me where we sleep?', right: 'Could you please provide information regarding accommodation?', explanation: 'Vriendelijke, beleefde en formele formulering.' },
    ],
    havoTip: 'Schrijf je een brief aan een onbekende geadresseerde ("Dear Sir or Madam")? Sluit dan altijd af met "Yours faithfully". Ken je de achternaam ("Dear Ms Johnson")? Gebruik dan "Yours sincerely".',
  },
];

export const LINKING_WORDS = [
  { category: 'Opsomming / Toevoeging', words: ['Furthermore', 'In addition', 'Moreover', 'Besides', 'Additionally'] },
  { category: 'Tegenstelling / Contrast', words: ['However', 'On the one hand... On the other hand', 'In contrast', 'Although', 'Despite this'] },
  { category: 'Oorzaak & Gevolg', words: ['Therefore', 'As a result', 'Consequently', 'For this reason', 'Due to'] },
  { category: 'Voorbeelden', words: ['For example', 'For instance', 'Such as', 'To illustrate this'] },
  { category: 'Conclusie / Afronding', words: ['In conclusion', 'To sum up', 'Overall', 'Taking everything into consideration'] },
];
