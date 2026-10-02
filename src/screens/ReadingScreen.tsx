import { useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readingByLevel } from '../data/bundled';
import type { ReadingQuiz } from '../types';
import { jlptLevel } from '../theme';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────
const T = {
  ink: '#0e0e12',
  paper: '#f7f4ee',
  cream: '#f0ead8',
  gold: '#c9a84c',
  goldLight: '#f0d48a',
  red: '#c0392b',
  green: '#27ae60',
  muted: '#8a8276',
  surface: 'rgba(247,244,238,0.04)',
  surfaceAlt: 'rgba(247,244,238,0.03)',
  border: 'rgba(201,168,76,0.2)',
  borderFaint: 'rgba(255,255,255,0.08)',
  overlay: 'rgba(14,14,18,0.92)',
};

const LEVEL_COLORS: Record<string, string> = {
  N5: '#27ae60',
  N4: '#2980b9',
  N3: '#8e44ad',
  N2: '#e67e22',
  N1: '#c0392b',
};

const LEVEL_DESCS: Record<string, string> = {
  N5: 'Beginner · Basic vocabulary & grammar',
  N4: 'Elementary · Everyday conversation',
  N3: 'Intermediate · Complex sentences',
  N2: 'Upper-intermediate · Nuanced reading',
  N1: 'Advanced · Abstract & academic texts',
};

const LEVELS = (['N5', 'N4', 'N3', 'N2', 'N1'] as const);

type Level = keyof typeof readingByLevel;

