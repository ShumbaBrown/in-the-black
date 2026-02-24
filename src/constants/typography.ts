import { TextStyle } from 'react-native';

export const Fonts = {
  mono: 'IBMPlexMono-Regular',
  monoBold: 'IBMPlexMono-SemiBold',
  serif: 'IBMPlexSerif-SemiBold',
  serifBold: 'IBMPlexSerif-Bold',
  spaceMono: 'SpaceMono',
} as const;

export const Typography = {
  hero: {
    fontSize: 42,
    fontFamily: 'SpaceMono',
    fontWeight: '400',
    letterSpacing: -1,
  } as TextStyle,
  h1: {
    fontSize: 28,
    fontFamily: 'IBMPlexSerif-Bold',
    fontWeight: '400',
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontSize: 22,
    fontFamily: 'IBMPlexSerif-SemiBold',
    fontWeight: '400',
  } as TextStyle,
  h3: {
    fontSize: 18,
    fontFamily: 'IBMPlexSerif-SemiBold',
    fontWeight: '400',
  } as TextStyle,
  body: {
    fontSize: 16,
    fontFamily: 'IBMPlexMono-Regular',
    fontWeight: '400',
  } as TextStyle,
  bodyBold: {
    fontSize: 16,
    fontFamily: 'IBMPlexMono-SemiBold',
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontSize: 13,
    fontFamily: 'IBMPlexMono-Regular',
    fontWeight: '400',
  } as TextStyle,
  small: {
    fontSize: 11,
    fontFamily: 'IBMPlexMono-SemiBold',
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  } as TextStyle,
  amount: {
    fontSize: 22,
    fontFamily: 'IBMPlexMono-SemiBold',
    fontWeight: '400',
    letterSpacing: -0.5,
  } as TextStyle,
  amountLarge: {
    fontSize: 36,
    fontFamily: 'SpaceMono',
    fontWeight: '400',
    letterSpacing: -1,
  } as TextStyle,
} as const;
