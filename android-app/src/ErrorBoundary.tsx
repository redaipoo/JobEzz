/**
 * ErrorBoundary — catches render errors and shows a recovery surface.
 * Uses design tokens only; no legacy theme imports.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { palette, r, typ, sp, sh } from './design';
import { Icon } from './icons';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      return <DefaultErrorScreen error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

function DefaultErrorScreen({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="alert" size={36} color={palette.danger} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>حدث خطأ مؤقتاً</Text>
      <Text style={styles.subtitle}>تحقق من اتصال الإنترنت وحاول مرة أخرى.</Text>
      {__DEV__ && (
        <View style={styles.debugBox}>
          <Text style={styles.debugText} numberOfLines={6}>{error.message}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={onReset} activeOpacity={0.85} accessibilityRole="button">
        <Text style={styles.buttonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.bg1,
    padding: sp.xl,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: palette.dangerBg,
    borderWidth: 1,
    borderColor: 'rgba(242,109,109,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp.lg,
    ...sh.md,
  },
  title: { ...typ.h2, color: palette.textHi, textAlign: 'center' },
  subtitle: { ...typ.bodyS, color: palette.textMid, textAlign: 'center', marginTop: sp.sm, lineHeight: 20 },
  debugBox: {
    backgroundColor: palette.dangerBg,
    borderRadius: r.md,
    padding: sp.base,
    marginTop: sp.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(242,109,109,0.2)',
  },
  debugText: {
    fontSize: 12,
    color: palette.danger,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  button: {
    backgroundColor: palette.accent,
    paddingHorizontal: sp.xl,
    paddingVertical: sp.base,
    borderRadius: r.md,
    marginTop: sp.xl,
  },
  buttonText: { ...typ.button, color: '#FFFFFF' },
});

export default ErrorBoundary;
