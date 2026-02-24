import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from '@/src/db/schema';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { pullAllData, pullIncremental } from '@/src/services/syncService';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (session && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [session, loading, segments]);

  return <>{children}</>;
}

function SyncOnAuth() {
  const { user } = useAuth();
  const db = useSQLiteContext();
  const hasSynced = useRef(false);

  // Full pull on first sign-in
  useEffect(() => {
    if (user && !hasSynced.current) {
      hasSynced.current = true;
      pullAllData(db, user.id).catch((e) =>
        console.warn('Initial sync failed:', e)
      );
    }
    if (!user) {
      hasSynced.current = false;
    }
  }, [user, db]);

  // Incremental pull on app focus
  const handleAppStateChange = useCallback(
    (state: AppStateStatus) => {
      if (state === 'active' && user) {
        pullIncremental(db, user.id).catch((e) =>
          console.warn('Incremental sync failed:', e)
        );
      }
    },
    [user, db]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'IBMPlexMono-Regular': require('../assets/fonts/IBMPlexMono-Regular.ttf'),
    'IBMPlexMono-SemiBold': require('../assets/fonts/IBMPlexMono-SemiBold.ttf'),
    'IBMPlexSerif-SemiBold': require('../assets/fonts/IBMPlexSerif-SemiBold.ttf'),
    'IBMPlexSerif-Bold': require('../assets/fonts/IBMPlexSerif-Bold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="intheblack.db" onInit={initDatabase}>
        <AuthProvider>
          <AuthGate>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F5F0E8' },
              }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
          </AuthGate>
          <SyncOnAuth />
        </AuthProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
