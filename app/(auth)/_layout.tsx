import { Stack } from 'expo-router';
import { Colors } from '@/src/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="verify-otp" />
    </Stack>
  );
}
