import { useCallback, useMemo, useState } from 'react';
import { Text, View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { kanjiDecks } from '../data/bundled';
import type { KanjiItem } from '../types';
import { colors, radius, shadows, spacing } from '../theme';

/** Same deck mapping as the web `kanjiGame/game.js` `kanjiDataUrl`. */
const GAME_DECKS: Record<string, string> = {
  n5: 'n5kanji',
  n4: 'n4kanji',
  n3: 'n3kanji',
  n2: 'n2kanji',
  n1: 'n1kanjiMaster',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function KanjiGameScreen() {
  const [level, setLevel] = useState<string | null>(null);
  const [burmese, setBurmese] = useState(true);
  const [pool, setPool] = useState<KanjiItem[]>([]);
  const [round, setRound] = useState(0);
  const [choices, setChoices] = useState<KanjiItem[]>([]);
  const [target, setTarget] = useState<KanjiItem | null>(null);
  const [prompt, setPrompt] = useState<{ text: string; kind: string } | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const deckId = level ? GAME_DECKS[level] : null;
  const source = deckId ? kanjiDecks[deckId] ?? [] : [];

  const filteredSource = useMemo(
    () => source.filter((k) => k.kunyomi && k.kunyomi !== 'ー' && k.kanji),
    [source],
  );

  const startRound = useCallback(
    (data: KanjiItem[], burmesePrompt: boolean) => {
      if (data.length < 4) return;
      const pick = data[Math.floor(Math.random() * data.length)];
      const wrong = shuffle(data.filter((k) => k.kanji !== pick.kanji)).slice(0, 3);
      const opts = shuffle([pick, ...wrong]);
      let useReading = Math.random() < 0.5;
      let promptText = useReading
        ? pick.kunyomi ?? pick.onyomi ?? ''
        : burmesePrompt
          ? pick.meaningMM ?? pick.meaning ?? ''
          : pick.meaning ?? pick.meaningMM ?? '';
      if (!String(promptText).trim()) {
        useReading = !useReading;
        promptText = useReading
          ? pick.kunyomi ?? pick.onyomi ?? pick.kanji
          : burmesePrompt
            ? pick.meaningMM ?? pick.meaning ?? pick.kanji
            : pick.meaning ?? pick.meaningMM ?? pick.kanji;
      }
      const kind = useReading ? 'reading' : 'meaning';
      setTarget(pick);
      setChoices(opts);
      setPrompt({ text: String(promptText).trim() || pick.kanji, kind });
      setFeedback(null);
      setSelectedIndex(null);
    },
    [],
  );

  /** Load deck from `lv` synchronously — do not rely on `level` state (updates next render). */
  const begin = (lv: string) => {
    const deck = GAME_DECKS[lv];
    const raw = deck ? kanjiDecks[deck] ?? [] : [];
    const data = raw.filter((k) => k.kunyomi && k.kunyomi !== 'ー' && k.kanji);
    setLevel(lv);
    setPool(data);
    setRound(0);
    setScore(0);
    setFeedback(null);
    setSelectedIndex(null);
    if (data.length >= 4) startRound(data, burmese);
  };

  const exitGame = () => {
    setLevel(null);
    setPool([]);
    setChoices([]);
    setTarget(null);
    setPrompt(null);
    setFeedback(null);
    setRound(0);
    setScore(0);
    setSelectedIndex(null);
  };

  const nextRound = () => {
    if (pool.length < 4) return;
    startRound(pool, burmese);
    setRound((r) => r + 1);
  };

  const onPick = (k: KanjiItem, index: number) => {
    if (!target) return;
    setSelectedIndex(index);
    if (k.kanji === target.kanji) {
      setScore((s) => s + 1);
      setFeedback('Correct ✓');
    } else {
      setFeedback(`Correct answer: ${target.kanji}`);
    }
  };

  if (!level) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.pad}>
          <Text style={styles.title}>Kanji quick game</Text>
          <Text style={styles.sub}>Offline — tap the kanji that matches the prompt.</Text>
          <Text style={styles.label}>Prompt language</Text>
          <View style={styles.row}>
            <Pressable
              style={[styles.chip, burmese && styles.chipOn]}
              onPress={() => setBurmese(true)}
            >
              <Text style={[styles.chipText, burmese && styles.chipTextOn]}>Burmese meaning</Text>
            </Pressable>
            <Pressable
              style={[styles.chip, !burmese && styles.chipOn]}
              onPress={() => setBurmese(false)}
            >
              <Text style={[styles.chipText, !burmese && styles.chipTextOn]}>English meaning</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>Level</Text>
          {(['n5', 'n4', 'n3', 'n2', 'n1'] as const).map((lv) => (
            <Pressable key={lv} style={styles.levelBtn} onPress={() => begin(lv)}>
              <Text style={styles.levelBtnText}>{lv.toUpperCase()} deck</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (filteredSource.length < 4) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>Not enough kanji in this deck to play.</Text>
          <Pressable style={styles.exitBtn} onPress={exitGame}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.top}>
        <Pressable onPress={exitGame}>
          <Text style={styles.back}>← Exit</Text>
        </Pressable>
        <Text style={styles.score}>
          Score: {score} · Round {round + 1}
        </Text>
      </View>
      {prompt ? (
        <View style={styles.promptBox}>
          <Text style={styles.promptKind}>Find by {prompt.kind}</Text>
          <Text style={styles.promptText}>{prompt.text}</Text>
        </View>
      ) : null}
      <View style={styles.grid}>
        {choices.map((k, i) => (
          <Pressable
            key={`${k.kanji}-${i}`}
            style={[
              styles.tile,
              feedback && selectedIndex === i && (
                selectedIndex === choices.findIndex(c => c.kanji === target?.kanji)
                  ? styles.tileCorrect
                  : styles.tileWrong
              ),
            ]}
            onPress={() => {
              if (!feedback) onPick(k, i);
            }}
            disabled={!!feedback}
          >
            <Text style={styles.tileKanji}>{k.kanji}</Text>
          </Pressable>
        ))}
      </View>
      {feedback ? (
        <View style={[styles.feedback, feedback.includes('Correct ✓') ? styles.feedbackSuccess : styles.feedbackError]}>
          <Text style={styles.feedbackText}>{feedback}</Text>
          <Pressable style={styles.nextBtn} onPress={nextRound}>
            <Text style={styles.nextBtnText}>Next question</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pad: { padding: spacing.xl },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  sub: { fontSize: 14, color: colors.muted, marginTop: spacing.sm, lineHeight: 20 },
  label: {
    marginTop: spacing.xl,
    fontWeight: '700',
    color: colors.text,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.bgSubtle,
  },
  chipOn: { backgroundColor: colors.primary },
  chipText: { fontWeight: '600', color: colors.text },
  chipTextOn: { color: '#fff' },
  levelBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  levelBtnText: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'center' },
  top: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: { color: colors.accent, fontWeight: '700' },
  score: { fontWeight: '700', color: colors.text },
  promptBox: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  promptKind: { fontSize: 12, fontWeight: '700', color: colors.muted, textTransform: 'uppercase' },
  promptText: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  tile: {
    width: '44%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  tileCorrect: { borderColor: colors.green, backgroundColor: '#ecfdf5' },
  tileWrong: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  tileKanji: { fontSize: 48, fontWeight: '800', color: colors.text },
  feedback: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border },
  feedbackSuccess: { backgroundColor: '#ecfdf5' },
  feedbackError: { backgroundColor: '#fef2f2' },
  feedbackText: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  nextBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    ...shadows.sm,
  },
  nextBtnText: { color: '#fff', fontWeight: '800' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 16, marginBottom: 20 },
  exitBtn: { padding: 16 },
  exitPad: { padding: 16 },
});
