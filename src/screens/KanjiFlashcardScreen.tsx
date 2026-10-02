import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { kanjiDecks } from '../data/bundled';
import type { KanjiItem } from '../types';
import { colors, radius, shadows, spacing } from '../theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'KanjiFlashcard'
>;

const { width } = Dimensions.get('window');

export default function KanjiFlashcardScreen({
  route,
  navigation,
}: Props) {
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
    if (index <= 0) return;

    setFlipped(false);
    setIndex((i) => i - 1);
  }, [index]);

  const goNext = useCallback(() => {
    if (index >= data.length - 1) return;

    setFlipped(false);
    setIndex((i) => i + 1);
  }, [index, data.length]);

  const progress = data.length
    ? (index + 1) / data.length
    : 0;

  const body = useMemo(() => {
    if (!card) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>漢</Text>
          <Text style={styles.emptyTitle}>
            No kanji available
          </Text>
          <Text style={styles.emptyText}>
            There is no kanji data in this deck.
          </Text>
        </View>
      );
    }

    if (!flipped) {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
          onPress={() => setFlipped(true)}
        >
          <View style={styles.frontContent}>
            <View style={styles.kanjiCircle}>
              <Text style={styles.kanjiBig}>
                {card.kanji}
              </Text>
            </View>

            <View style={styles.tapContainer}>
              <View style={styles.tapIcon}>
                <Text style={styles.tapIconText}>↗</Text>
              </View>

              <Text style={styles.tapTitle}>
                Tap to reveal
              </Text>

              <Text style={styles.tapSubtitle}>
                Reading · Meaning · Examples
              </Text>
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.backContent}
        >
          <Pressable
            onPress={() => setFlipped(false)}
            style={styles.backHeader}
          >
            <View style={styles.smallKanjiBox}>
              <Text style={styles.kanjiMed}>
                {card.kanji}
              </Text>
            </View>

            <View style={styles.flipBadge}>
              <Text style={styles.flipBadgeText}>
                ↻ Tap to flip
              </Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          {(card.onyomi || card.kunyomi) && (
            <View style={styles.readingSection}>
              <Text style={styles.sectionLabel}>
                READING
              </Text>

              <View style={styles.readingRow}>
                {card.onyomi ? (
                  <View style={styles.readingItem}>
                    <Text style={styles.readingLabel}>
                      ON
                    </Text>
                    <Text style={styles.readingText}>
                      {card.onyomi}
                    </Text>
                  </View>
                ) : null}

                {card.kunyomi ? (
                  <View style={styles.readingItem}>
                    <Text style={styles.readingLabel}>
                      KUN
                    </Text>
                    <Text style={styles.readingText}>
                      {card.kunyomi}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}

          {card.meaning || card.meaningMM ? (
            <View style={styles.meaningSection}>
              <Text style={styles.sectionLabel}>
                MEANING
              </Text>

              {card.meaning ? (
                <Text style={styles.meaning}>
                  {card.meaning}
                </Text>
              ) : null}

              {card.meaningMM ? (
                <Text style={styles.meaningMm}>
                  {card.meaningMM}
                </Text>
              ) : null}
            </View>
          ) : null}

          {card.examples?.length ? (
            <View style={styles.exampleSection}>
              <Text style={styles.sectionLabel}>
                EXAMPLES
              </Text>

              <View style={styles.exampleList}>
                {card.examples.map((line, i) => (
                  <View
                    key={i}
                    style={styles.exampleItem}
                  >
                    <View style={styles.exampleDot}>
                      <Text style={styles.exampleDotText}>
                        {i + 1}
                      </Text>
                    </View>

                    <Text style={styles.exLine}>
                      {line}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }, [card, flipped]);

  if (data.length === 0) {
    return (
      <SafeAreaView
        style={styles.safe}
        edges={['top', 'bottom']}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>
            No kanji data available for this deck.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>

          <Text style={styles.backText}>
            Back
          </Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>

          <Text style={styles.counter}>
            {index + 1} of {data.length}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardWrap}>
        {body}
      </View>

      {/* Navigation */}
      <View style={styles.navArea}>
        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            styles.secondaryButton,
            index === 0 && styles.disabledButton,
            pressed && index !== 0 && styles.buttonPressed,
          ]}
          onPress={goPrev}
          disabled={index === 0}
        >
          <Text style={styles.secondaryButtonText}>
            ‹
          </Text>

          <Text style={styles.secondaryButtonLabel}>
            Previous
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            styles.primaryButton,
            index >= data.length - 1 &&
              styles.disabledButton,
            pressed &&
              index < data.length - 1 &&
              styles.buttonPressed,
          ]}
          onPress={goNext}
          disabled={index >= data.length - 1}
        >
          <Text style={styles.primaryButtonLabel}>
            Next
          </Text>

          <Text style={styles.primaryButtonArrow}>
            ›
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  /* Header */

  header: {
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 70,
  },

  backIcon: {
    fontSize: 30,
    lineHeight: 30,
    color: colors.accent,
    marginRight: 2,
    marginTop: -2,
  },

  backText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 70,
  },

  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },

  counter: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },

  /* Progress */

  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
  },

  progressTrack: {
    height: 4,
    width: '100%',
    backgroundColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  /* Card */

  cardWrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    justifyContent: 'center',
  },

  card: {
    width: '100%',
    minHeight: Math.min(500, width * 1.15),
    maxHeight: 600,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
    overflow: 'hidden',
  },

  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },

  /* Front */

  frontContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 44,
  },

  kanjiCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  kanjiBig: {
    fontSize: 86,
    fontWeight: '700',
    color: colors.text,
  },

  tapContainer: {
    alignItems: 'center',
  },

  tapIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    marginBottom: 10,
  },

  tapIconText: {
    color: colors.accent,
    fontSize: 19,
    fontWeight: '800',
  },

  tapTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  tapSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },

  /* Back */

  backContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  smallKanjiBox: {
    width: 62,
    height: 62,
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  kanjiMed: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
  },

  flipBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.bg,
  },

  flipBadgeText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: colors.muted,
    marginBottom: 10,
  },

  readingSection: {
    marginBottom: spacing.lg,
  },

  readingRow: {
    flexDirection: 'row',
    gap: 10,
  },

  readingItem: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    padding: 12,
  },

  readingLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3b82f6',
    letterSpacing: 0.8,
    marginBottom: 5,
  },

  readingText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    fontWeight: '600',
  },

  meaningSection: {
    marginBottom: spacing.lg,
  },

  meaning: {
    fontSize: 19,
    lineHeight: 27,
    fontWeight: '700',
    color: colors.text,
  },

  meaningMm: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
    marginTop: 4,
  },

  exampleSection: {
    marginTop: 2,
  },

  exampleList: {
    gap: 8,
  },

  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    padding: 11,
  },

  exampleDot: {
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginRight: 9,
  },

  exampleDotText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.muted,
  },

  exLine: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },

  /* Navigation */

  navArea: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },

  navButton: {
    height: 54,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  primaryButton: {
    flex: 1.25,
    backgroundColor: colors.primary,
  },

  secondaryButtonText: {
    fontSize: 28,
    lineHeight: 28,
    color: colors.text,
    marginRight: 5,
  },

  secondaryButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },

  primaryButtonLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },

  primaryButtonArrow: {
    fontSize: 27,
    lineHeight: 27,
    color: '#fff',
    marginLeft: 5,
  },

  disabledButton: {
    opacity: 0.35,
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },

  /* Empty */

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  emptyCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  emptyIcon: {
    fontSize: 54,
    color: colors.muted,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
  },

  empty: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 16,
  },
});