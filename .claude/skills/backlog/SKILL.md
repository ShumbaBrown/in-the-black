---
name: backlog
description: Review project backlog and suggest what to work on today
user-invocable: true
allowed-tools: Bash, Read, Grep, Glob
---

# Review Backlog and Suggest Today's Work

Read the following to understand current project state:

1. **GitHub Issues**: Run `gh issue list --repo ShumbaBrown/in-the-black --state open --limit 50` via Bash to get all open issues
2. **`/Users/shumba/Develop/in-the-black/CLAUDE.md`** — Architecture and critical gotchas
3. **`/Users/shumba/Develop/in-the-black/memory/learnings.md`** — Hard-won lessons

Then suggest what to work on today using this priority order:

### Priority 1: Unblock critical paths
- Issues labeled `blocked` that now have a resolution path
- Dependencies that hold up multiple other tasks
- Build/deploy issues preventing releases

### Priority 2: Testing and stability
- Missing test coverage for shipped features
- Bug reports or regressions (issues labeled `bug`)
- Manual testing gaps

### Priority 3: High-impact features
- Features that improve core user experience (books, transactions, dashboards)
- Features closest to completion (issues labeled `in-progress`)
- Items that unlock other features

### Priority 4: Polish and tech debt
- Accessibility, performance
- Code cleanup and refactoring
- Documentation updates

### Output format

Present 3-5 recommended tasks, each with:
- **Task**: `#issue_number` — What to do (1 line)
- **Why now**: Why this is the right priority today (1 line)
- **Scope**: Small / Medium / Large estimate
- **Files**: Key files to start with

End with a quick summary of what's blocked and can't be worked on yet (issues labeled `blocked`).
