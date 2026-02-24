import { useEffect } from 'react';
import {
  useSharedValue,
  withSpring,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated';

export function useAnimatedCounter(targetValue: number): SharedValue<number> {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(targetValue, {
      damping: 20,
      stiffness: 90,
      mass: 1,
    });
  }, [targetValue, animatedValue]);

  return animatedValue;
}

export function useFormattedAnimatedCurrency(targetValue: number) {
  const animatedValue = useAnimatedCounter(targetValue);

  const formattedText = useDerivedValue(() => {
    const abs = Math.abs(animatedValue.value);
    const sign = animatedValue.value < 0 ? '-' : '';
    return `${sign}$${abs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  });

  return formattedText;
}
