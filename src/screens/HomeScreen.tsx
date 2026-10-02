import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows, spacing } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type ToolRoute = 'KanjiDecks' | 'Reading' | 'OldVocab' | 'KanjiGame' | 'BookStorage';

// TODO: replace with real value from your progress storage
const DAILY_PROGRESS = 65;
const WEEK_TREND = [0.3, 0.5, 0.38, 0.55, 0.45, 0.8, 0.9];

const NAVY = '#27306B';
const SUN = '#FF6F59';

const TOOLS: {
  title: string;
  jp: string;
  icon: string;
  isText?: boolean;
  tint: string;
  route: ToolRoute;
}[] = [
  { title: 'Free books download', jp: '無料書籍ダウンロード', icon: '📥', tint: colors.primary, route: 'BookStorage' },
  { title: 'Kanji', jp: '漢字カード', icon: '漢', isText: true, tint: colors.success, route: 'KanjiDecks' },
  { title: 'Reading', jp: '読解練習', icon: '📖', tint: colors.link, route: 'Reading' },
  { title: 'Vocabulary', jp: '語彙練習', icon: '📝', tint: colors.warning, route: 'OldVocab' },
  { title: 'Quick game', jp: '漢字ゲーム', icon: '🎯', tint: colors.pink, route: 'KanjiGame' },
];

/* ---------- Progress ring (pure Views, no extra dependency) ---------- */
function ProgressRing({ percent, size = 76, thickness = 8 }: { percent: number; size?: number; thickness?: number }) {
  const p = Math.max(0, Math.min(100, percent));
  const total = p * 3.6; // degrees
  const rightDeg = Math.min(total, 180);
  const leftDeg = Math.max(total - 180, 0);

  const arc = {
    position: 'absolute' as const,
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: thickness,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.primary,
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* track */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: '#DDF3EA',
        }}
      />
      {/* right half */}
      <View style={{ position: 'absolute', left: size / 2, width: size / 2, height: size, overflow: 'hidden' }}>
        <View style={[arc, { left: -size / 2, transform: [{ rotate: `${-135 + rightDeg}deg` }] }]} />
      </View>
      {/* left half */}
      <View style={{ position: 'absolute', left: 0, width: size / 2, height: size, overflow: 'hidden' }}>
        <View style={[arc, { left: 0, transform: [{ rotate: `${45 + leftDeg}deg` }] }]} />
      </View>
      <Text style={styles.ringText}>{p}%</Text>
    </View>
  );
}

/* ---------- Sparkline (rotated line segments) ---------- */
function Sparkline({ values, width, height }: { values: number[]; width: number; height: number }) {
  const pad = 14;
  const pts = values.map((v, i) => ({
    x: pad + (i * (width - pad * 2)) / (values.length - 1),
    y: height - pad - v * (height - pad * 2),
  }));
  const last = pts[pts.length - 1];

  return (
    <View style={[styles.chart, { width, height }]}>
      {pts.slice(1).map((b, i) => {
        const a = pts[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: (a.x + b.x) / 2 - len / 2,
              top: (a.y + b.y) / 2 - 1.5,
              width: len,
              height: 3,
              borderRadius: 2,
              backgroundColor: CHART,
              transform: [{ rotate: `${angle}rad` }],
            }}
          />
        );
      })}
      <View style={[styles.chartDot, { left: last.x - 5, top: last.y - 5 }]} />
    </View>
  );
}
const CHART = '#2BB59B';

/* ---------- Hero illustration (Fuji, sun, books, sakura) ---------- */
function HeroIllustration() {
  return (
    <View style={styles.illus} pointerEvents="none">
      <View style={styles.sun} />
      <View style={styles.mountain} />
      <View style={styles.mountainCap} />
      <View style={styles.notebook}>
        <View style={styles.notebookLine} />
        <View style={styles.notebookLine} />
        <View style={styles.notebookLine} />
      </View>
      <View style={styles.pen} />
      <View style={styles.book}>
        <View style={styles.bookLabel}>
          <Text style={styles.bookLabelText}>日本語</Text>
        </View>
      </View>
      <View style={styles.manabu}>
        <Text style={styles.manabuKanji}>学</Text>
        <Text style={styles.manabuKana}>まなぶ</Text>
      </View>
      <Text style={[styles.blossom, { top: 58, right: 2, fontSize: 22 }]}>🌸</Text>
      <Text style={[styles.blossom, { top: 74, right: 20, fontSize: 16 }]}>🌸</Text>
    </View>
  );
}

