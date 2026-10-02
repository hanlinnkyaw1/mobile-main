import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BookOpen, Download, Search } from 'lucide-react-native';
import { freeBooks, type FreeBook } from '../data/freeBooks';
import { colors, jlptLevelColor, radius, shadows, spacing, type } from '../theme';

type FilterKey = 'All' | 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'General' | 'Old Questions';

const FILTERS: FilterKey[] = ['All', 'N1', 'N2', 'N3', 'N4', 'N5', 'General', 'Old Questions'];

function getLevel(title: string): Exclude<FilterKey, 'All' | 'Old Questions'> {
  const upperTitle = title.toUpperCase();
  if (upperTitle.includes('N1')) return 'N1';
  if (upperTitle.includes('N2')) return 'N2';
  if (upperTitle.includes('N3')) return 'N3';
  if (upperTitle.includes('N4')) return 'N4';
  if (upperTitle.includes('N5')) return 'N5';
  return 'General';
}

function isOldQuestion(title: string) {
  return title.toLowerCase().includes('old question');
}

function matchesFilter(book: FreeBook, filter: FilterKey) {
  if (filter === 'All') return true;
  if (filter === 'Old Questions') return isOldQuestion(book.title);
  if (filter === 'General') return !isOldQuestion(book.title) && getLevel(book.title) === 'General';
  return getLevel(book.title) === filter;
}

function BookCard({ book }: { book: FreeBook }) {
  const level = getLevel(book.title);
  const isAvailable = Boolean(book.link);

  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.cardIcon}>
        <BookOpen size={20} color={level === 'General' ? colors.success : jlptLevelColor(level)} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.levelBadge, { color: level === 'General' ? colors.success : jlptLevelColor(level) }]}>
            {isOldQuestion(book.title) ? 'OLD QUESTION' : level}
          </Text>
          <Text style={styles.offlineLabel}>Catalog available offline</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={isAvailable ? `Download ${book.title}` : `${book.title} unavailable`}
        disabled={!isAvailable}
        onPress={() => {
          if (book.link) Linking.openURL(book.link);
        }}
        style={({ pressed }) => [styles.downloadButton, !isAvailable && styles.disabledButton, pressed && styles.pressed]}
      >
        <Download size={16} color={isAvailable ? colors.onPrimary : colors.subtle} />
        <Text style={[styles.downloadText, !isAvailable && styles.disabledText]}>
          {isAvailable ? 'Download' : 'Unavailable'}
        </Text>
      </Pressable>
    </View>
  );
}

export default function BookStorageScreen() {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('All');

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return freeBooks.filter((book) => {
      const matchesQuery = !normalizedQuery || book.title.toLowerCase().includes(normalizedQuery);
      return matchesQuery && matchesFilter(book, selectedFilter);
    });
  }, [query, selectedFilter]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredBooks}
        keyExtractor={(book, index) => `${book.title}-${index}`}
        renderItem={({ item }) => <BookCard book={item} />}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View style={styles.introCard}>
              <View style={styles.introIcon}>
                <BookOpen size={24} color={colors.primary} />
              </View>
              <View style={styles.introCopy}>
                <Text style={styles.heading}>Japanese books and JLPT papers</Text>
                <Text style={styles.description}>
                  Browse {freeBooks.length} free study resources. The catalog and filters work offline; downloads open when you have an internet connection.
                </Text>
              </View>
            </View>
            <View style={styles.searchBar}>
              <Search size={19} color={colors.muted} />
              <TextInput
                accessibilityLabel="Search books by title"
                style={styles.searchInput}
                placeholder="Search books by title…"
                placeholderTextColor={colors.subtle}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {query.length > 0 ? (
                <Pressable accessibilityRole="button" accessibilityLabel="Clear book search" onPress={() => setQuery('')}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              ) : null}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
              style={styles.filterScroll}
            >
              {FILTERS.map((filter) => {
                const active = selectedFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setSelectedFilter(filter)}
                    style={[styles.filterChip, active && styles.activeFilterChip]}
                  >
                    <Text style={[styles.filterText, active && styles.activeFilterText]}>{filter}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Text style={styles.resultCount}>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'resource' : 'resources'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BookOpen size={28} color={colors.subtle} />
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptyText}>Try another title or choose a different filter.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  introCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: `${colors.success}35`,
    marginBottom: spacing.md,
  },
  introIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  introCopy: { flex: 1 },
  heading: { ...type.headline, color: colors.text },
  description: { ...type.caption, color: colors.muted, lineHeight: 19, marginTop: spacing.xs },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: spacing.sm },
  clearText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  filterScroll: { marginHorizontal: -spacing.lg },
  filterList: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingVertical: spacing.xs },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  activeFilterText: { color: colors.onPrimary },
  resultCount: { ...type.caption, color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSubtle,
  },
  cardBody: { flex: 1, minWidth: 0 },
  bookTitle: { color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  levelBadge: { fontSize: 10, fontWeight: '800', letterSpacing: 0.7 },
  offlineLabel: { color: colors.subtle, fontSize: 10 },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  downloadText: { color: colors.onPrimary, fontSize: 12, fontWeight: '800' },
  disabledButton: { backgroundColor: colors.bgSubtle },
  disabledText: { color: colors.subtle },
  pressed: { opacity: 0.8 },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.sm },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  emptyText: { color: colors.muted, fontSize: 14, textAlign: 'center' },
});
