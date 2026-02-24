import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { GradientButton } from '@/src/components/ui/GradientButton';
import { useAuth } from '@/src/context/AuthContext';

export default function SignInScreen() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
    }
  }, []);

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
        Alert.alert('Check Your Email', 'We sent a confirmation link. Please verify, then sign in.');
        setIsSignUp(false);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    setLoading(true);
    try {
      await signInWithApple();
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Error', error.message ?? 'Apple sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>In The Black</Text>
        <Text style={styles.subtitle}>SIGN IN TO SYNC YOUR BOOKS</Text>

        {!showEmail ? (
          <>
            {appleAvailable && (
              <GradientButton
                title="Continue with Apple"
                onPress={handleApple}
                colors={['#1A1A1A', '#1A1A1A']}
                disabled={loading}
                style={styles.socialButton}
              />
            )}

            <GradientButton
              title="Continue with Google"
              onPress={handleGoogle}
              colors={['#4285F4', '#4285F4']}
              disabled={loading}
              style={styles.socialButton}
            />

            <Pressable onPress={() => setShowEmail(true)} style={styles.toggleRow}>
              <Text style={styles.toggleText}>Use email instead</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                testID="email-input"
              />
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                testID="password-input"
              />
              <GradientButton
                title={isSignUp ? 'Create Account' : 'Sign In'}
                onPress={handleEmailAuth}
                disabled={loading}
                style={styles.submitButton}
              />
              <Pressable onPress={() => setIsSignUp(!isSignUp)} style={styles.toggleRow}>
                <Text style={styles.toggleText}>
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {appleAvailable && (
              <GradientButton
                title="Continue with Apple"
                onPress={handleApple}
                colors={['#1A1A1A', '#1A1A1A']}
                disabled={loading}
                style={styles.socialButton}
              />
            )}

            <GradientButton
              title="Continue with Google"
              onPress={handleGoogle}
              colors={['#4285F4', '#4285F4']}
              disabled={loading}
              style={styles.socialButton}
            />

            <Pressable onPress={() => setShowEmail(false)} style={styles.toggleRow}>
              <Text style={styles.toggleText}>Back</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  formSection: {
    marginBottom: 8,
  },
  inputLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 2,
    padding: 16,
    ...Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderHeavy,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 4,
  },
  toggleRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  toggleText: {
    ...Typography.caption,
    color: Colors.inkBlue,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginHorizontal: 16,
  },
  socialButton: {
    marginBottom: 12,
  },
});
