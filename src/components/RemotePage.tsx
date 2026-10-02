import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewErrorEvent, WebViewHttpErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { ExternalLink, RefreshCw, WifiOff } from 'lucide-react-native';
import { colors, radius, spacing } from '../theme';

type Props = {
  url: string;
  title: string;
  description: string;
};

export default function RemotePage({ url, title, description }: Props) {
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const retry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  const openExternal = useCallback(() => {
    Linking.openURL(url).catch(() => {
      setError('This page could not be opened on this device.');
    });
  }, [url]);

  const handleNativeError = useCallback((event: WebViewErrorEvent) => {
    setIsLoading(false);
    setError(event.nativeEvent.description || 'The online page could not be loaded.');
  }, []);

  const handleHttpError = useCallback((event: WebViewHttpErrorEvent) => {
    if (event.nativeEvent.statusCode >= 400) {
      setIsLoading(false);
      setError(`The website returned an error (${event.nativeEvent.statusCode}).`);
    }
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <View style={styles.iconCircle}>
            <WifiOff size={24} color={colors.primary} />
          </View>
          <Text style={styles.title}>{title} is online</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={retry} accessibilityRole="button">
              <RefreshCw size={17} color={colors.onPrimary} />
              <Text style={styles.primaryButtonText}>Try again</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={openExternal} accessibilityRole="link">
              <ExternalLink size={17} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Open in browser</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {isLoading ? <LoadingState title={title} /> : null}
        <iframe
          key={reloadKey}
          src={url}
          style={[styles.iframe, isLoading && styles.hidden] as any}
          title={title}
          frameBorder="0"
          allow="fullscreen"
          onLoad={() => setIsLoading(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={reloadKey}
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onLoadStart={() => {
          setIsLoading(true);
          setError(null);
        }}
        onLoadEnd={() => setIsLoading(false)}
        onError={handleNativeError}
        onHttpError={handleHttpError}
        renderLoading={() => <LoadingState title={title} />}
      />
    </View>
  );
}

function LoadingState({ title }: { title: string }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading {title}…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  webview: { flex: 1 },
  iframe: { flex: 1, width: '100%', borderWidth: 0 },
  hidden: { opacity: 0 },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
    gap: spacing.md,
  },
  loadingText: { color: colors.muted, fontSize: 14 },
  errorCard: {
    margin: spacing.xl,
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSubtle,
    marginBottom: spacing.md,
  },
  title: { color: colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: spacing.sm },
  errorText: { color: colors.danger, fontSize: 13, textAlign: 'center', marginTop: spacing.md },
  actions: { width: '100%', gap: spacing.sm, marginTop: spacing.xl },
  primaryButton: {
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonText: { color: colors.onPrimary, fontWeight: '700', fontSize: 15 },
  secondaryButton: {
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.bgSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  secondaryButtonText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});
