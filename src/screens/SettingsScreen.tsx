import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BookOpen, Info, MessageCircle, Send, Users, Wifi, WifiOff } from 'lucide-react-native';
import { colors, radius, shadows, spacing } from '../theme';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Unable to open link', 'Please check your internet connection and try again.');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>See what works offline and connect with JLPT Burmese.</Text>

      <SectionHeader title="Your study data" icon={BookOpen} />
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <WifiOff size={20} color={colors.success} />
          <View style={styles.infoBody}>
            <Text style={styles.infoTitle}>Offline content</Text>
            <Text style={styles.infoText}>Grammar, Kanji, reading, vocabulary, and games are bundled on this device.</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Wifi size={20} color={colors.link} />
          <View style={styles.infoBody}>
            <Text style={styles.infoTitle}>Online content</Text>
            <Text style={styles.infoText}>The website tab and the full JLPT mock exam (including listening audio) require internet access.</Text>
          </View>
        </View>
      </View>

      <SectionHeader title="Connect" icon={Users} />
      <SocialCard title="Facebook" subtitle="Join our community" url="https://facebook.com/jlptburmese" icon={MessageCircle} onPress={openLink} />
      <SocialCard title="Telegram Channel" subtitle="Get daily tips" url="https://t.me/jlptburmese" icon={Send} onPress={openLink} />
      <SocialCard title="Join Community" subtitle="Connect with learners" url="https://t.me/jlptburmese_group" icon={Users} onPress={openLink} />

      <SectionHeader title="About this app" icon={Info} />
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>JLPT Burmese</Text>
        <Text style={styles.aboutText}>Version {APP_VERSION}</Text>
        <Text style={styles.aboutText}>An offline study companion with online mock exams for Myanmar learners of Japanese.</Text>
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ size?: number; color?: string }> }) {
  return (
    <View style={styles.sectionHeader}>
      <Icon size={19} color={colors.primary} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

function SocialCard({ title, subtitle, url, icon: Icon, onPress }: { title: string; subtitle: string; url: string; icon: React.ComponentType<{ size?: number; color?: string }>; onPress: (url: string) => void }) {
  return (
    <TouchableOpacity style={styles.socialCard} onPress={() => onPress(url)} accessibilityRole="link">
      <View style={styles.socialIconContainer}><Icon size={23} color={colors.primary} /></View>
      <View style={styles.infoBody}>
        <Text style={styles.socialTitle}>{title}</Text>
        <Text style={styles.socialSubtitle}>{subtitle}</Text>
        <Text style={styles.socialUrl}>{url.replace('https://', '')} →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: spacing.xs, marginBottom: spacing.xxl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.md },
  sectionHeaderText: { fontSize: 16, fontWeight: '800', color: colors.text },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadows.sm },
  infoRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  infoBody: { flex: 1 },
  infoTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  infoText: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 3 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.md },
  socialCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  socialIconContainer: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  socialTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  socialSubtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
  socialUrl: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 4 },
  aboutCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  aboutTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  aboutText: { fontSize: 13, color: colors.muted, lineHeight: 19, marginTop: spacing.xs },
});
