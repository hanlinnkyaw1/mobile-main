import { useState, useMemo } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LEVEL_TO_DATES, vocabByKey, vocabKey } from '../data/bundled';
import type { VocabItem } from '../types';
import { colors, jlptLevel, radius, shadows, spacing } from '../theme';

type Step = 'level' | 'date' | 'list';

const LEVELS = [
  { id: 'n5', label: 'N5', emoji: '🌱', color: jlptLevel.N5 },
  { id: 'n4', label: 'N4', emoji: '🌿', color: jlptLevel.N4 },
  { id: 'n3', label: 'N3', emoji: '🌳', color: jlptLevel.N3 },
  { id: 'n2', label: 'N2', emoji: '🏔️', color: jlptLevel.N2 },
  { id: 'n1', label: 'N1', emoji: '⭐', color: jlptLevel.N1 },
];

function dateLabel(token: string): string {
  const [y, m] = token.split('_');
  const month = m === '7' ? 'July' : 'December';
  return `${month} ${y}`;
}

export default function OldVocabScreen() {
  const [step, setStep] = useState<Step>('level');
  const [level, setLevel] = useState<string | null>(null);
  const [dateToken, setDateToken] = useState<string | null>(null);

  const words: VocabItem[] = useMemo(() => {
    if (!level || !dateToken) return [];
    const key = vocabKey(level, dateToken);
    return vocabByKey[key] ?? [];
  }, [level, dateToken]);

  const dates = level ? LEVEL_TO_DATES[level] ?? [] : [];

  const goBack = () => {
    if (step === 'date') {
      setStep('level');
      setLevel(null);
    } else if (step === 'list') {
      setStep('date');
      setDateToken(null);
    }
  };

  if (step === 'level') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Text style={styles.head}>JLPT old question vocabulary</Text>
        <Text style={styles.sub}>Choose your level — all lists are bundled offline.</Text>
        <FlatList
          style={styles.listFlex}
          data={LEVELS}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.listPad}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.levelCard, shadows.sm]}
              onPress={() => {
                setLevel(item.id);
                setStep('date');
              }}
            >
              <View style={[styles.levelStripe, { backgroundColor: item.color }]} />
              <View style={styles.levelCardInner}>
                <View>
                  <Text style={styles.levelTitle}>JLPT {item.label}</Text>
                  <Text style={styles.levelHint}>Pick an exam session</Text>
                </View>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
            </Pressable>
          )}
        />
      </SafeAreaView>
    );
  }

  if (step === 'date' && level) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Pressable style={styles.backRow} onPress={goBack}>
          <Text style={styles.back}>← Levels</Text>
        </Pressable>
        <Text style={styles.head}>JLPT {level.toUpperCase()}</Text>
        <Text style={styles.sub}>Choose exam date</Text>
        {dates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No exam dates available for this level.</Text>
          </View>
        ) : (
          <FlatList
            style={styles.listFlex}
            data={dates}
            keyExtractor={(d) => d}
            contentContainerStyle={styles.listPad}
            renderItem={({ item: d }) => (
              <Pressable
                style={styles.dateRow}
                onPress={() => {
                  setDateToken(d);
                  setStep('list');
                }}
              >
                <View>
                  <Text style={styles.dateMain}>{d.replace('_', '/')}</Text>
                  <Text style={styles.dateSub}>{dateLabel(d)}</Text>
                </View>
                <Text style={styles.chev}>›</Text>
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.listHeader}>
        <Pressable onPress={goBack}>
          <Text style={styles.back}>← Dates</Text>
        </Pressable>
        <Text style={styles.listTitle}>
          {level?.toUpperCase()} · {dateToken?.replace('_', '/')}
        </Text>
        <Text style={styles.count}>{words.length} words</Text>
      </View>
      <FlatList
        style={styles.listFlex}
        data={words}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.listPad}
        ListEmptyComponent={
          <Text style={styles.empty}>No bundled list for this key (check assets).</Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.wordCard}>
            <View style={styles.wordTop}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.reading}>{item.reading}</Text>
            </View>
            <Text style={styles.en}>{item.meaningEN}</Text>
            <Text style={styles.mm}>{item.meaningMM}</Text>
            <Text style={styles.idx}>{index + 1}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  listFlex: { flex: 1 },
  head: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginTop: spacing.sm,
    letterSpacing: -0.3,
  },
  sub: { textAlign: 'center', color: colors.muted, marginBottom: spacing.sm, paddingHorizontal: spacing.lg },
  listPad: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  levelStripe: { width: 4 },
  levelCardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  levelTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  levelHint: { fontSize: 13, color: colors.muted, marginTop: 4 },
  emoji: { fontSize: 32 },
  backRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  back: { color: colors.accent, fontWeight: '700', fontSize: 16 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  dateMain: { fontSize: 17, fontWeight: '700', color: colors.text },
  dateSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  chev: { fontSize: 22, color: colors.muted },
  listHeader: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  listTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 6 },
  count: { fontSize: 13, color: colors.muted, marginTop: 2 },
  wordCard: {
    position: 'relative',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  wordTop: { flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
  word: { fontSize: 20, fontWeight: '700', color: colors.text },
  reading: { fontSize: 15, color: colors.muted },
  en: { fontSize: 15, color: colors.text, marginTop: 8 },
  mm: { fontSize: 14, color: colors.muted, marginTop: 4, lineHeight: 20 },
  idx: { position: 'absolute', right: 12, top: 12, fontSize: 12, color: '#cbd5e1' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
