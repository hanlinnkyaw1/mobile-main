import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowUpRight,
  BookOpen,
  Download,
  Flame,
  Gamepad2,
  Layers3,
  NotebookPen,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows, spacing, type } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type ToolRoute = 'KanjiDecks' | 'Reading' | 'OldVocab' | 'KanjiGame' | 'BookStorage';

type Tool = {
  title: string;
  jp: string;
  tint: string;
  route: ToolRoute;
  icon: typeof BookOpen;
};

const DAILY_PROGRESS = 65;
const WEEK_TREND = [0.3, 0.5, 0.38, 0.55, 0.45, 0.8, 0.9];
const NAVY = '#27306B';
const SUN = '#FF6F59';
const CHART = '#2BB59B';

const TOOLS: Tool[] = [
  { title: 'Free books', jp: '無料書籍ダウンロード', icon: Download, tint: colors.primary, route: 'BookStorage' },
  { title: 'Kanji decks', jp: '漢字カード', icon: Layers3, tint: colors.success, route: 'KanjiDecks' },
  { title: 'Reading', jp: '読解練習', icon: BookOpen, tint: colors.link, route: 'Reading' },
  { title: 'Vocabulary', jp: '語彙練習', icon: NotebookPen, tint: colors.warning, route: 'OldVocab' },
  { title: 'Quick game', jp: '漢字ゲーム', icon: Gamepad2, tint: colors.pink, route: 'KanjiGame' },
];

function ProgressRing({ percent, size = 76, thickness = 8 }: { percent: number; size?: number; thickness?: number }) {
  const p = Math.max(0, Math.min(100, percent));
  const total = p * 3.6;
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
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: thickness, borderColor: '#DDF3EA' }} />
      <View style={{ position: 'absolute', left: size / 2, width: size / 2, height: size, overflow: 'hidden' }}>
        <View style={[arc, { left: -size / 2, transform: [{ rotate: `${-135 + rightDeg}deg` }] }]} />
      </View>
      <View style={{ position: 'absolute', left: 0, width: size / 2, height: size, overflow: 'hidden' }}>
        <View style={[arc, { left: 0, transform: [{ rotate: `${45 + leftDeg}deg` }] }]} />
      </View>
      <Text style={styles.ringText}>{p}%</Text>
    </View>
  );
}

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
              transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
            }}
          />
        );
      })}
      <View style={[styles.chartDot, { left: last.x - 5, top: last.y - 5 }]} />
    </View>
  );
}

function HeroIllustration({ phone }: { phone: boolean }) {
  return (
    <View style={[styles.illustration, phone && styles.illustrationPhone]} pointerEvents="none">
      <View style={styles.sun} />
      <View style={styles.mountain} />
      <View style={styles.mountainCap} />
      <View style={styles.cloudOne} />
      <View style={styles.cloudTwo} />
      <View style={styles.book}>
        <View style={styles.bookLabel}><Text style={styles.bookLabelText}>日本語</Text></View>
      </View>
      <View style={styles.notebook}>
        <View style={styles.notebookLine} />
        <View style={styles.notebookLine} />
        <View style={styles.notebookLine} />
      </View>
      <View style={styles.pen} />
      <View style={styles.manabu}>
        <Text style={styles.manabuKanji}>学</Text>
        <Text style={styles.manabuKana}>まなぶ</Text>
      </View>
      <Text style={[styles.blossom, { top: 104, right: 2, fontSize: 22 }]}>✿</Text>
      <Text style={[styles.blossom, { top: 128, right: 22, fontSize: 15 }]}>✿</Text>
    </View>
  );
}

