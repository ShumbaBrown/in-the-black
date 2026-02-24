---
name: brainstorm
description: Brainstorm new features through guided questions and add them to the backlog
user-invocable: true
allowed-tools: Bash, Read, Grep, Glob, AskUserQuestion
---

# Feature Brainstorming Session

Help the user discover and define new features for In The Black through guided questioning.

## Step 1: Understand context

Read these files first (silently — don't dump their contents):
- `/Users/shumba/Develop/in-the-black/CLAUDE.md` — current architecture and features
- `/Users/shumba/Develop/in-the-black/memory/learnings.md` — lessons and patterns

## Step 2: Ask discovery questions

If the user provided an idea with `$ARGUMENTS`, explore that idea. Otherwise, ask questions to surface ideas. Use AskUserQuestion to ask 1-2 questions at a time (not all at once). Good questions:

- "What's the most frustrating thing about using the app right now?"
- "What do you find yourself wishing the app could do when tracking a hobby?"
- "Which existing feature do you use the most? What would make it better?"
- "Are there things you do outside the app (spreadsheets, other apps) that could be built in?"
- "What would make the app feel more complete or polished?"

## Step 3: Shape the feature

Once an idea emerges, help define it:

1. **User story**: "As a [user], I want [feature] so that [benefit]"
2. **MVP scope**: Simplest version that delivers value
3. **Data model**: What SQLite tables/columns are needed?
4. **Architecture fit**: Which screen(s)? New hook or component needed? New route?
5. **Dependencies**: Does it require new packages or native modules?

## Step 4: Propose backlog entry

Present a structured feature proposal:

```
### [Feature Name]
**User story:** ...
**MVP:** ...
**Screen:** [which tab/route]
**New files:** [hooks, components, db changes]
**SQLite:** [new tables/columns/migrations]
**Priority:** [Core / Enhancement / Nice to Have]
**Effort:** [Small / Medium / Large]
```

## Step 5: Add to backlog

Ask the user where they want to track this. Options:

1. **GitHub Issue (recommended)**: Run `gh issue create --repo ShumbaBrown/in-the-black --title "..." --body "..." --label "enhancement"` via Bash. Before creating, search for duplicates: `gh issue list --repo ShumbaBrown/in-the-black --search "keywords" --state open`.
2. **Just discuss**: Keep it as a conversation for now
