# Git Commit Conventions

Follow conventional commits for a clean, searchable version history.

## Format
```
<type>(<scope>): <short summary>

<optional body — explain WHY, not what>
```

## Types
- `feat` — New feature or user-facing functionality
- `fix` — Bug fix
- `refactor` — Code restructuring with no behavior change
- `perf` — Performance improvement
- `chore` — Build, config, dependency, or tooling changes
- `docs` — Documentation only
- `test` — Adding or updating tests
- `security` — Security hardening (validation, data protection)

## Scopes (use the area of the app affected)
- `db` — SQLite schema, migrations, CRUD operations (`src/db/`)
- `bookshelf` — Bookshelf home screen and book management
- `dashboard` — Dashboard tab (net position, summary, transaction list)
- `transactions` — Transaction add/edit/delete flows
- `categories` — Category management and templates
- `stats` — Breakdown/stats tab and charts
- `theme` — Colors, typography, design tokens
- `ui` — General UI components (`src/components/ui/`)
- `hooks` — Custom React hooks
- `routing` — Expo Router routes and navigation
- `config` — Configuration changes (app.json, eas.json, tsconfig)

## Rules
1. **Commit logically grouped changes together** — one commit per feature/fix, not one commit per file.
2. **Never bundle unrelated changes** — if you fixed a bug AND added a feature, those are 2 commits.
3. **Keep summaries under 70 characters** — details go in the body.
4. **Use imperative mood** — "Add filter support" not "Added filter support".
5. **Stage specific files** — use `git add <file>` not `git add .` to avoid accidentally committing secrets or build artifacts.
6. **Body explains the "why"** — the diff shows the "what", so the body should explain motivation, tradeoffs, or context.

## When to Commit
**Proactively suggest commits — don't let work pile up uncommitted.** Always confirm with the user before committing.

- **After completing a feature or fix** — suggest a commit once the change is working.
- **After completing a logical group of related changes** — e.g., "SQLite migration + CRUD" is one commit, not 4 separate ones.
- **Before switching to a different area of the codebase** — commit current work before moving on.
- **At the end of a session** — if there are uncommitted changes, remind the user and suggest appropriate commits.
- **Never commit automatically** — always ask the user first, but DO proactively suggest it.

## Examples
```
feat(bookshelf): Add book archive and restore flow

Allow users to archive books they're no longer actively tracking
without permanently deleting transaction history.
```

```
fix(dashboard): Calculate net position from all transactions

Was only summing income; now correctly subtracts expenses.
```

```
refactor(db): Extract migration logic into versioned functions

Each migration step is now a named function for easier debugging.
Schema version bumped to v3.
```

```
feat(stats): Add breakdown chart by category

Pie chart showing expense distribution across categories
using react-native-svg.
```
