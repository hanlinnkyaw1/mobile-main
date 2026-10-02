import { useRef, useState } from 'react';
import { Text, View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readingByLevel } from '../data/bundled';
import type { ReadingQuiz } from '../types';

// ─── DESIGN TOKENS (Tailwind palette used by the web version) ─────────────
const C = {
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  white: '#ffffff',
  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo200: '#c7d2fe',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',
  indigo700: '#4338ca',
  emerald50: '#ecfdf5',
  emerald500: '#10b981',
  emerald600: '#059669',
  rose50: '#fff1f2',
  rose500: '#f43f5e',
  rose600: '#e11d48',
  blue400: '#60a5fa',
  purple400: '#c084fc',
  amber300: '#fcd34d',
  emerald400: '#34d399',
};

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

const LEVEL_COLORS: Record<string, string> = {
  N5: '#10b981', // emerald-500
  N4: '#0ea5e9', // sky-500
  N3: '#f59e0b', // amber-500
  N2: '#f97316', // orange-500
  N1: '#dc2626', // red-600
};

const LEVEL_NAMES: Record<string, string> = {
  N5: 'Level N5 (Beginner)',
  N4: 'Level N4 (Elementary)',
  N3: 'Level N3 (Intermediate)',
  N2: 'Level N2 (Advanced)',
  N1: 'Level N1 (Expert)',
};

type Level = keyof typeof readingByLevel;

const softShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 2,
  shadowOffset: { width: 0, height: 1 },
  elevation: 1,
};