function StudyTile({ tool, onPress, compact }: { tool: Tool; onPress: () => void; compact: boolean }) {
  const Icon = tool.icon;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, compact && styles.tileCompact, pressed && styles.tilePressed]}>
      <View style={[styles.tileIcon, { backgroundColor: `${tool.tint}1A` }]}>
        <Icon size={compact ? 20 : 22} color={tool.tint} strokeWidth={2.3} />
      </View>
      <View style={styles.tileCopy}>
        <Text style={styles.tileTitle} numberOfLines={1}>{tool.title}</Text>
        <Text style={styles.tileJp} numberOfLines={1}>{tool.jp}</Text>
      </View>
      <ArrowUpRight size={17} color={tool.tint} strokeWidth={2.4} />
    </Pressable>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const phone = width < 420;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={[styles.scroll, compact && styles.scrollCompact]} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoEmoji}>⛩️</Text></View>
            <View>
              <Text style={styles.brandText}>JLPT Burmese</Text>
              <Text style={styles.brandSub}>Your Japanese study space</Text>
            </View>
          </View>
          <Pressable style={({ pressed }) => [styles.avatar, pressed && styles.pressed]} onPress={() => navigation.navigate('About')} accessibilityLabel="About and contact">
            <Text style={styles.avatarText}>M</Text>
          </Pressable>
        </View>

          <View style={[styles.hero, compact && styles.heroCompact, phone && styles.heroPhone]}>
            <View style={styles.heroGlow} />
          <View style={[styles.heroCopy, compact && styles.heroCopyCompact]}>
            <Text style={styles.eyebrow}>JLPT MOCK EXAM</Text>
            <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Ready for your{phone ? ' ' : '\n'}JLPT mock exam?</Text>
            <Text style={styles.heroJp}>本番前に実力をチェックしよう</Text>
            <Text style={styles.heroSub}>Practice with timed questions and see how ready you are for exam day.</Text>
            <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]} onPress={() => navigation.navigate('JLPTWebView')}>
              <Text style={styles.ctaText}>Take mock exam</Text>
              <ArrowUpRight size={18} color={colors.onPrimary} strokeWidth={2.6} />
            </Pressable>
          </View>
          <HeroIllustration phone={phone} />
        </View>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionTitle}>Your progress</Text><Text style={styles.sectionSub}>Keep the streak alive</Text></View>
          <View style={styles.streak}><Flame size={15} color={SUN} fill={SUN} /><Text style={styles.streakText}>7 day streak</Text></View>
        </View>
        <View style={[styles.progressCard, shadows.md, compact && styles.progressCardCompact]}>
          <ProgressRing percent={DAILY_PROGRESS} size={phone ? 68 : 76} />
          <View style={styles.progressBody}>
            <Text style={styles.progressTitle}>Daily goal</Text>
            <Text style={styles.progressValue}>You&apos;re making progress</Text>
            <Text style={styles.progressSub}>35 minutes left to reach today&apos;s goal.</Text>
          </View>
          <Sparkline values={WEEK_TREND} width={phone ? 76 : 96} height={phone ? 52 : 60} />
        </View>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionTitle}>Study tools</Text><Text style={styles.sectionSub}>Pick up where you left off</Text></View>
          <Text style={styles.toolCount}>{TOOLS.length} tools</Text>
        </View>
        <View style={[styles.tilesRow, compact && styles.tilesGrid]}>
          {TOOLS.map((tool) => <StudyTile key={tool.route} tool={tool} compact={compact} onPress={() => navigation.navigate(tool.route)} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 40, maxWidth: 1120, width: '100%', alignSelf: 'center' },
  scrollCompact: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logo: { width: 42, height: 42, borderRadius: 21, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 19 },
  brandText: { fontSize: 18, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  brandSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DDF3EA', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#C6E8DB' },
  avatarText: { fontSize: 14, fontWeight: '800', color: colors.success },
  pressed: { opacity: 0.78 },
  hero: { minHeight: 248, marginTop: spacing.xl, marginBottom: spacing.xxl, backgroundColor: colors.surface, borderRadius: radius.xxl, overflow: 'hidden', padding: spacing.xl, position: 'relative', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  heroCompact: { minHeight: 270, padding: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.xl },
  heroPhone: { minHeight: 380, padding: spacing.lg, justifyContent: 'flex-start' },
  heroGlow: { position: 'absolute', width: 280, height: 180, borderRadius: 140, backgroundColor: '#EEF0FF', right: -70, top: -100, opacity: 0.9 },
  heroCopy: { zIndex: 2, maxWidth: '54%' },
  heroCopyCompact: { maxWidth: '100%' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginBottom: spacing.sm },
  heroTitle: { fontSize: 32, lineHeight: 36, fontWeight: '800', color: NAVY, letterSpacing: -0.9 },
  heroTitleCompact: { fontSize: 27, lineHeight: 31 },
  heroJp: { fontSize: 15, color: colors.muted, marginTop: spacing.sm, fontWeight: '600' },
  heroSub: { fontSize: 13, color: colors.muted, marginTop: spacing.md, maxWidth: 320, lineHeight: 18 },
  cta: { marginTop: spacing.md, minHeight: 44, paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'flex-start', minWidth: 175, gap: spacing.lg, ...shadows.sm },
  ctaPressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
  ctaText: { color: colors.onPrimary, fontSize: 14, fontWeight: '800' },
  illustration: { position: 'absolute', right: -4, top: -4, width: 320, height: 250, opacity: 0.98, transform: [{ scale: 0.86 }] },
  illustrationPhone: { right: -48, top: 182, transform: [{ scale: 0.58 }] },
  sun: { position: 'absolute', left: 172, top: 6, width: 82, height: 82, borderRadius: 41, backgroundColor: SUN },
  mountain: { position: 'absolute', left: 78, top: 74, width: 0, height: 0, borderLeftWidth: 104, borderRightWidth: 104, borderBottomWidth: 112, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: NAVY },
  mountainCap: { position: 'absolute', left: 172 - 22, top: 74, width: 0, height: 0, borderLeftWidth: 22, borderRightWidth: 22, borderBottomWidth: 22, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FFFFFF' },
  cloudOne: { position: 'absolute', left: 42, top: 102, width: 110, height: 16, borderRadius: 12, backgroundColor: '#EEF0FF' },
  cloudTwo: { position: 'absolute', right: 2, top: 102, width: 96, height: 16, borderRadius: 12, backgroundColor: '#EEF0FF' },
  notebook: { position: 'absolute', left: 190, top: 157, width: 126, height: 88, backgroundColor: '#FFFFFF', borderRadius: 9, borderWidth: 1, borderColor: '#D5D9EE', padding: 12, justifyContent: 'space-around', transform: [{ rotate: '5deg' }] },
  notebookLine: { height: 3, backgroundColor: '#D5D9EE', borderRadius: 2, marginLeft: 48 },
  pen: { position: 'absolute', left: 282, top: 151, width: 7, height: 96, borderRadius: 4, backgroundColor: NAVY, transform: [{ rotate: '28deg' }] },
  book: { position: 'absolute', left: 66, top: 130, width: 94, height: 124, backgroundColor: NAVY, borderRadius: 9, transform: [{ rotate: '-7deg' }], paddingTop: 23, alignItems: 'center' },
  bookLabel: { backgroundColor: '#FFFFFF', borderRadius: 4, paddingVertical: 5, paddingHorizontal: 8 },
  bookLabelText: { fontSize: 12, fontWeight: '800', color: NAVY },
  manabu: { position: 'absolute', left: 166, top: 177, width: 64, height: 80, backgroundColor: '#DDF3EA', borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  manabuKanji: { fontSize: 31, fontWeight: '800', color: colors.success },
  manabuKana: { fontSize: 10, color: colors.success, marginTop: 2 },
  blossom: { position: 'absolute', color: '#F4A8A1' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { ...type.headline, color: colors.text },
  sectionSub: { ...type.caption, color: colors.muted, marginTop: 2 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFF3E8', paddingVertical: 7, paddingHorizontal: 10, borderRadius: radius.full },
  streakText: { fontSize: 11, fontWeight: '800', color: '#C65B2D' },
  progressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.xxl },
  progressCardCompact: { marginBottom: spacing.xl, padding: spacing.md, gap: spacing.sm },
  ringText: { fontSize: 18, fontWeight: '800', color: colors.text },
  progressBody: { flex: 1, minWidth: 0 },
  progressTitle: { fontSize: 13, color: colors.muted, fontWeight: '700' },
  progressValue: { fontSize: 16, color: colors.text, fontWeight: '800', marginTop: 3 },
  progressSub: { fontSize: 12, color: colors.muted, marginTop: 4, lineHeight: 17 },
  chart: { backgroundColor: '#E8F7F1', borderRadius: radius.lg, overflow: 'hidden' },
  chartDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: CHART },
  toolCount: { fontSize: 12, color: colors.muted, fontWeight: '700' },
  tilesRow: { flexDirection: 'row', gap: spacing.md },
  tilesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: { flex: 1, minWidth: 0, minHeight: 112, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, justifyContent: 'space-between', alignItems: 'flex-start', ...shadows.sm },
  tileCompact: { flexBasis: '48%', flexGrow: 1, minHeight: 92, padding: spacing.md },
  tilePressed: { opacity: 0.88, transform: [{ translateY: 1 }] },
  tileIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  tileCopy: { flex: 1, width: '100%' },
  tileTitle: { fontSize: 13, fontWeight: '800', color: colors.text },
  tileJp: { fontSize: 10, color: colors.muted, marginTop: 3 },
});
