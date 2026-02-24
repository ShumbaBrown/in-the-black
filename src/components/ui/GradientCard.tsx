import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface Props {
  colors?: readonly [string, string, ...string[]];
  accentColor?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

export function GradientCard({ accentColor, style, children }: Props) {
  return (
    <View style={[styles.card, style]}>
      {accentColor && (
        <View style={[styles.marginBar, { backgroundColor: accentColor }]} />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  marginBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
});
