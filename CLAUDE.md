# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**In The Black** is a ledger-style financial tracking app for hobbies/side projects. Built with React Native, Expo (SDK 54), and TypeScript. Targets iOS, Android, and Web. Uses SQLite for local-first data persistence with no external backend.

## Rules (Always Follow)

1. **Add/update unit tests** for every non-trivial change. Skip tests only for cosmetic/config changes.
2. **Run tests** after implementation and before finishing — all tests must pass.
3. **For UI changes**: add `testID` props (kebab-case) to every new interactive element.
4. **Consult `memory/learnings.md`** before making technical decisions (tools, patterns, naming). Record new lessons immediately when discovered.
5. **Follow coding best practices** documented in `memory/learnings.md` — these are hard-won lessons from past work.
6. **Update docs alongside code** — a change without its doc update is incomplete:
   - Design token added/changed → update `docs/STYLE_GUIDE.md`
   - SQLite schema changed → update Data Model section in this file
   - New gotcha discovered → add to Critical Gotchas before moving on
7. **Proactively suggest commits** after completing work, but **never commit without asking**.
8. **Stage specific files** (`git add <file>`), never `git add .` or `git add -A`.
9. **Follow conventional commits**: `type(scope): summary`. See `docs/COMMIT_CONVENTIONS.md`.
10. **Use plan mode** (mini-PRD format below) for non-trivial features — don't start coding without a plan.
11. **Keep CLAUDE.md accurate**: small fixes proactively; ask before large structural changes.
12. **Track work in GitHub Issues**, not in this file. Use `gh issue list` to see open items, `gh issue create` to add new ones. **Ask before closing issues** — after completing work on an issue, ask the user if the issue should be closed rather than closing it automatically. Use `gh issue close <number> --comment "summary"` once confirmed.
13. **When fixing a bug, check for the same pattern elsewhere** in the codebase. If the root cause is a repeated pattern, search for all instances and fix them together.
14. **Provide manual testing verification** after completing any bug fix, feature, or app change. Include step-by-step instructions the user can follow to verify each change works correctly, plus a regression check for related existing functionality.
15. **Follow naming conventions** documented in `memory/learnings.md` — camelCase vars, PascalCase components, UPPER_SNAKE_CASE constants, kebab-case `testID` props.

## Commands

```bash
# Development
npm start              # Start Expo dev server
npm run ios            # Start on iOS simulator
npm run android        # Start on Android emulator
npm run web            # Start web version

# Build & Submit (EAS)
eas build --platform ios --profile production    # iOS build
eas build --platform android --profile preview   # Android .apk for testing
eas build --platform all --profile production    # Build both platforms
eas submit --platform ios                        # Submit to App Store
eas submit --platform android                    # Submit to Play Store
```

No test runner is currently configured. `react-test-renderer` is in devDependencies but no test files exist yet.

## Architecture

```
┌─────────────────┐
│   iOS/Android   │
│     (Expo)      │
└────────┬────────┘
         │
    ┌────▼────┐
    │ SQLite  │  (local-first, no backend)
    └─────────┘
```

### Routing (Expo Router — file-based)

- `app/_layout.tsx` — Root layout, wraps app with SQLite provider
- `app/index.tsx` — Bookshelf home screen
- `app/new-book.tsx` — Create book modal
- `app/book/[bookId]/` — Book detail with tab navigation (`_layout.tsx`, `index.tsx` dashboard, `add.tsx` transactions, `stats.tsx` breakdown, `categories.tsx` management)
- `app/transaction/[id].tsx` — Transaction detail/edit modal

### Source Organization (`src/`)

- **`db/`** — SQLite database layer with migration system
  - `schema.ts` — Table creation and versioned migrations (current: v2)
  - `types.ts` — TypeScript interfaces for all data models
  - `transactions.ts` — Transaction CRUD
  - `books.ts` — Book and category CRUD
- **`context/BookContext.tsx`** — React Context for book-level state (selected book, categories)
- **`hooks/`** — Custom hooks: `useBooks`, `useTransactions`, `useDashboardData`, `useAnimatedCounter`
- **`components/`** — Organized by feature area: `ui/`, `dashboard/`, `transaction/`, `category/`, `bookshelf/`, `stats/`
- **`constants/`** — Design tokens: `colors.ts` (ledger theme), `typography.ts` (SpaceMono/IBMPlexSerif/IBMPlexMono), `categories.ts` (hobby templates), `pickerOptions.ts`
- **`utils/`** — `currency.ts`, `dates.ts`, `calculations.ts`

### Data Model

SQLite database (`intheblack.db`) with tables: `books`, `transactions`, `book_categories`, `app_settings`, `schema_version`. Books have many transactions and categories. State management uses React Context + hooks (no Redux/Zustand).

### Design System

Ledger-themed UI with aged paper background (#F5F0E8), ink colors, and fountain pen blue accent (#1B3A5C). Fonts: SpaceMono (headers/amounts), IBMPlexSerif (headings), IBMPlexMono (body). Colors and typography defined in `src/constants/`. See `docs/STYLE_GUIDE.md` for the complete palette and rules.

## Key Conventions

- TypeScript strict mode enabled
- Path alias: `@/*` maps to project root (e.g., `@/src/db/schema`)
- New Architecture enabled for React Native
- Expo Router typed routes enabled
- Transactions are typed as `expense` or `income`
- 8 hobby templates predefined in `src/constants/categories.ts` plus a blank option

## Critical Gotchas

### Design tokens
Never hardcode hex colors, font sizes, or font families. Import from `src/constants/` (`Colors`, `Typography`, `Fonts`). See `docs/STYLE_GUIDE.md` for the complete palette and usage rules.

### SQLite migrations
Never modify existing migration steps in `src/db/schema.ts` — always add new versioned ones. Check `schema_version` table to determine current version. Transactions have a `type` field (`'expense'` | `'income'`) — always branch on this when calculating totals.

### Expo Go limitations
If you add packages requiring native code, Expo Go won't work — use dev builds (`npx expo run:ios` / `npx expo run:android`). After changing native config: `npx expo prebuild --clean`.

### EAS builds
Always test with `preview` profile before `production`. After any native config change (app.json plugins, new packages): `npx expo prebuild --clean`. Build errors are often clearer in EAS build logs than locally.

## Plan Format

When entering plan mode, structure every plan as a mini-PRD:

### 1. Requirements
- **Problem Statement** — What problem this solves (1-2 sentences)
- **User Stories** — "As a user, I want... so that..."
- **Acceptance Criteria** — Checkboxable, testable outcomes
- **Out of Scope** — What this plan does NOT cover

### 2. Architecture
- Data flow, new SQLite tables/columns, new packages/deps, fit with existing patterns

### 3. Implementation
- New files (with purpose), existing files to modify, implementation order

### 4. Testing & Verification
- Unit tests, manual testing steps

## Git Commits

Follow conventional commits: `type(scope): summary`. See `docs/COMMIT_CONVENTIONS.md` for full format, types, scopes, and examples.

## TODO

Tracked in [GitHub Issues](https://github.com/ShumbaBrown/in-the-black/issues). Run `gh issue list` to see open items.
