---
name: issues
description: Fetch open GitHub issues and help decide what to work on next
user-invocable: true
allowed-tools: Bash, Read, Glob, Grep, AskUserQuestion
---

# Open Issues & What to Work On

## Step 1: Fetch open issues

Run these in parallel via Bash:

- **Issues**: `gh issue list --repo ShumbaBrown/in-the-black --state open --limit 50 --json number,title,labels,createdAt,body`
- **Current branch**: `git -C /Users/shumba/Develop/in-the-black branch --show-current`
- **Uncommitted work**: `git -C /Users/shumba/Develop/in-the-black status --short`

## Step 2: Present the issues

Group issues by status and label, using this display order:

1. **In Progress** — issues with the `in-progress` label (show these first, highlighted)
2. **Bugs** — issues with `bug` label
3. **Feature requests** — issues with `enhancement` or `feature` label
4. **Tech debt / chores** — issues with `chore`, `refactor`, `test`, `docs`
5. **Unlabeled** — everything else

For each issue, show:
- `#number` — **Title**
- Labels (if any)
- Age (e.g., "3 days ago")
- First ~100 chars of body (if it helps clarify scope)

Issues with `in-progress` label should be marked clearly so the user knows another session is already working on them. Do NOT recommend in-progress issues — they're already being handled.

## Step 3: Recommend what to work on

After showing all issues, recommend 1-3 issues to tackle using this priority logic:

1. **Skip in-progress issues** — another session is already on them
2. **Bugs first** — broken things beat new things
3. **Quick wins** — small-scope items that can be done in one session
4. **Unblocked features** — things that don't depend on other work
5. **Consider current branch** — if already on a feature branch, suggest finishing that work first

For each recommendation:
- **Issue**: `#number` — Title
- **Priority**: P1 (critical) / P2 (important) / P3 (nice-to-have)
- **Why**: 1-2 sentence justification for why this should be worked on next
- **Scope**: Small / Medium / Large estimate based on the issue body
- **Starting point**: Key files or services likely involved

## Step 4: Let the user choose

Use AskUserQuestion to ask which issue they want to work on (or if they'd rather do something else). Include the top recommendations as options — each option's description must include the priority level and a short justification so the user can make an informed choice without scrolling back up.

Once they choose:
1. **Mark it in-progress**: `gh issue edit <number> --repo ShumbaBrown/in-the-black --add-label "in-progress"`
2. Briefly outline the first steps to get started — files to read, approach to take, whether plan mode is appropriate.

## Step 5: When done with an issue

When work on an issue is complete (committed and verified), always:
1. Add a summary comment: `gh issue comment <number> --repo ShumbaBrown/in-the-black --body "summary of what was done"`
2. Ask the user if the issue should be closed. Once confirmed: `gh issue close <number> --repo ShumbaBrown/in-the-black --comment "summary"`.
   The `in-progress` label is automatically removed when an issue is closed.