// ─── SELECTION SCREEN ─────────────────────────────────────────────────────
function SelectionScreen({ onPick }: { onPick: (k: Level) => void }) {
  return (
    <SafeAreaView style={sel.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={sel.scroll} showsVerticalScrollIndicator={false}>
        <View style={sel.inner}>
          <View style={sel.head}>
            <Text style={sel.title}>JLPT Reading Test</Text>
            <Text style={sel.sub}>Choose your level to begin (N5 - N1)</Text>
          </View>

          {LEVELS.map((key) => (
            <Pressable
              key={key}
              onPress={() => onPick(key as Level)}
              style={({ pressed }) => [sel.card, pressed && { transform: [{ scale: 0.95 }] }]}
            >
              <View style={[sel.badge, { backgroundColor: LEVEL_COLORS[key] }]}>
                <Text style={sel.badgeText}>{key}</Text>
              </View>
              <Text style={sel.cardName}>{LEVEL_NAMES[key]}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────
export default function ReadingScreen() {
  const [level, setLevel] = useState<Level | null>(null);
  const [idx, setIdx] = useState(0);
  const [showTrans, setShowTrans] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const feedbackY = useRef(0);

  const quiz: ReadingQuiz[] = level ? readingByLevel[level] : [];
  const q = quiz[idx];

  const resetQuestion = () => {
    setShowTrans(false);
    setSelected(null);
    setSubmitted(false);
  };

  const pickLevel = (k: Level) => {
    setLevel(k);
    setIdx(0);
    resetQuestion();
  };

  const exitTest = () => {
    setLevel(null);
    setIdx(0);
    resetQuestion();
  };

  const goTo = (i: number) => {
    if (i < 0 || i >= quiz.length) return;
    setIdx(i);
    resetQuestion();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSubmit = () => {
    if (selected == null || !q) return;
    setSubmitted(true);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(feedbackY.current - 8, 0), animated: true });
    }, 300);
  };

  if (!level) return <SelectionScreen onPick={pickLevel} />;

  if (!q) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <Pressable style={s.backRow} onPress={exitTest}>
          <Text style={s.backText}>← Levels</Text>
        </Pressable>
        <Text style={s.empty}>No reading data for this level.</Text>
      </SafeAreaView>
    );
  }

  const correct = q.question.correct_answer;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {/* ── HEADER ── */}
      <View style={s.header}>
        <Text style={s.headerLevel}>{level} Reading</Text>
        <Pressable style={({ pressed }) => [s.exitBtn, pressed && { backgroundColor: C.slate200 }]} onPress={exitTest}>
          <Text style={s.exitText}>Exit Test</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + level/topic pill */}
        <View style={s.titleRow}>
          <Text style={s.pageTitle}>読解 Analysis</Text>
          <View style={s.pill}>
            <Text style={s.pillText}>
              Level: {level}
              {q.topic ? ` | ${q.topic}` : ''}
            </Text>
          </View>
        </View>

        {/* Pagination */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.pager}
          contentContainerStyle={s.pagerContent}
        >
          {quiz.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              style={[s.pageBtn, i === idx && s.pageBtnActive]}
            >
              <Text style={[s.pageBtnText, i === idx && s.pageBtnTextActive]}>{i + 1}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Passage card */}
        <View style={s.card}>
          <Text style={s.passageLabel}>Passage</Text>
          <Text style={s.passageText}>{q.content.text}</Text>

          <View style={s.transBox}>
            <Pressable
              onPress={() => setShowTrans(!showTrans)}
              style={({ pressed }) => [s.transToggle, pressed && { backgroundColor: C.slate100 }]}
            >
              <Text style={s.transToggleText}>Show Burmese Translation (မြန်မာဘာသာပြန်)</Text>
              <Text style={[s.transIcon, showTrans && { transform: [{ rotate: '180deg' }] }]}>▾</Text>
            </Pressable>
            {showTrans && (
              <View style={s.transBody}>
                <Text style={s.transText}>{q.content.translation}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Question card */}
        <View style={[s.card, s.questionCard]}>
          <Text style={s.questionText}>問い： {q.question.query}</Text>

          <View style={{ gap: 12 }}>
            {q.question.options.map((opt) => {
              let state: OptState = 'default';
              if (submitted) {
                if (opt.id === correct) state = 'correct';
                else if (opt.id === selected) state = 'wrong';
              } else if (selected === opt.id) {
                state = 'selected';
              }
              return (
                <OptionButton
                  key={opt.id}
                  id={opt.id}
                  text={opt.text}
                  state={state}
                  disabled={submitted}
                  onPress={() => setSelected(opt.id)}
                />
              );
            })}
          </View>

          {!submitted && (
            <Pressable
              style={[s.submitBtn, selected == null && s.submitOff]}
              disabled={selected == null}
              onPress={handleSubmit}
            >
              <Text style={s.submitText}>Check Answer</Text>
            </Pressable>
          )}
        </View>

        {/* AI feedback */}
        {submitted && q.ai_style_framework && (
          <View onLayout={(e) => { feedbackY.current = e.nativeEvent.layout.y; }}>
            <AIFeedback framework={q.ai_style_framework} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── OPTION BUTTON ────────────────────────────────────────────────────────
type OptState = 'default' | 'selected' | 'correct' | 'wrong';

function OptionButton({
  id, text, state, disabled, onPress,
}: {
  id: number; text: string; state: OptState; disabled: boolean; onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const btnStyle = [
    o.btn,
    state === 'default' && pressed && o.hover,
    state === 'selected' && o.selected,
    state === 'correct' && o.correct,
    state === 'wrong' && o.wrong,
  ];
  const badgeStyle = [
    o.badge,
    state === 'selected' && { backgroundColor: C.indigo600 },
    state === 'correct' && { backgroundColor: C.emerald600 },
    state === 'wrong' && { backgroundColor: C.rose600 },
  ];
  const badgeTextStyle = [
    o.badgeText,
    (state === 'selected' || state === 'correct' || state === 'wrong') && { color: C.white },
  ];

  return (
    // Outer wrapper emulates the web's "ring-4 ring-indigo-100" on the selected option
    <View style={[o.ring, state === 'selected' && { borderColor: C.indigo100 }]}>
      <Pressable
        style={btnStyle}
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
      >
        <View style={badgeStyle}>
          <Text style={badgeTextStyle}>{id}</Text>
        </View>
        <Text style={o.text}>{text}</Text>
        {state === 'correct' && <Text style={[o.result, { color: C.emerald600 }]}>✓ မှန်ပါတယ်</Text>}
        {state === 'wrong' && <Text style={[o.result, { color: C.rose600 }]}>✗ မှားပါတယ်</Text>}
      </Pressable>
    </View>
  );
}

// ─── AI FEEDBACK ──────────────────────────────────────────────────────────
function AIFeedback({
  framework,
}: {
  framework: NonNullable<ReadingQuiz['ai_style_framework']>;
}) {
  return (
    <View style={ai.card}>
      <View style={ai.header}>
        <Text style={ai.headerTitle}>
          <Text style={{ color: C.blue400 }}>AI</Text> Analysis
        </Text>
      </View>

      <View style={ai.grid}>
        {framework.attention && (
          <View style={ai.section}>
            <Text style={[ai.sectionTitle, { color: C.blue400 }]}>
              🔍 {framework.attention.title || 'What to Notice'}
            </Text>
            <View style={{ gap: 8 }}>
              {(framework.attention.points || []).map((p: string, i: number) => (
                <Text key={i} style={ai.prose}>• {p}</Text>
              ))}
            </View>
          </View>
        )}

        {framework.intent && (
          <View style={ai.section}>
            <Text style={[ai.sectionTitle, { color: C.purple400 }]}>
              🎯 {framework.intent.title || 'Question Intent'}
            </Text>
            <Text style={ai.prose}>{framework.intent.description}</Text>
          </View>
        )}

        {framework.concept && (
          <View style={ai.section}>
            <Text style={[ai.sectionTitle, { color: '#fbbf24' }]}>
              💡 {framework.concept.title || 'Key Concept'}
            </Text>
            {framework.concept.key_term ? (
              <View style={ai.chip}>
                <Text style={ai.chipText}>{framework.concept.key_term}</Text>
              </View>
            ) : null}
            <Text style={ai.prose}>{framework.concept.explanation}</Text>
          </View>
        )}

        {framework.analogy && (
          <View style={ai.section}>
            <Text style={[ai.sectionTitle, { color: C.emerald400 }]}>
              🌉 {framework.analogy.title || 'Analogy'}
            </Text>
            <Text style={ai.scenario}>{framework.analogy.scenario}</Text>
            <View style={ai.quote}>
              <Text style={ai.quoteText}>{framework.analogy.comparison}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── STYLES: SELECTION ────────────────────────────────────────────────────
const sel = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.slate50 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  inner: { width: '100%', maxWidth: 448, alignSelf: 'center', gap: 12 },
  head: { alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '700', color: C.slate800 },
  sub: { fontSize: 16, color: C.slate500, marginTop: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.slate200,
    borderRadius: 16,
    padding: 16,
    ...softShadow,
  },
  badge: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: C.white, fontWeight: '700', fontSize: 16 },
  cardName: { marginLeft: 16, fontWeight: '700', fontSize: 16, color: C.slate700, flexShrink: 1 },
});

// ─── STYLES: QUIZ ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.slate50 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.slate200,
    ...softShadow,
  },
  headerLevel: { fontSize: 18, fontWeight: '700', color: C.indigo600, textTransform: 'uppercase', letterSpacing: -0.3 },
  exitBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: C.slate100 },
  exitText: { fontSize: 12, fontWeight: '700', color: C.slate500, textTransform: 'uppercase' },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48, gap: 24, width: '100%', maxWidth: 896, alignSelf: 'center' },

  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  pageTitle: { fontSize: 20, fontWeight: '700', color: C.slate800 },
  pill: { backgroundColor: C.indigo100, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontSize: 10, fontWeight: '700', color: C.indigo700, textTransform: 'uppercase' },

  pager: { flexGrow: 0 },
  pagerContent: { gap: 8, paddingBottom: 4 },
  pageBtn: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: C.slate200, backgroundColor: C.white,
  },
  pageBtnActive: {
    backgroundColor: C.indigo600, borderColor: C.indigo600,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  pageBtnText: { fontWeight: '700', color: C.slate500 },
  pageBtnTextActive: { color: C.white },

  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.slate200,
    ...softShadow,
  },
  passageLabel: {
    fontSize: 12, fontWeight: '700', color: C.slate400,
    textTransform: 'uppercase', letterSpacing: 0.8, margin: 12,
  },
  passageText: {
    fontSize: 16, lineHeight: 32, color: C.slate800,
    backgroundColor: C.slate50, padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: C.slate100,
    marginHorizontal: 0, marginBottom: 4, overflow: 'hidden',
  },
  transBox: {
    borderWidth: 1, borderColor: C.slate200, borderRadius: 12,
    overflow: 'hidden', marginTop: 4,
  },
  transToggle: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.slate50, paddingVertical: 12, paddingHorizontal: 20,
  },
  transToggleText: { flex: 1, fontSize: 14, fontWeight: '600', color: C.slate600, paddingRight: 8 },
  transIcon: { fontSize: 14, color: C.slate600 },
  transBody: { borderTopWidth: 1, borderTopColor: C.slate200, backgroundColor: C.white, padding: 20 },
  transText: { fontSize: 14, lineHeight: 23, color: C.slate700 },

  questionCard: { padding: 20 },
  questionText: { fontSize: 18, fontWeight: '700', color: C.slate800, marginBottom: 24, lineHeight: 26 },

  submitBtn: { marginTop: 32, backgroundColor: C.indigo600, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitOff: { opacity: 0.4 },
  submitText: { color: C.white, fontWeight: '700', fontSize: 16 },

  backRow: { padding: 20 },
  backText: { color: C.indigo600, fontWeight: '700', fontSize: 15 },
  empty: { textAlign: 'center', color: C.slate500, fontSize: 16, paddingHorizontal: 24, marginTop: 20 },
});

