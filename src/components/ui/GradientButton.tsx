import React from 'react';
import { StyleSheet, Pressable, Text, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface Props {
  title: string;
  onPress: () => void;
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  disabled?: boolean;
}

export function GradientButton({
  title,
  onPress,
  colors,
  style,
  disabled = false,
}: Props) {
  const bgColor = colors?.[0] ?? Colors.inkBlue;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor },
        style,
        { opacity: pressed ? 0.85 : disabled ? 0.5 : 1 },
      ]}
    >
      <Text style={styles.text}>{title.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.bodyBold,
    color: '#FFFDF7',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