// ─── SELECTION SCREEN ─────────────────────────────────────────────────────
function SelectionScreen({ onPick }: { onPick: (k: Level) => void }) {
  return (
    <SafeAreaView style={sel.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={sel.scroll} showsVerticalScrollIndicator={false}>
        {/* Brand */}
        <View style={sel.brand}>
          <Text style={sel.kana}>日本語能力試験</Text>
          <Text style={sel.title}>
            JLPT <Text style={sel.titleEm}>Reading</Text>
          </Text>
          <Text style={sel.sub}>読解練習 · Dokkai Practice · jlptburmese.com</Text>
        </View>

        {/* Level cards */}
        <View style={sel.grid}>
          {LEVELS.map((key) => (
            <LevelCard key={key} levelKey={key} onPress={() => onPick(key)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LevelCard({ levelKey, onPress }: { levelKey: string; onPress: () => void }) {
  const [pressed, setPressed] = useState(false);
  const color = LEVEL_COLORS[levelKey];
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[
        sel.card,
        pressed && sel.cardPressed,
      ]}
    >
      {/* Gold gradient overlay on press */}
      <View style={[sel.cardGlow, pressed && sel.cardGlowVisible]} />
      <View style={[sel.badge, { backgroundColor: color }]}>
        <Text style={sel.badgeText}>{levelKey}</Text>
      </View>
      <View style={sel.cardInfo}>
        <Text style={sel.cardName}>Level {levelKey}</Text>
        <Text style={sel.cardDesc}>{LEVEL_DESCS[levelKey]}</Text>
      </View>
      <Text style={[sel.arrow, pressed && sel.arrowActive]}>›</Text>
    </Pressable>
  );
}

// ─── QUIZ SCREEN ──────────────────────────────────────────────────────────
export default function ReadingScreen() {
  const [level, setLevel] = useState<Level | null>(null);
  const [idx, setIdx] = useState(0);
  const [showTrans, setShowTrans] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<(boolean | null)[]>([]);

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
    setScores(new Array(readingByLevel[k]?.length ?? 0).fill(null));
    resetQuestion();
  };

  const goTo = (i: number) => {
    if (i < 0 || i >= quiz.length) return;
    setIdx(i);
    resetQuestion();
  };

  const handleSubmit = () => {
    if (selected == null || !q) return;
    const isCorrect = selected === q.question.correct_answer;
    setSubmitted(true);
    setScores((prev) => {
      const next = [...prev];
      next[idx] = isCorrect;
      return next;
    });
  };

  if (!level) return <SelectionScreen onPick={pickLevel} />;

  if (!q) {
    return (
      <SafeAreaView style={quiz_.safe} edges={['top', 'bottom']}>
        <Pressable style={quiz_.backRow} onPress={() => setLevel(null)}>
          <Text style={quiz_.backText}>← Levels</Text>
        </Pressable>
        <Text style={quiz_.empty}>No reading data for this level.</Text>
      </SafeAreaView>
    );
  }

  const correct = q.question.correct_answer;
  const isCorrect = submitted && selected === correct;
  const scoreCount = scores.filter((s) => s === true).length;

  return (
    <SafeAreaView style={quiz_.safe} edges={['top', 'bottom']}>
      {/* ── STICKY HEADER ── */}
      <View style={quiz_.header}>
        <Text style={quiz_.headerLevel}>
          {level} · 読解
        </Text>
        <Pressable
          style={quiz_.exitBtn}
          onPress={() => { setLevel(null); resetQuestion(); }}
        >
          <Text style={quiz_.exitText}>✕ Exit</Text>
        </Pressable>
      </View>

      {/* ── PAGINATION ROW ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={quiz_.pagerScroll}
        contentContainerStyle={quiz_.pagerContent}
      >
        {quiz.map((_, i) => (
          <Pressable
            key={i}
            style={[quiz_.pageBtn, i === idx && quiz_.pageBtnActive]}
            onPress={() => goTo(i)}
          >
            <Text style={[quiz_.pageBtnText, i === idx && quiz_.pageBtnTextActive]}>
              {i + 1}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── MAIN CONTENT ── */}
      <ScrollView
        style={quiz_.scroll}
        contentContainerStyle={quiz_.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        <View style={quiz_.progressRow}>
          <Text style={quiz_.progressLabel}>PROGRESS</Text>
          <View style={quiz_.dots}>
            {scores.map((s, i) => (
              <View
                key={i}
                style={[
                  quiz_.dot,
                  s === true && quiz_.dotCorrect,
                  s === false && quiz_.dotWrong,
                  s === null && quiz_.dotPending,
                ]}
              />
            ))}
          </View>
          <Text style={quiz_.progressCount}>{scoreCount}/{quiz.length}</Text>
        </View>

        {/* Question meta */}
        <View style={quiz_.qMeta}>
          <Text style={quiz_.qNumber}>
            {String(idx + 1).padStart(2, '0')}
          </Text>
          <View style={quiz_.tags}>
            <View style={quiz_.tag}><Text style={quiz_.tagText}>{level}</Text></View>
            {q.topic ? <View style={quiz_.tag}><Text style={quiz_.tagText}>{q.topic}</Text></View> : null}
          </View>
        </View>

        {/* ── PASSAGE CARD ── */}
        <View style={quiz_.passageCard}>
          <View style={quiz_.passageHeader}>
            <Text style={quiz_.passageLabel}>📄 Passage · 読解文</Text>
          </View>
          <Text style={quiz_.passageText}>{q.content.text}</Text>

          {/* Translation toggle */}
          <Pressable style={quiz_.transToggle} onPress={() => setShowTrans(!showTrans)}>
            <Text style={quiz_.transToggleText}>🌐 Burmese Translation · ဘာသာပြန်ချက်</Text>
            <Text style={[quiz_.transIcon, showTrans && quiz_.transIconOpen]}>▾</Text>
          </Pressable>
          {showTrans && (
            <View style={quiz_.transBody}>
              <Text style={quiz_.transText}>{q.content.translation}</Text>
            </View>
          )}
        </View>

        {/* ── QUESTION CARD ── */}
        <View style={quiz_.questionCard}>
          <Text style={quiz_.questionText}>問： {q.question.query}</Text>
          <View style={quiz_.divider} />

          {/* Options */}
          <View style={quiz_.optionsList}>
            {q.question.options.map((opt) => {
              let state: 'default' | 'selected' | 'correct' | 'wrong' = 'default';
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
                  onPress={() => { if (!submitted) setSelected(opt.id); }}
                />
              );
            })}
          </View>

          {/* Submit */}
          {!submitted && (
            <Pressable
              style={[quiz_.submitBtn, selected == null && quiz_.submitOff]}
              disabled={selected == null}
              onPress={handleSubmit}
            >
              <Text style={quiz_.submitText}>Check Answer · 答え合わせ</Text>
            </Pressable>
          )}
        </View>

        {/* ── RESULT BADGE (shown after submit instead of submit btn) ── */}
        {submitted && (
          <View style={[quiz_.resultBadge, isCorrect ? quiz_.resultCorrect : quiz_.resultWrong]}>
            <Text style={[quiz_.resultText, isCorrect ? quiz_.resultTextCorrect : quiz_.resultTextWrong]}>
              {isCorrect ? '✓ မှန်ပါတယ် · Correct!' : '✗ မှားပါတယ် · Incorrect'}
            </Text>
            {!isCorrect && (
              <Text style={quiz_.resultHint}>Correct answer: option {correct}</Text>
            )}
          </View>
        )}

        {/* ── AI FEEDBACK ── */}
        {submitted && q.ai_style_framework && (
          <AIFeedback framework={q.ai_style_framework} isCorrect={isCorrect} />
        )}

        {/* ── NAV ROW ── */}
        <View style={quiz_.navRow}>
          <Pressable
            style={[quiz_.navBtn, idx === 0 && quiz_.navBtnDisabled]}
            onPress={() => goTo(idx - 1)}
            disabled={idx === 0}
          >
            <Text style={[quiz_.navBtnText, idx === 0 && quiz_.navBtnTextDisabled]}>‹ Previous</Text>
          </Pressable>
          <Pressable
            style={[quiz_.navBtn, quiz_.navBtnPrimary, idx >= quiz.length - 1 && quiz_.navBtnDisabled]}
            onPress={() => goTo(idx + 1)}
            disabled={idx >= quiz.length - 1}
          >
            <Text style={[quiz_.navBtnText, quiz_.navBtnTextPrimary, idx >= quiz.length - 1 && quiz_.navBtnTextDisabled]}>
              Next ›
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── OPTION BUTTON ────────────────────────────────────────────────────────
function OptionButton({
  id, text, state, disabled, onPress,
}: {
  id: number; text: string; state: 'default' | 'selected' | 'correct' | 'wrong';
  disabled: boolean; onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const cardStyle = [
    opt_.btn,
    state === 'selected' && opt_.selected,
    state === 'correct' && opt_.correct,
    state === 'wrong' && opt_.wrong,
    state === 'default' && pressed && opt_.hover,
  ];

  const badgeStyle = [
    opt_.badge,
    state === 'selected' && opt_.badgeSelected,
    state === 'correct' && opt_.badgeCorrect,
    state === 'wrong' && opt_.badgeWrong,
  ];

  const resultLabel =
    state === 'correct' ? '✓ မှန်သည်' :
    state === 'wrong' ? '✗ မှားသည်' : null;

  return (
    <Pressable
      style={cardStyle}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <View style={badgeStyle}>
        <Text style={opt_.badgeText}>{id}</Text>
      </View>
      <Text style={opt_.text}>{text}</Text>
      {resultLabel && (
        <View style={[opt_.resultLabel, state === 'correct' ? opt_.labelOk : opt_.labelNo]}>
          <Text style={[opt_.resultLabelText, state === 'correct' ? opt_.labelOkText : opt_.labelNoText]}>
            {resultLabel}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── AI FEEDBACK ──────────────────────────────────────────────────────────
function AIFeedback({
  framework, isCorrect,
}: {
  framework: NonNullable<ReadingQuiz['ai_style_framework']>; isCorrect: boolean;
}) {
  return (
    <View style={ai_.card}>
      {/* Header */}
      <View style={ai_.header}>
        <View style={ai_.headerLeft}>
          <Text style={ai_.headerTitle}>
            <Text style={ai_.headerEm}>AI</Text>
            {' '}Analysis
          </Text>
        </View>
        <View style={ai_.badge}>
          <Text style={ai_.badgeText}>POWERED BY CLAUDE</Text>
        </View>
        <Text style={[ai_.verdict, isCorrect ? ai_.verdictOk : ai_.verdictNo]}>
          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </Text>
      </View>

      {/* Body */}
      <View style={ai_.body}>
        {/* Attention */}
        {framework.attention && (
          <View style={ai_.section}>
            <Text style={[ai_.sectionLabel, { color: '#60a5fa' }]}>
              🔍 {framework.attention.title || 'What to Notice'}
            </Text>
            <View style={ai_.sectionContent}>
              {(framework.attention.points || []).map((p: string, i: number) => (
                <Text key={i} style={ai_.listItem}>— {p}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Intent */}
        {framework.intent && (
          <View style={ai_.section}>
            <Text style={[ai_.sectionLabel, { color: '#a78bfa' }]}>
              🎯 {framework.intent.title || 'Question Intent'}
            </Text>
            <Text style={[ai_.sectionContent, ai_.prose]}>{framework.intent.description}</Text>
          </View>
        )}

        {/* Concept */}
        {framework.concept && (
          <View style={ai_.section}>
            <Text style={[ai_.sectionLabel, { color: T.gold }]}>
              💡 {framework.concept.title || 'Key Concept'}
            </Text>
            <View style={ai_.sectionContent}>
              {framework.concept.key_term && (
                <View style={ai_.chip}>
                  <Text style={ai_.chipText}>{framework.concept.key_term}</Text>
                </View>
              )}
              <Text style={ai_.prose}>{framework.concept.explanation}</Text>
            </View>
          </View>
        )}

        {/* Analogy */}
        {framework.analogy && (
          <View style={ai_.section}>
            <Text style={[ai_.sectionLabel, { color: '#34d399' }]}>
              🌉 {framework.analogy.title || 'Analogy'}
            </Text>
            <View style={ai_.sectionContent}>
              <Text style={[ai_.prose, { color: T.paper, fontWeight: '500' }]}>
                {framework.analogy.scenario}
              </Text>
              <View style={ai_.quoteBlock}>
                <Text style={ai_.quoteText}>{framework.analogy.comparison}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── STYLES: SELECTION ────────────────────────────────────────────────────
const sel = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.ink },
  scroll: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40 },
  brand: { alignItems: 'center', marginBottom: 40 },
  kana: {
    fontSize: 11, letterSpacing: 6, color: T.gold,
    textTransform: 'uppercase', marginBottom: 8,
  },
  title: {
    fontSize: 36, fontWeight: '900', color: T.paper,
    letterSpacing: -0.5,
  },
  titleEm: { color: T.gold, fontStyle: 'italic' },
  sub: { fontSize: 12, color: T.muted, letterSpacing: 2, marginTop: 8 },
  grid: { width: '100%', maxWidth: 380, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1, borderColor: T.border,
    position: 'relative', overflow: 'hidden',
  },
  cardPressed: {
    borderColor: T.gold,
    backgroundColor: 'rgba(201,168,76,0.05)',
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(201,168,76,0)',
  },
  cardGlowVisible: {
    backgroundColor: 'rgba(201,168,76,0.04)',
  },
  badge: {
    width: 48, height: 48, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: T.paper },
  cardDesc: { fontSize: 11, color: T.muted, marginTop: 2 },
  arrow: { fontSize: 20, color: T.muted },
  arrowActive: { color: T.gold },
});

// ─── STYLES: QUIZ ─────────────────────────────────────────────────────────
const quiz_ = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.ink },
  // header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: 'rgba(14,14,18,0.92)',
    borderBottomWidth: 1, borderBottomColor: T.border,
  },
  headerLevel: {
    fontSize: 11, letterSpacing: 2.5, color: T.gold,
    textTransform: 'uppercase', fontWeight: '600',
  },
  exitBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  exitText: { fontSize: 11, letterSpacing: 1.5, color: T.muted, fontWeight: '600' },
  // pagination
  pagerScroll: {
    maxHeight: 52,
    borderBottomWidth: 1, borderBottomColor: T.border,
  },
  pagerContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 6 },
  pageBtn: {
    width: 34, height: 34, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'transparent',
  },
  pageBtnActive: { backgroundColor: T.gold, borderColor: T.gold },
  pageBtnText: { fontSize: 12, fontWeight: '600', color: T.muted },
  pageBtnTextActive: { color: T.ink },
  // scroll
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  // progress
  progressRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  progressLabel: { fontSize: 10, letterSpacing: 1.5, color: T.muted, fontWeight: '600' },
  dots: { flexDirection: 'row', gap: 5, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotPending: { backgroundColor: 'rgba(255,255,255,0.15)' },
  dotCorrect: { backgroundColor: '#27ae60' },
  dotWrong: { backgroundColor: '#c0392b' },
  progressCount: { fontSize: 10, color: T.muted, fontWeight: '600', letterSpacing: 0.5 },
  // question meta
  qMeta: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 20,
  },
  qNumber: {
    fontSize: 48, fontWeight: '900', color: 'rgba(201,168,76,0.15)',
    lineHeight: 48, letterSpacing: -1,
  },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: 4 },
  tag: {
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  tagText: { fontSize: 10, color: T.muted, letterSpacing: 1, fontWeight: '500' },
  // passage
  passageCard: {
    backgroundColor: T.surface, borderRadius: 16,
    borderWidth: 1, borderColor: T.border,
    overflow: 'hidden', marginBottom: 16,
  },
  passageHeader: {
    paddingHorizontal: 20, paddingVertical: 10,
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderBottomWidth: 1, borderBottomColor: T.border,
  },
  passageLabel: { fontSize: 10, letterSpacing: 2, color: T.gold, fontWeight: '700', textTransform: 'uppercase' },
  passageText: { fontSize: 16, lineHeight: 30, color: T.paper, padding: 20, paddingBottom: 16 },
  transToggle: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: T.border,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  transToggleText: { fontSize: 13, color: T.muted },
  transIcon: { fontSize: 11, color: T.muted },
  transIconOpen: { color: T.gold },
  transBody: {
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: 'rgba(201,168,76,0.03)',
    borderTopWidth: 1, borderTopColor: T.border,
  },
  transText: { fontSize: 14, lineHeight: 24, color: 'rgba(247,244,238,0.7)' },
  // question card
  questionCard: {
    backgroundColor: T.surfaceAlt, borderRadius: 16,
    borderWidth: 1, borderColor: T.border,
    padding: 20, marginBottom: 16,
  },
  questionText: { fontSize: 16, lineHeight: 28, color: T.paper, marginBottom: 16 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 16 },
  optionsList: { gap: 8 },
  // submit
  submitBtn: {
    marginTop: 20, paddingVertical: 16, borderRadius: 12,
    backgroundColor: T.gold, alignItems: 'center',
  },
  submitOff: { opacity: 0.35 },
  submitText: { color: T.ink, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  // result badge
  resultBadge: {
    marginBottom: 16, padding: 16, borderRadius: 12,
    borderWidth: 1,
  },
  resultCorrect: { backgroundColor: 'rgba(39,174,96,0.08)', borderColor: '#27ae60' },
  resultWrong: { backgroundColor: 'rgba(192,57,43,0.08)', borderColor: '#c0392b' },
  resultText: { fontSize: 16, fontWeight: '800' },
  resultTextCorrect: { color: '#27ae60' },
  resultTextWrong: { color: '#c0392b' },
  resultHint: { marginTop: 6, fontSize: 13, color: T.muted },
  // nav
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  navBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  navBtnPrimary: {
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderColor: 'rgba(201,168,76,0.3)',
  },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { fontSize: 13, fontWeight: '700', color: T.muted },
  navBtnTextPrimary: { color: T.gold },
  navBtnTextDisabled: {},
  // misc
  backRow: { padding: 20 },
  backText: { color: T.gold, fontWeight: '700', fontSize: 15 },
  empty: { textAlign: 'center', color: T.muted, fontSize: 16, paddingHorizontal: 24, marginTop: 20 },
});

// ─── STYLES: OPTION ───────────────────────────────────────────────────────
const opt_ = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 14, paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  hover: { borderColor: T.gold, backgroundColor: 'rgba(201,168,76,0.06)' },
  selected: { borderColor: T.gold, backgroundColor: 'rgba(201,168,76,0.08)' },
  correct: { borderColor: '#27ae60', backgroundColor: 'rgba(39,174,96,0.08)' },
  wrong: { borderColor: '#c0392b', backgroundColor: 'rgba(192,57,43,0.08)' },
  badge: {
    width: 28, height: 28, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    flexShrink: 0,
  },
  badgeSelected: { backgroundColor: T.gold, borderColor: T.gold },
  badgeCorrect: { backgroundColor: '#27ae60', borderColor: '#27ae60' },
  badgeWrong: { backgroundColor: '#c0392b', borderColor: '#c0392b' },
  badgeText: { fontSize: 12, fontWeight: '700', color: T.muted },
  text: { flex: 1, fontSize: 15, color: 'rgba(247,244,238,0.85)', lineHeight: 22, paddingTop: 3 },
  resultLabel: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 4, alignSelf: 'center', flexShrink: 0,
  },
  labelOk: { backgroundColor: 'rgba(39,174,96,0.12)' },
  labelNo: { backgroundColor: 'rgba(192,57,43,0.12)' },
  resultLabelText: { fontSize: 11, fontWeight: '700' },
  labelOkText: { color: '#27ae60' },
  labelNoText: { color: '#c0392b' },
});

// ─── STYLES: AI FEEDBACK ──────────────────────────────────────────────────
const ai_ = StyleSheet.create({
  card: {
    backgroundColor: T.surfaceAlt, borderRadius: 16,
    borderWidth: 1, borderColor: T.border,
    overflow: 'hidden', marginBottom: 16,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: 'rgba(201,168,76,0.06)',
    borderBottomWidth: 1, borderBottomColor: T.border,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: T.paper },
  headerEm: { color: T.gold, fontStyle: 'italic' },
  badge: {
    paddingHorizontal: 6, paddingVertical: 3,
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderRadius: 4, borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
  },
  badgeText: { fontSize: 9, letterSpacing: 1.5, color: T.gold, fontWeight: '700' },
  verdict: { fontSize: 12, fontWeight: '700' },
  verdictOk: { color: '#27ae60' },
  verdictNo: { color: '#c0392b' },
  body: { padding: 16, gap: 10 },
  section: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
  },
  sectionLabel: {
    fontSize: 10, letterSpacing: 2, fontWeight: '700',
    textTransform: 'uppercase', marginBottom: 8,
  },
  sectionContent: {},
  listItem: { fontSize: 13, color: 'rgba(247,244,238,0.75)', lineHeight: 22, marginBottom: 2 },
  prose: { fontSize: 13, color: 'rgba(247,244,238,0.75)', lineHeight: 22 },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderRadius: 4, borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    marginBottom: 8,
  },
  chipText: { fontSize: 11, color: T.goldLight, fontWeight: '600', letterSpacing: 0.5 },
  quoteBlock: {
    borderLeftWidth: 2, borderLeftColor: 'rgba(201,168,76,0.3)',
    paddingLeft: 12, marginTop: 8,
  },
  quoteText: { fontSize: 12, color: 'rgba(247,244,238,0.5)', fontStyle: 'italic', lineHeight: 20 },
});
