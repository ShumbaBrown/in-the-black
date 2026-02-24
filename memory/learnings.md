# Learnings & Conventions

Hard-won lessons from development. Consult before making technical decisions.

## Naming Conventions

- **Variables/functions**: `camelCase` (e.g., `useBooks`, `formatCurrency`)
- **Components**: `PascalCase` (e.g., `BookSpine`, `TransactionRow`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `HOBBY_TEMPLATES`)
- **testID props**: `kebab-case` (e.g., `testID="add-transaction-button"`)
- **Commit messages**: Conventional commits — `type(scope): summary`

## React Native + Expo Patterns

### Expo Go limitations
Expo Go won't work with native modules that require custom native code. If you add packages that need native linking (e.g., SQLite), use dev builds: `npx expo run:ios` / `npx expo run:android`.

### New Architecture
New Architecture is enabled (`newArchEnabled: true` in app.json). When adding packages, verify they support the New Architecture — check the package's React Native directory listing or GitHub issues.

### Path aliases
`@/*` maps to project root via `tsconfig.json`. Use `@/src/db/schema` not `../../db/schema`.

## SQLite Patterns

### Schema migrations
Always use versioned migrations in `src/db/schema.ts`. Never modify existing migration steps — add new ones. Check `schema_version` table to determine current version before running migrations.

### Transactions are typed
Every transaction has a `type` field: `'expense'` or `'income'`. Always filter or branch on this field when calculating totals.

## EAS Build & Deploy

### Build profiles
- `development` — Dev builds with dev client for local development
- `preview` — Internal distribution builds for testing
- `production` — App Store / Play Store builds

### EAS build gotchas
- Always test with `preview` profile before `production`
- After changing native config (app.json plugins, new native packages): run `npx expo prebuild --clean`
- Build errors are often clearer in the EAS build logs than local errors

### OTA updates
JavaScript-only changes can be pushed via `eas update` without a new store build. Native changes (new packages, app.json config, permissions) require a full rebuild.

## Testing

### testID props
Add `testID` props (kebab-case) to every new interactive element for future E2E testing. This is low-effort now and high-value later.

### Manual verification
After completing any bug fix or feature, provide step-by-step manual testing instructions. Include regression checks for related existing functionality.

## Common Pitfalls

1. **Always clean before rebuilding** — `npx expo prebuild --clean` after native config changes
2. **Version your schema** — never alter existing migration steps, always add new versioned ones
3. **Don't hardcode colors/fonts** — import from `src/constants/` (see `docs/STYLE_GUIDE.md`)
4. **Stage specific files** — use `git add <file>` not `git add .` to avoid committing build artifacts
