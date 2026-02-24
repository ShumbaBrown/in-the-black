import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Typography } from '@/src/constants/typography';
import type { Book } from '@/src/db/types';

interface Props {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
}

export function BookSpine({ book, onPress, onLongPress }: Props) {
  return (
    <Animated.View entering={FadeInUp.springify()}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          styles.spine,
          { backgroundColor: book.color, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        {/* Spine edge highlight */}
        <View style={styles.edgeHighlight} />

        {/* Book icon at top */}
        <View style={styles.iconArea}>
          <FontAwesome
            name={book.icon as any}
            size={24}
            color="rgba(255,255,255,0.9)"
          />
        </View>

        {/* Decorative line */}
        <View style={styles.decorLine} />

        {/* Title running vertically */}
        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={2}>
            {book.name}
          </Text>
        </View>

        {/* Decorative line */}
        <View style={styles.decorLine} />

        {/* Bottom accent */}
        <View style={styles.bottomAccent} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  spine: {
    width: 80,
    height: 200,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  edgeHighlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconArea: {
    alignItems: 'center',
  },
  decorLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  titleArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontFamily: 'IBMPlexSerif-SemiBold',
    fontSize: 11,
    lineHeight: 15,
  },
  bottomAccent: {
    width: 20,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
});
