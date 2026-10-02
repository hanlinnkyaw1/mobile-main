import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { kanjiDecks } from '../data/bundled';
import type { KanjiItem } from '../types';
import { colors, radius, shadows, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'KanjiFlashcard'>;

export default function KanjiFlashcardScreen({ route, navigation }: Props) {
  const { deckId, title } = route.params;
  const data = kanjiDecks[deckId] ?? [];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [deckId]);

  const card: KanjiItem | undefined = data[index];

  const goPrev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.min(data.length - 1, i + 1));
  }, [data.length]);

  const body = useMemo(() => {
    if (!card) {
      return <Text style={styles.empty}>No kanji in this deck.</Text>;
    }
    if (!flipped) {
      return (
        <Pressable style={styles.face} onPress={() => setFlipped(true)}>
          <Text style={styles.kanjiBig}>{card.kanji}</Text>
          <Text style={styles.tapHint}>Tap to show readings & meaning</Text>
        </Pressable>
      );
    }
    return (
      <Pressable style={styles.face} onPress={() => setFlipped(false)}>
        <Text style={styles.kanjiMed}>{card.kanji}</Text>
        {card.onyomi ? (
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>On: </Text>
            {card.onyomi}
          </Text>
        ) : null}
        {card.kunyomi ? (
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Kun: </Text>
            {card.kunyomi}
          </Text>
        ) : null}
        {card.meaning ? (
          <Text style={styles.mean}>{card.meaning}</Text>
        ) : null}
        {card.meaningMM ? (
          <Text style={styles.meanMm}>{card.meaningMM}</Text>
        ) : null}
        {card.examples?.length ? (
          <ScrollView style={styles.exScroll} nestedScrollEnabled>
            {card.examples.map((line, i) => (
              <Text key={i} style={styles.exLine}>
                {line}
              </Text>
            ))}
          </ScrollView>
        ) : null}
        <Text style={styles.tapHint}>Tap to flip to front</Text>
      </Pressable>
    );
  }, [card, flipped]);

  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No kanji data available for this deck.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>
          {data.length ? `${index + 1} / ${data.length}` : '—'}
        </Text>
      </View>
      <View style={styles.cardWrap}>{body}</View>
      {data.length > 0 ? (
        <View style={styles.navRow}>
          <Pressable
            style={[styles.navBtn, index === 0 && styles.navDisabled]}
            onPress={goPrev}
            disabled={index === 0}
          >
            <Text style={styles.navBtnText}>← Previous</Text>
          </Pressable>
          <Pressable
            style={[styles.navBtn, index >= data.length - 1 && styles.navDisabled]}
            onPress={goNext}
            disabled={index >= data.length - 1}
          >
            <Text style={styles.navBtnText}>Next →</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  back: { color: colors.accent, fontWeight: '700', fontSize: 16 },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 4 },
  count: { fontSize: 13, color: colors.muted, marginTop: 2 },
  cardWrap: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  face: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    minHeight: 300,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    ...shadows.md,
  },
  kanjiBig: { fontSize: 72, fontWeight: '800', textAlign: 'center', color: colors.text },
  kanjiMed: { fontSize: 36, fontWeight: '800', textAlign: 'center', color: colors.text, marginBottom: 12 },
  tapHint: { textAlign: 'center', color: colors.muted, marginTop: 16, fontSize: 14 },
  meta: { fontSize: 15, color: colors.text, marginBottom: 6 },
  metaLabel: { fontWeight: '700', color: colors.muted },
  mean: { fontSize: 16, marginTop: 8, color: colors.text },
  meanMm: { fontSize: 15, marginTop: 6, color: colors.muted, lineHeight: 22 },
  exScroll: { maxHeight: 140, marginTop: 12 },
  exLine: { fontSize: 14, color: colors.text, marginBottom: 6 },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  navBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  navDisabled: { opacity: 0.4 },
  navBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
