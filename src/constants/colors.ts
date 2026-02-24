export const Colors = {
  background: '#F5F0E8',       // aged paper
  surface: '#FFFDF7',          // clean ledger page
  surfaceLight: '#F0EBE0',     // subtle depth

  inkBlack: '#1A1A1A',         // black ink (income / success)
  inkRed: '#B22222',           // firebrick red (expense / danger)
  inkBlue: '#1B3A5C',          // blue fountain pen (accent)

  textPrimary: '#1A1A1A',
  textSecondary: '#6B6156',    // faded brown
  textMuted: '#9C9488',

  border: '#D4CCBE',           // pencil line
  borderHeavy: '#B8AFA3',      // column dividers
  ruledLine: '#C5D5E8',        // notebook ruling (blue)
  marginLine: '#E8B4B4',       // margin line (red)

  danger: '#B22222',           // same as red ink
  success: '#1A1A1A',          // same as black ink

  // Backwards-compat aliases used by existing components
  incomeStart: '#1A1A1A',
  expenseStart: '#B22222',
  accentStart: '#1B3A5C',
} as const;
