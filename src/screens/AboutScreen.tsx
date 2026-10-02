import { Text, View, Pressable, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing } from '../theme';

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      style={({ pressed }) => [styles.link, shadows.sm, pressed && { opacity: 0.9 }]}
    >
      <Text style={styles.linkText}>{label}</Text>
      <Text style={styles.url}>{url}</Text>
    </Pressable>
  );
}

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.pad} showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>日</Text>
          </View>
          <Text style={styles.title}>JLPT Burmese</Text>
          <Text style={styles.tagline}>JLPT study for Myanmar learners</Text>
        </View>

        <Text style={styles.p}>
          Grammar explanations, readings, kanji, and past-paper vocabulary are bundled in the app — no ads and
          no network required for study features. Full mock exams run online at jlptburmese.com.
        </Text>

        <Text style={styles.h}>Community</Text>
        <LinkRow label="Telegram — JLPT Burmese" url="https://t.me/jlptburmese" />
        <LinkRow label="Facebook" url="https://www.facebook.com/jlptburmese" />
        <LinkRow label="Telegram — Books storage" url="https://t.me/japanese_books_storage" />

        <Text style={styles.h}>Email</Text>
        <Pressable
          onPress={() => Linking.openURL('mailto:jlptburmese@gmail.com')}
          style={({ pressed }) => [styles.emailCard, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.email}>jlptburmese@gmail.com</Text>
        </Pressable>

        <Text style={styles.footer}>© Japanese / Myanmar learners community</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pad: { padding: spacing.xl, paddingBottom: spacing.xxxl + spacing.lg },
  brand: { alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.headerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  logoText: { fontSize: 32, color: colors.onHeader, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: colors.muted, marginTop: spacing.sm, textAlign: 'center' },
  p: { fontSize: 15, color: colors.muted, lineHeight: 24, marginTop: spacing.sm },
  h: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: colors.muted,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  link: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkText: { fontSize: 16, fontWeight: '700', color: colors.accent },
  url: { fontSize: 12, color: colors.subtle, marginTop: spacing.xs },
  emailCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  email: { fontSize: 16, color: colors.accent, fontWeight: '700' },
  footer: { marginTop: spacing.xxxl, fontSize: 13, color: colors.subtle, textAlign: 'center' },
});