function StudyTile({
  title,
  jp,
  icon,
  isText,
  tint,
  onPress,
}: {
  title: string;
  jp: string;
  icon: string;
  isText?: boolean;
  tint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, shadows.md, pressed && styles.tilePressed]}
    >
      <View style={[styles.tileIcon, { backgroundColor: tint + '1F' }]}>
        <Text style={isText ? [styles.tileIconText, { color: tint }] : styles.tileEmoji}>{icon}</Text>
      </View>
      <Text style={styles.tileTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.tileJp} numberOfLines={2}>
        {jp}
      </Text>
      <Text style={[styles.tileArrow, { color: tint }]}>→</Text>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }: Props) {
  return (
    // 'top' edge included because the new design has its own header row.
    // Set options={{ headerShown: false }} for Home in your navigator.
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoEmoji}>⛩️</Text>
            </View>
            <Text style={styles.brandText}>JLPT Burmese</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.85 }]}
            onPress={() => navigation.navigate('About')}
            accessibilityLabel="About & contact"
          >
            <Text style={styles.avatarEmoji}>👤</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <HeroIllustration />
          <Text style={styles.heroTitle}>Learn Japanese{'\n'}with confidence</Text>
          <Text style={styles.heroJp}>日本語をマスターしよう</Text>
          <Text style={styles.heroSub}>Continue your JLPT journey</Text>
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            onPress={() => navigation.navigate('JLPTWebView')}
          >
            <Text style={styles.ctaText}>Start testing</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>
        </View>

        {/* Daily progress */}
        <View style={[styles.progressCard, shadows.md]}>
          <ProgressRing percent={DAILY_PROGRESS} />
          <View style={styles.progressBody}>
            <Text style={styles.progressTitle}>Daily progress</Text>
            <Text style={styles.progressSub}>Great job! Keep it up.</Text>
          </View>
          <Sparkline values={WEEK_TREND} width={96} height={60} />
        </View>

        {/* Study tools */}
        <View style={styles.tilesRow}>
          {TOOLS.map((t) => (
            <StudyTile
              key={t.route}
              title={t.title}
              jp={t.jp}
              icon={t.icon}
              isText={t.isText}
              tint={t.tint}
              onPress={() => navigation.navigate(t.route)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  /* top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 18 },
  brandText: { fontSize: 18, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DDF3EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },

  /* hero */
  hero: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    minHeight: 260,
  },
  heroTitle: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: -0.8,
    maxWidth: '64%',
  },
  heroJp: {
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  heroSub: {
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    width: '64%',
  },
  ctaPressed: { opacity: 0.88 },
  ctaText: { color: colors.onPrimary, fontWeight: '700', fontSize: 15 },
  ctaArrow: { color: colors.onPrimary, fontWeight: '700', fontSize: 18 },

  /* illustration */
  illus: {
    position: 'absolute',
    right: -4,
    top: 0,
    width: 150,
    height: 190,
  },
  sun: {
    position: 'absolute',
    left: 52,
    top: 6,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: SUN,
  },
  mountain: {
    position: 'absolute',
    left: 0,
    top: 48,
    width: 0,
    height: 0,
    borderLeftWidth: 78,
    borderRightWidth: 78,
    borderBottomWidth: 76,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: NAVY,
  },
  mountainCap: {
    position: 'absolute',
    left: 78 - 20,
    top: 48,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  notebook: {
    position: 'absolute',
    left: 44,
    top: 102,
    width: 80,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D5D9EE',
    padding: 8,
    justifyContent: 'space-around',
    transform: [{ rotate: '3deg' }],
  },
  notebookLine: { height: 2, backgroundColor: '#D5D9EE', borderRadius: 1, marginLeft: 36 },
  pen: {
    position: 'absolute',
    left: 112,
    top: 100,
    width: 5,
    height: 58,
    borderRadius: 3,
    backgroundColor: NAVY,
    transform: [{ rotate: '30deg' }],
  },
  book: {
    position: 'absolute',
    left: 4,
    top: 70,
    width: 60,
    height: 82,
    backgroundColor: NAVY,
    borderRadius: 6,
    transform: [{ rotate: '-6deg' }],
    paddingTop: 16,
    alignItems: 'center',
  },
  bookLabel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  bookLabelText: { fontSize: 10, fontWeight: '700', color: NAVY },
  manabu: {
    position: 'absolute',
    left: 50,
    top: 112,
    width: 42,
    height: 54,
    backgroundColor: '#DDF3EA',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manabuKanji: { fontSize: 22, fontWeight: '700', color: colors.success },
  manabuKana: { fontSize: 8, color: colors.success, marginTop: 2 },
  blossom: { position: 'absolute' },

  /* progress card */
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  ringText: { fontSize: 18, fontWeight: '800', color: colors.text },
  progressBody: { flex: 1, minWidth: 0 },
  progressTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  progressSub: { fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 17 },
  chart: {
    backgroundColor: '#E8F7F1',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  chartDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CHART,
  },

  /* tiles */
  tilesRow: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tilePressed: { opacity: 0.94 },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileEmoji: { fontSize: 22 },
  tileIconText: { fontSize: 22, fontWeight: '800' },
  tileTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  tileJp: {
    fontSize: 8,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 11,
  },
  tileArrow: { fontSize: 15, fontWeight: '700', marginTop: spacing.sm },
});
