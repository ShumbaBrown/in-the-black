import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
  onPress: () => void;
}

export function NewBookButton({ onPress }: Props) {
  return (
    <Animated.View entering={FadeInUp.delay(100).springify()}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <FontAwesome name="plus" size={28} color="#9C8B7A" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 200,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#5C4A3A',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(92,74,58,0.15)',
  },
});
