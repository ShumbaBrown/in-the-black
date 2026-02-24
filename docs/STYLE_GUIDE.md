# Style Guide

All visual constants live in `src/constants/`. Import what you need:

```ts
import { Colors } from '@/src/constants/colors';
import { Typography, Fonts } from '@/src/constants/typography';
```

**Rule: Never hardcode hex colors, font sizes, or font families.** Always use constants.

## Colors

### Background & Surface
| Token | Hex | Usage |
|-------|-----|-------|
| `Colors.background` | `#F5F0E8` | Aged paper — screen background |
| `Colors.surface` | `#FFFDF7` | Clean ledger page — cards, modals |
| `Colors.surfaceLight` | `#F0EBE0` | Subtle depth — secondary surfaces |

### Ink Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `Colors.inkBlack` | `#1A1A1A` | Black ink — income, success states |
| `Colors.inkRed` | `#B22222` | Firebrick red — expenses, danger |
| `Colors.inkBlue` | `#1B3A5C` | Blue fountain pen — accent, interactive |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `Colors.textPrimary` | `#1A1A1A` | Main body text, headings |
| `Colors.textSecondary` | `#6B6156` | Faded brown — subtitles, labels |
| `Colors.textMuted` | `#9C9488` | Muted — placeholders, hints |

### Borders & Lines
| Token | Hex | Usage |
|-------|-----|-------|
| `Colors.border` | `#D4CCBE` | Pencil line — standard borders |
| `Colors.borderHeavy` | `#B8AFA3` | Column dividers |
| `Colors.ruledLine` | `#C5D5E8` | Notebook ruling (blue) |
| `Colors.marginLine` | `#E8B4B4` | Margin line (red) |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `Colors.danger` | `#B22222` | Destructive actions (same as inkRed) |
| `Colors.success` | `#1A1A1A` | Success states (same as inkBlack) |

### Gradient Aliases
| Token | Hex | Usage |
|-------|-----|-------|
| `Colors.incomeStart` | `#1A1A1A` | Income gradient start |
| `Colors.expenseStart` | `#B22222` | Expense gradient start |
| `Colors.accentStart` | `#1B3A5C` | Accent gradient start |

## Typography

### Font Families
| Token | Font | Usage |
|-------|------|-------|
| `Fonts.spaceMono` | SpaceMono | Hero amounts, large numbers |
| `Fonts.serif` | IBMPlexSerif-SemiBold | Headings |
| `Fonts.serifBold` | IBMPlexSerif-Bold | Large headings |
| `Fonts.mono` | IBMPlexMono-Regular | Body text, captions |
| `Fonts.monoBold` | IBMPlexMono-SemiBold | Emphasized body, labels |

### Presets

Spread into styles:
```ts
title: { ...Typography.h1, color: Colors.textPrimary }
```

| Preset | Size | Font | Usage |
|--------|------|------|-------|
| `Typography.hero` | 42 | SpaceMono | Hero counters, net position |
| `Typography.h1` | 28 | IBMPlexSerif-Bold | Screen titles |
| `Typography.h2` | 22 | IBMPlexSerif-SemiBold | Section titles |
| `Typography.h3` | 18 | IBMPlexSerif-SemiBold | Subsection titles |
| `Typography.body` | 16 | IBMPlexMono-Regular | Main content |
| `Typography.bodyBold` | 16 | IBMPlexMono-SemiBold | Emphasized content |
| `Typography.amount` | 22 | IBMPlexMono-SemiBold | Transaction amounts |
| `Typography.amountLarge` | 36 | SpaceMono | Large summary amounts |
| `Typography.caption` | 13 | IBMPlexMono-Regular | Captions, hints |
| `Typography.small` | 11 | IBMPlexMono-SemiBold | Uppercase labels, metadata |

## Design Principles

The UI follows a **ledger book** aesthetic:
- Aged paper backgrounds, not stark white
- Ink-style colors (black for positive, red for negative — just like real accounting)
- Monospace fonts for numbers and data (ledger feel)
- Serif fonts for headings (formal, bookish)
- Subtle borders that look like pencil lines or ruled paper
- Gradient cards that feel like pages in a well-used notebook