// ─── STYLES: OPTION ───────────────────────────────────────────────────────
const o = StyleSheet.create({
  ring: { borderWidth: 4, borderColor: 'transparent', borderRadius: 16, margin: -4 },
  btn: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 16, borderRadius: 12,
    borderWidth: 2, borderColor: C.slate100, backgroundColor: C.white,
  },
  hover: { borderColor: C.indigo200, backgroundColor: 'rgba(238,242,255,0.5)' },
  selected: { borderColor: C.indigo500, backgroundColor: C.indigo50 },
  correct: { borderColor: C.emerald500, backgroundColor: C.emerald50 },
  wrong: { borderColor: C.rose500, backgroundColor: C.rose50 },
  badge: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', backgroundColor: C.slate100,
  },
  badgeText: { fontSize: 14, fontWeight: '700', color: C.slate600 },
  text: { flex: 1, fontSize: 15, lineHeight: 22, color: C.slate700, paddingTop: 2 },
  result: { fontWeight: '700', fontSize: 13, alignSelf: 'center' },
});

// ─── STYLES: AI FEEDBACK ──────────────────────────────────────────────────
const ai = StyleSheet.create({
  card: {
    backgroundColor: C.slate900,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.slate800,
    padding: 24,
    marginTop: 8,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  header: { borderBottomWidth: 1, borderBottomColor: C.slate800, paddingBottom: 16, marginBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: C.white },
  grid: { gap: 24 },
  section: {
    backgroundColor: 'rgba(30,41,59,0.5)',
    borderRadius: 12, borderWidth: 1, borderColor: C.slate700, padding: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  prose: { fontSize: 12, lineHeight: 20, color: C.slate300 },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 8,
  },
  chipText: { fontSize: 10, fontWeight: '700', color: C.amber300, textTransform: 'uppercase' },
  scenario: { fontSize: 12, fontWeight: '600', color: C.white, marginBottom: 8, lineHeight: 18 },
  quote: { borderLeftWidth: 2, borderLeftColor: 'rgba(16,185,129,0.5)', paddingLeft: 12 },
  quoteText: { fontSize: 11, fontStyle: 'italic', color: C.slate400, lineHeight: 18 },
});
