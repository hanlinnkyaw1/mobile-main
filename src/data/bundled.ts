import type { GrammarItem, KanjiItem, ReadingQuiz, VocabItem } from '../types';

export const grammarMetadata: GrammarItem[] =
  require('../../assets/data/grammarMetadata.json');

export const grammarPreview: GrammarItem[] =
  require('../../assets/data/preview.json');

export const readingByLevel: Record<string, ReadingQuiz[]> = {
  N1: require('../../assets/data/reading/N1Reading.json'),
  N2: require('../../assets/data/reading/N2Reading.json'),
  N3: require('../../assets/data/reading/N3Reading.json'),
  N4: require('../../assets/data/reading/N4Reading.json'),
  N5: require('../../assets/data/reading/N5Reading.json'),
};

export const kanjiDecks: Record<string, KanjiItem[]> = {
  n5kanji: require('../../assets/data/kanji/n5kanji.json'),
  n4kanji: require('../../assets/data/kanji/n4kanji.json'),
  n3kanji: require('../../assets/data/kanji/n3kanji.json'),
  n2kanji: require('../../assets/data/kanji/n2kanji.json'),
  n1kanji: require('../../assets/data/kanji/n1kanji.json'),
  n1kanjiMaster: require('../../assets/data/kanji/n1kanjiMaster.json'),
  n2kanjiMaster: require('../../assets/data/kanji/n2kanjiMaster.json'),
  n3kanjimaster: require('../../assets/data/kanji/n3kanjimaster.json'),
};

/** JLPT old-question vocab packs bundled for offline use (key: `n1_2015_7`, etc.). */
export const vocabByKey: Record<string, VocabItem[]> = {
  n1_2015_7: require('../../assets/data/vocab/n1_2015_7.json'),
  n1_2016_7: require('../../assets/data/vocab/n1_2016_7.json'),
  n1_2017_7: require('../../assets/data/vocab/n1_2017_7.json'),
  n1_2018_7: require('../../assets/data/vocab/n1_2018_7.json'),
  n1_2019_7: require('../../assets/data/vocab/n1_2019_7.json'),
  n1_2022_7: require('../../assets/data/vocab/n1_2022_7.json'),
  n1_2023_7: require('../../assets/data/vocab/n1_2023_7.json'),
  n1_2024_7: require('../../assets/data/vocab/n1_2024_7.json'),
  n2_2012_12: require('../../assets/data/vocab/n2_2012_12.json'),
  n2_2013_12: require('../../assets/data/vocab/n2_2013_12.json'),
  n2_2017_7: require('../../assets/data/vocab/n2_2017_7.json'),
  n2_2019_12: require('../../assets/data/vocab/n2_2019_12.json'),
  n2_2020_12: require('../../assets/data/vocab/n2_2020_12.json'),
  n2_2021_12: require('../../assets/data/vocab/n2_2021_12.json'),
  n2_2022_12: require('../../assets/data/vocab/n2_2022_12.json'),
  n2_2023_7: require('../../assets/data/vocab/n2_2023_7.json'),
  n2_2024_7: require('../../assets/data/vocab/n2_2024_7.json'),
  n3_2015_7: require('../../assets/data/vocab/n3_2015_7.json'),
  n3_2016_7: require('../../assets/data/vocab/n3_2016_7.json'),
  n3_2016_12: require('../../assets/data/vocab/n3_2016_12.json'),
  n3_2017_7: require('../../assets/data/vocab/n3_2017_7.json'),
  n3_2018_7: require('../../assets/data/vocab/n3_2018_7.json'),
  n3_2020_12: require('../../assets/data/vocab/n3_2020_12.json'),
  n3_2023_7: require('../../assets/data/vocab/n3_2023_7.json'),
  n4_2016_12: require('../../assets/data/vocab/n4_2016_12.json'),
  n4_2017_7: require('../../assets/data/vocab/n4_2017_7.json'),
  n4_2019_7: require('../../assets/data/vocab/n4_2019_7.json'),
  n4_2024_7: require('../../assets/data/vocab/n4_2024_7.json'),
  n5_2013_7: require('../../assets/data/vocab/n5_2013_7.json'),
  n5_2017_7: require('../../assets/data/vocab/n5_2017_7.json'),
  n5_2024_7: require('../../assets/data/vocab/n5_2024_7.json'),
};

/** Mirrors `oldQVoca/index.html` exam date lists. */
export const LEVEL_TO_DATES: Record<string, string[]> = {
  n1: ['2015_7', '2016_7', '2017_7', '2018_7', '2019_7', '2022_7', '2023_7', '2024_7'],
  n2: ['2012_12', '2013_12', '2017_7', '2019_12', '2020_12', '2021_12', '2022_12', '2023_7', '2024_7'],
  n3: ['2015_7', '2016_7', '2016_12', '2017_7', '2018_7', '2020_12', '2023_7'],
  n4: ['2016_12', '2017_7', '2019_7', '2024_7'],
  n5: ['2013_7', '2017_7', '2024_7'],
};

export function vocabKey(levelLower: string, dateToken: string): string {
  return `${levelLower}_${dateToken}`;
}
