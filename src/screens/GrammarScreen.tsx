import { useMemo, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { GrammarItem } from '../types';
import { grammarMetadata, grammarPreview } from '../data/bundled';
import { colors, jlptLevelColor, radius, shadows, spacing } from '../theme';

const LEVELS = ['All Levels', 'N5', 'N4', 'N3', 'N2', 'N1'] as const;

function GrammarCard({ item }: { item: GrammarItem }) {
  const [open, setOpen] = useState(false);
  const badge = jlptLevelColor(item.level);
  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={[styles.badge, { backgroundColor: badge + '22' }]}>
        <Text style={[styles.badgeText, { color: badge }]}>{item.level}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardShort}>{item.short}</Text>
      {item.description ? (
        <Text style={styles.cardDesc}>{item.description}</Text>
      ) : null}
      {item.examples?.length ? (
        <>
          <Pressable onPress={() => setOpen(!open)}>
            <Text style={styles.examplesToggle}>
              {open ? 'Hide examples' : `Show examples (${item.examples!.length})`}
            </Text>
          </Pressable>
          {open ? (
            <View style={styles.examples}>
              {item.examples!.map((ex, i) => (
                <View key={i} style={styles.exRow}>
                  <Text style={styles.exJp}>{ex.jp}</Text>
                  <Text style={styles.exMm}>{ex.mm}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

export default function GrammarScreen() {
  const [filter, setFilter] = useState<string>('All Levels');
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const baseList: GrammarItem[] = useMemo(() => {
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      return grammarMetadata.filter((g) => 
        g.title.toLowerCase().includes(q) || 
        g.short.toLowerCase().includes(q)
      );
    }
    if (!showAll && filter === 'All Levels') {
      return grammarPreview.slice(0, 3);
    }
    if (filter === 'All Levels') {
      return grammarMetadata;
    }
    return grammarMetadata.filter((g) => g.level === filter);
  }, [filter, query, showAll]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.toolbar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search grammar titles…"
          placeholderTextColor={colors.muted}
          style={styles.input}
          returnKeyType="search"
          keyboardAppearance="light"
        />
        <View style={styles.chips}>
          {LEVELS.map((lv) => {
            const active = filter === lv && !query;
            return (
              <Pressable
                key={lv}
                onPress={() => {
                  setFilter(lv);
                  setQuery('');
                  if (lv !== 'All Levels') setShowAll(true);
                  else setShowAll(false);
                }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{lv}</Text>
              </Pressable>
            );
          })}
        </View>
        {!showAll && filter === 'All Levels' && !query ? (
          <Pressable
            style={styles.viewAll}
            onPress={() => {
              setShowAll(true);
              setQuery('');
              setFilter('All Levels');
            }}
          >
            <Text style={styles.viewAllText}>View all grammar points</Text>
          </Pressable>
        ) : null}
      </View>
      <FlatList
        style={styles.listFlex}
        data={baseList}
        keyExtractor={(item, index) => `${item.level}-${index}-${item.title}`}
        renderItem={({ item }) => <GrammarCard item={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No grammar points match your search.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  listFlex: { flex: 1 },
  toolbar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bgSubtle,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  chipTextActive: { color: '#fff' },
  viewAll: { alignSelf: 'center', marginTop: spacing.md, marginBottom: spacing.sm },
  viewAllText: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 8 },
  cardShort: { fontSize: 14, color: colors.muted, marginTop: 6, lineHeight: 20 },
  cardDesc: { fontSize: 14, color: colors.text, marginTop: 8, lineHeight: 20 },
  examplesToggle: { color: colors.accent, fontWeight: '600', marginTop: 10, fontSize: 14 },
  examples: { marginTop: 8 },
  exRow: { marginBottom: 10 },
  exJp: { fontSize: 15, color: colors.text, fontWeight: '600' },
  exMm: { fontSize: 13, color: colors.muted, marginTop: 2 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24, fontSize: 15 },
});
