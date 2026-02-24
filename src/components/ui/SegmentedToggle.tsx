import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface Props {
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
  activeColor?: string;
}

export function SegmentedToggle({
  options,
  selected,
  onSelect,
}: Props) {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withSpring(selected * (1 / options.length) * 100, {
      damping: 15,
      stiffness: 150,
    });
  }, [selected, options.length, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${translateX.value}%` as unknown as number,
    width: `${100 / options.length}%` as unknown as number,
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.indicator, indicatorStyle]}
      />
      {options.map((option, index) => (
        <React.Fragment key={option}>
          {index > 0 && <View style={styles.separator} />}
          <Pressable
            style={styles.option}
            onPress={() => onSelect(index)}
          >
            <Text
              style={[
                styles.optionText,
                selected === index && styles.activeText,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: Colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.inkBlue,
  },
  separator: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 6,
    zIndex: 0,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  optionText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
  activeText: {
    color: Colors.textPrimary,
  },
});
