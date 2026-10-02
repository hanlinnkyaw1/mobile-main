import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows, spacing } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type ToolRoute = 'KanjiDecks' | 'Reading' | 'OldVocab' | 'KanjiGame' | 'BookStorage';

const TOOLS: {
  title: string;
  description: string;
  emoji: string;
  tint: string;
  route: ToolRoute;
}[] = [
  {
    title: 'Free book',
    description: 'Open a downloadable library of JLPT books, old papers, and study resources.',
    emoji: '📚',
    tint: colors.success,
    route: 'BookStorage',
  },
  {
    title: 'Kanji flashcards',
    description: 'JLPT N5–N1 decks plus Kanji Master — readings, meanings, examples.',
    emoji: '📇',
    tint: colors.primary,
    route: 'KanjiDecks',
  },
  {
    title: 'JLPT reading',
    description: 'Passages with Burmese translations and multiple-choice questions.',
    emoji: '📖',
    tint: colors.link,
    route: 'Reading',
  },
  {
    title: 'Old exam vocabulary',
    description: 'Vocabulary from past JLPT papers by level and exam date.',
    emoji: '📝',
    tint: colors.warning,
    route: 'OldVocab',
  },
  {
    title: 'Kanji quick game',
    description: 'Tap the kanji that matches the prompt — fully offline.',
    emoji: '🎯',
    tint: colors.pink,
    route: 'KanjiGame',
  },
];

function StudyTile({
  title,
  description,
  emoji,
  tint,
  onPress,
}: {
  title: string;
  description: string;
  emoji: string;
  tint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        shadows.md,
        pressed && styles.tilePressed,
      ]}
    >
      <View style={[styles.tileIcon, { backgroundColor: tint + '18' }]}>
        <Text style={styles.tileEmoji}>{emoji}</Text>
      </View>
      <View style={styles.tileBody}>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileDesc}>{description}</Text>
        <View style={styles.tileFooter}>
          <Text style={[styles.tileCta, { color: tint }]}>Open</Text>
          <Text style={[styles.tileArrow, { color: tint }]}>→</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, shadows.lg]}>
          <Text style={styles.heroKicker}>JLPT · မြန်မာ</Text>
          <Text style={styles.heroTitle}>Learn Japanese</Text>
          <Text style={styles.heroJp}>日本語をマスターしよう</Text>
          <Text style={styles.heroSub}>
            Study grammar, kanji, reading, and exam vocabulary offline. Take full JLPT mock exams online. No ads.
          </Text>
          <View style={styles.heroActions}>
            <Pressable
              style={({ pressed }) => [
                styles.heroBtnPrimary,
                pressed && styles.heroBtnPressed,
              ]}
              onPress={() => navigation.navigate('JLPTWebView')}
            >
              <Text style={styles.heroBtnPrimaryText}>JLPT mock exam</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.modeNotice}>
          <Text style={styles.modeTitle}>Offline study + online exam</Text>
          <Text style={styles.modeText}>
            Grammar, Kanji, reading, vocabulary, and games are bundled on your device. The JLPT mock exam (with listening audio) runs on jlptburmese.com and needs an internet connection.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Study tools</Text>

        {TOOLS.map((t) => (
          <StudyTile
            key={t.route}
            title={t.title}
            description={t.description}
            emoji={t.emoji}
            tint={t.tint}
            onPress={() => navigation.navigate(t.route)}
          />
        ))}

        <Pressable
          style={({ pressed }) => [styles.aboutBtn, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.aboutBtnText}>About & contact</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl + spacing.md,
  },
  hero: {
    backgroundColor: colors.headerBg,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
    overflow: 'hidden',
  },
  heroKicker: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: colors.onHeader,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  heroJp: {
    color: colors.headerMuted,
    fontSize: 17,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  heroSub: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.lg,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  heroBtnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    minWidth: '46%',
    flexGrow: 1,
  },
  heroBtnPrimaryText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  heroBtnGhost: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    minWidth: '46%',
    flexGrow: 1,
  },
  heroBtnGhostText: {
    color: colors.onHeader,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  heroBtnPressed: { opacity: 0.88 },
  modeNotice: {
    backgroundColor: colors.successBg,
    borderColor: colors.success + '45',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  modeTitle: { color: colors.success, fontSize: 14, fontWeight: '800' },
  modeText: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: spacing.xs },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: colors.muted,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  tile: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tilePressed: { opacity: 0.94 },
  tileIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileEmoji: { fontSize: 26 },
  tileBody: { flex: 1, minWidth: 0 },
  tileTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  tileDesc: {
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  tileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
  },
  tileCta: { fontSize: 14, fontWeight: '700' },
  tileArrow: { fontSize: 15, fontWeight: '700' },
  aboutBtn: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  aboutBtnText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 15,
  },
});
