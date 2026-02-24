import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { formatCurrency } from '@/src/utils/currency';
import { useAnimatedCounter } from '@/src/hooks/useAnimatedCounter';

interface Props {
  netPosition: number;
}

export function NetPositionHero({ netPosition }: Props) {
  const isPositive = netPosition >= 0;
  const inkColor = isPositive ? Colors.inkBlack : Colors.inkRed;

  const animatedValue = useAnimatedCounter(netPosition);

  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = 0.95;
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [netPosition, scale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Red margin line */}
      <View style={styles.marginLine} />

      {/* Ruled blue lines */}
      <View style={[styles.ruledLine, { top: 20 }]} />
      <View style={[styles.ruledLine, { top: 44 }]} />
      <View style={[styles.ruledLine, { top: 68 }]} />
      <View style={[styles.ruledLine, { top: 92 }]} />

      <View style={styles.content}>
        {/* Stamp label */}
        <View style={[styles.stamp, { borderColor: inkColor }]}>
          <Text style={[styles.stampText, { color: inkColor }]}>
            {isPositive ? 'IN THE BLACK' : 'IN THE RED'}
          </Text>
        </View>

        <Text style={[styles.amount, { color: inkColor }]}>
          {formatCurrency(netPosition)}
        </Text>

        <Text style={styles.subtitle}>Net Position</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    // Double-ruled border effect (inner via content padding + outer via border)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  marginLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.marginLine,
  },
  ruledLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: Colors.ruledLine,
  },
  content: {
    padding: 28,
    alignItems: 'center',
    // Inner border for double-ruled effect
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 3,
    borderRadius: 2,
  },
  stamp: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    transform: [{ rotate: '-2deg' }],
  },
  stampText: {
    ...Typography.small,
    letterSpacing: 2,
  },
  amount: {
    ...Typography.hero,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
