#!/bin/bash

# Script to analyze all branches
branches=$(git branch -r | grep -v HEAD | sed 's/origin\///' | sed 's/^[[:space:]]*//')

echo "# Branch Analysis Report"
echo "Generated: $(date)"
echo ""

for branch in $branches; do
    echo "## Branch: $branch"
    echo ""

    # Get commit count
    commit_count=$(git rev-list --count origin/$branch 2>/dev/null || echo "0")
    echo "**Total commits:** $commit_count"

    # Get recent commits
    echo ""
    echo "**Recent commits (last 5):**"
    git log origin/$branch --oneline --no-merges -5 2>/dev/null || echo "No commits"
    echo ""

    # Get divergence from main
    if git rev-parse origin/main >/dev/null 2>&1; then
        ahead=$(git rev-list --count origin/main..origin/$branch 2>/dev/null || echo "0")
        behind=$(git rev-list --count origin/$branch..origin/main 2>/dev/null || echo "0")
        echo "**Divergence from main:** Ahead: $ahead, Behind: $behind"
    fi

    # Get last commit date
    last_commit_date=$(git log origin/$branch -1 --format=%ai 2>/dev/null || echo "Unknown")
    echo "**Last commit:** $last_commit_date"

    # Get file change summary
    echo ""
    echo "**Files changed from main:**"
    git diff --name-status origin/main...origin/$branch 2>/dev/null | head -20 || echo "Cannot compare with main"

    echo ""
    echo "---"
    echo ""
done
