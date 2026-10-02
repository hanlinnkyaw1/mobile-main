import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors, jlptLevel, radius, shadows, spacing } from '../theme';

const DECKS: { id: string; title: string; color: string }[] = [
  { id: 'n5kanji', title: 'JLPT N5', color: jlptLevel.N5 },
  { id: 'n4kanji', title: 'JLPT N4', color: jlptLevel.N4 },
  { id: 'n3kanji', title: 'JLPT N3', color: jlptLevel.N3 },
  { id: 'n2kanji', title: 'JLPT N2', color: jlptLevel.N2 },
  { id: 'n1kanji', title: 'JLPT N1', color: jlptLevel.N1 },
  { id: 'n1kanjiMaster', title: 'N1 Kanji Master', color: jlptLevel.N1 },
  { id: 'n2kanjiMaster', title: 'N2 Kanji Master', color: jlptLevel.N2 },
  { id: 'n3kanjimaster', title: 'N3 Kanji Master', color: jlptLevel.N3 },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'KanjiDecks'>;
};

export default function KanjiDecksScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.head}>Choose a deck</Text>
        <Text style={styles.sub}>All kanji data stays on your device.</Text>
        {DECKS.map((d) => (
          <Pressable
            key={d.id}
            style={({ pressed }) => [
              styles.row,
              shadows.sm,
              pressed && styles.rowPressed,
            ]}
            onPress={() => navigation.navigate('KanjiFlashcard', { deckId: d.id, title: d.title })}
          >
            <View style={[styles.dot, { backgroundColor: d.color }]} />
            <View style={styles.rowBody}>
              <Text style={styles.btnText}>{d.title}</Text>
              <Text style={styles.btnHint}>Flashcards</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  head: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  sub: { fontSize: 14, color: colors.muted, marginBottom: spacing.xl, marginTop: spacing.sm },
  row: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowPressed: { opacity: 0.92 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowBody: { flex: 1, minWidth: 0 },
  btnText: { fontSize: 17, fontWeight: '700', color: colors.text },
  btnHint: { fontSize: 13, color: colors.muted, marginTop: 2, fontWeight: '500' },
  chevron: { fontSize: 26, color: colors.subtle, fontWeight: '300' },
});
