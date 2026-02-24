---
name: issues-audit
description: Audit open GitHub issues against actual codebase state and propose status updates
user-invocable: true
allowed-tools: Bash, Read, Glob, Grep, AskUserQuestion
---

# Issues Audit

Reconcile open GitHub issues with the actual state of the codebase. Find issues that have been completed, started, or become stale — then walk through each with the user to confirm updates.

## Step 1: Gather data

Run these in parallel via Bash:

- **Open issues**: `gh issue list --repo ShumbaBrown/in-the-black --state open --limit 50 --json number,title,labels,createdAt,body`
- **Recent commits**: `git -C /Users/shumba/Develop/in-the-black log --oneline -30`
- **Uncommitted work**: `git -C /Users/shumba/Develop/in-the-black diff --name-only`
- **Staged changes**: `git -C /Users/shumba/Develop/in-the-black diff --cached --name-only`
- **Untracked files**: `git -C /Users/shumba/Develop/in-the-black ls-files --others --exclude-standard`

## Step 2: Cross-reference issues against code

For each open issue, determine its **actual status** by checking:

1. **Already done?** — Look for commits referencing the issue number (`#N`) or matching keywords from the title/body. Check if the files/features described in the issue body already exist in the codebase.

2. **In progress?** — Look for uncommitted or staged changes to files related to the issue. Check if the issue's `in-progress` label matches reality (labeled but no work found, or unlabeled but work exists).

3. **Stale/blocked?** — Issues with `blocked` label — check if the blocker has been resolved. Issues older than 2 weeks with no related commits.

4. **No change needed** — Issue is open, not started, and still valid.

## Step 3: Build a proposed changes list

Create a summary table of all issues that need a status update:

```
| # | Title | Current Status | Proposed Action | Evidence |
```

Proposed actions:
- **Close** — work is committed and deployed
- **Add in-progress** — uncommitted work found for this issue
- **Remove in-progress** — labeled but no matching work found
- **Unblock** — blocker appears resolved, remove `blocked` label
- **No change** — skip these, don't show them

Only show issues that need changes. If everything is up to date, say so.

## Step 4: Walk through each with the user

For each proposed change, use AskUserQuestion to confirm (batch up to 4 at a time):

- Show the issue number, title, current labels, and your evidence
- Let the user approve, skip, or choose a different action

After each batch of confirmations, immediately apply the approved changes via Bash:

- **To close**: `gh issue close <number> --repo ShumbaBrown/in-the-black --comment "summary of what was done"`
- **To add labels**: `gh issue edit <number> --repo ShumbaBrown/in-the-black --add-label "in-progress"`
- **To remove labels**: `gh issue edit <number> --repo ShumbaBrown/in-the-black --remove-label "in-progress"`

## Step 5: Summary

After all changes are applied, show a final summary:
- Issues closed
- Issues marked in-progress
- Issues unblocked
- Total open issues remaining
