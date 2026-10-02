export type GrammarExample = { jp: string; mm: string };

export type GrammarItem = {
  level: string;
  title: string;
  short: string;
  description?: string;
  examples?: GrammarExample[];
};

export type KanjiItem = {
  kanji: string;
  onyomi?: string;
  kunyomi?: string;
  meaning?: string;
  meaningMM?: string;
  examples?: string[];
};

export type ReadingOption = { id: number; text: string };

export type ReadingQuiz = {
  article_id?: string;
  level: string;
  topic: string;
  content: { text: string; translation: string };
  question: {
    query: string;
    options: ReadingOption[];
    correct_answer: number;
  };
  ai_style_framework?: {
    attention: { title: string; points: string[] };
    intent: { title: string; description: string };
    concept: { title: string; key_term: string; explanation: string };
    analogy: { title: string; scenario: string; comparison: string };
  };
};

export type VocabItem = {
  word: string;
  reading: string;
  meaningEN: string;
  meaningMM: string;
  level?: string;
  date?: string;
};
