# Git Workflow & Branch-Linear Task Lineage

**Version:** 1.0
**Last Updated:** 2025-11-17

---

## Overview

The Seven of Nine Core project uses a structured branching strategy that creates direct lineage between Git branches and Linear task tracking. This ensures every development effort is traceable, organized, and linked to project management workflows.

---

## Branch Naming Convention

All development branches follow this strict naming pattern:

```
claude/<task-description>-<linear-task-id>
```

### Components

1. **Prefix:** `claude/`
   - Identifies branches created by Claude AI development sessions
   - Separates automated/AI-assisted work from manual branches

2. **Task Description:** `<task-description>`
   - Short, kebab-case description of the work being done
   - Should be concise but descriptive (2-5 words)
   - Examples: `add-branch-lineage-docs`, `check-lin-connection`, `fix-attestation-bug`

3. **Linear Task ID:** `<linear-task-id>`
   - Alphanumeric identifier from Linear project management
   - Unique identifier that links the branch to the specific Linear task
   - Format: Typically starts with digits followed by alphanumeric characters
   - Examples: `012m21B7MEsf54S4mpNoYpnQ`, `01HrLnTuaqxrkGuHPACbaLQc`

### Examples

```bash
# Good branch names
claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ
claude/check-lin-connection-01HrLnTuaqxrkGuHPACbaLQc
claude/fix-ed25519-validation-01AbCdEfGhIjKlMnOpQrStUv

# Bad branch names (missing components)
feature/add-docs                    # Missing claude prefix and Linear ID
claude/add-docs                     # Missing Linear ID
add-branch-lineage-docs-012m21B7    # Missing claude prefix
```

---

## Workflow Process

### 1. Starting New Work

When beginning work on a Linear task:

```bash
# Ensure you're on the latest version of your base branch
git fetch origin

# Create new branch with proper naming
git checkout -b claude/<description>-<linear-id>

# Verify you're on the correct branch
git branch --show-current
```

### 2. During Development

- Make atomic, logical commits
- Write clear commit messages that reference the work being done
- Push regularly to remote to ensure work is backed up

```bash
# Stage and commit your changes
git add <files>
git commit -m "feat: Implement feature XYZ"

# Push to remote (use -u for first push)
git push -u origin claude/<description>-<linear-id>
```

### 3. Completing Work

When your task is complete:

1. Ensure all tests pass
2. Verify code quality standards are met
3. Push final changes to remote
4. Create pull request linking to Linear task
5. Update Linear task status

---

## Integration with Linear

### Automatic Linking

The Linear task ID in the branch name creates automatic associations:

- Branch commits appear in Linear task timeline
- Pull requests are automatically linked to tasks
- Development progress is visible in Linear UI

### Task Status Updates

Update your Linear task status as you progress:

1. **In Progress** - When branch is created and work begins
2. **In Review** - When pull request is opened
3. **Done** - When PR is merged and branch is deleted

---

## Branch Lifecycle

### Creation

```bash
# Create from main or relevant base branch
git checkout main
git pull origin main
git checkout -b claude/new-feature-<linear-id>
```

### Active Development

- Regular commits with descriptive messages
- Frequent pushes to remote
- Periodic rebasing/merging from base branch to stay current

### Completion

```bash
# Final push
git push origin claude/new-feature-<linear-id>

# Open pull request (via GitHub CLI or web interface)
gh pr create --title "feat: Add new feature" \
  --body "Implements Linear task <linear-id>"

# After PR approval and merge, delete local branch
git checkout main
git branch -d claude/new-feature-<linear-id>
```

---

## Current Active Branches

As of the latest update, the following branches are active:

| Branch | Linear Task | Status | Description |
|--------|-------------|--------|-------------|
| `claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ` | 012m21B7MEsf54S4mpNoYpnQ | Active | Adding branch-Linear task documentation |
| `claude/check-lin-connection-01HrLnTuaqxrkGuHPACbaLQc` | 01HrLnTuaqxrkGuHPACbaLQc | Active | Verifying Linear integration |

---

## Best Practices

### Branch Management

1. **One branch per task** - Each Linear task gets exactly one development branch
2. **Short-lived branches** - Complete tasks quickly, merge, and delete branches
3. **Descriptive names** - Make task description clear and searchable
4. **Clean history** - Squash or rebase commits before merging if needed

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions/modifications
- `chore`: Maintenance tasks

Example:
```
feat(creator-bond): Add Ed25519 signature validation

Implements cryptographic verification for device attestation
as specified in Linear task 01AbCdEf.

Resolves: #123
Linear: 01AbCdEfGhIjKlMnOpQrStUv
```

### Pull Requests

- Reference Linear task ID in PR title and description
- Include comprehensive testing information
- Link related issues and documentation
- Request appropriate reviewers

---

## Troubleshooting

### Branch Name Too Long

If your combined description and Linear ID create an excessively long branch name:

```bash
# Shorten the description part
# Instead of:
claude/implement-comprehensive-ed25519-attestation-validation-system-012m21B7MEsf54S4mpNoYpnQ

# Use:
claude/ed25519-attestation-012m21B7MEsf54S4mpNoYpnQ
```

### Lost Linear Task ID

If you can't find the Linear task ID:

1. Check Linear web interface
2. Look at task URL: `linear.app/team/PROJECT-XXX` (where PROJECT-XXX is the ID)
3. Ask project lead or check project documentation

### Merge Conflicts

When rebasing or merging:

```bash
# Fetch latest changes
git fetch origin

# Rebase onto main (or relevant base branch)
git rebase origin/main

# Resolve conflicts, then
git add <resolved-files>
git rebase --continue

# Force push (if already pushed to remote)
git push --force-with-lease origin claude/<description>-<linear-id>
```

---

## Related Documentation

- [Getting Started](./1_getting_started.md) - Initial setup and dependencies
- [Testing & Validation](./3_testing.md) - Quality assurance processes
- [Deployment](./4_deployment.md) - Release and deployment workflows

---

## Questions or Issues?

For questions about this workflow:

1. Check Linear task comments for task-specific questions
2. Review this documentation for process questions
3. Consult with project lead for strategy questions
4. Update this documentation when processes evolve
