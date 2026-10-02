import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { grammarMetadata } from '../data/bundled';
import { colors } from '../theme';

const LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredGrammar = useMemo(() => {
    return grammarMetadata.filter((item) => {
      const matchesQuery =
        query === '' ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.short.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()));
      
      const matchesLevel = !selectedLevel || item.level === selectedLevel;
      
      return matchesQuery && matchesLevel;
    });
  }, [query, selectedLevel]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search grammar patterns..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={colors.muted}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <Filter size={16} color={colors.primary} style={{ marginRight: 8 }} />
          <FlatList
            data={LEVELS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedLevel === item && styles.activeChip,
                ]}
                onPress={() => setSelectedLevel(selectedLevel === item ? null : item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedLevel === item && styles.activeFilterText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <FlatList
        data={filteredGrammar}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.grammarTitle}>{item.title}</Text>
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
            </View>
            <Text style={styles.meaningMM}>{item.short}</Text>
            {item.description && (
              <Text style={styles.meaningEN}>{item.description}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No grammar patterns found.</Text>
          </View>
        }
      />
    </View>
  );
}

function getLevelColor(level: string) {
  switch (level) {
    case 'N1': return '#e11d48';
    case 'N2': return '#ea580c';
    case 'N3': return '#059669';
    case 'N4': return '#2563eb';
    case 'N5': return '#7c3aed';
    default: return colors.muted;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.bg,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activeFilterText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  grammarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  meaningMM: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  meaningEN: {
    fontSize: 14,
    color: colors.muted,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 16,
  },
});
