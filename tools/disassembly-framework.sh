#!/usr/bin/env bash
# Systematic Disassembly/Analysis Framework
# "I want a dog ever kinda way" - thorough, methodical, comprehensive

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

TARGET="${1:-}"
OUTPUT_DIR="${2:-./disassembly-output}"

if [ -z "$TARGET" ]; then
    echo -e "${RED}Usage: $0 <target_file_or_dir> [output_dir]${NC}"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT="$OUTPUT_DIR/analysis_${TIMESTAMP}.md"

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   SYSTEMATIC DISASSEMBLY FRAMEWORK${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Target:${NC} $TARGET"
echo -e "${YELLOW}Output:${NC} $REPORT"
echo ""

# Initialize report
cat > "$REPORT" <<'EOF'
# Disassembly Analysis Report

**Date:** $(date)
**Target:** TARGET_PLACEHOLDER
**Analyst:** Cody Heinen + Claude Code

---

## Executive Summary
[To be filled during analysis]

---

## Table of Contents
1. [Initial Reconnaissance](#initial-reconnaissance)
2. [File Structure Analysis](#file-structure-analysis)
3. [Content Analysis](#content-analysis)
4. [Dependency Mapping](#dependency-mapping)
5. [Security Assessment](#security-assessment)
6. [Code Quality Metrics](#code-quality-metrics)
7. [Pattern Recognition](#pattern-recognition)
8. [Findings & Recommendations](#findings--recommendations)

---

## 1. Initial Reconnaissance

### File/Directory Overview
EOF

sed -i "s|TARGET_PLACEHOLDER|$TARGET|g" "$REPORT"

# Function: Analyze file/directory structure
analyze_structure() {
    echo -e "${BLUE}[1/8] Initial Reconnaissance...${NC}"
    {
        echo ""
        echo "### Basic Stats"
        if [ -f "$TARGET" ]; then
            echo "- Type: File"
            echo "- Size: $(du -h "$TARGET" | cut -f1)"
            echo "- Lines: $(wc -l < "$TARGET")"
            echo "- Extension: ${TARGET##*.}"
            file "$TARGET" | sed 's/^/- Format: /'
        elif [ -d "$TARGET" ]; then
            echo "- Type: Directory"
            echo "- Total Size: $(du -sh "$TARGET" | cut -f1)"
            echo "- File Count: $(find "$TARGET" -type f | wc -l)"
            echo "- Directory Count: $(find "$TARGET" -type d | wc -l)"
        fi
        echo ""
    } >> "$REPORT"
}

# Function: Deep file structure
analyze_file_structure() {
    echo -e "${BLUE}[2/8] File Structure Analysis...${NC}"
    {
        echo "## 2. File Structure Analysis"
        echo ""
        if [ -d "$TARGET" ]; then
            echo '```'
            tree -L 3 -I 'node_modules|.git|dist|build' "$TARGET" 2>/dev/null || find "$TARGET" -maxdepth 3 -type f
            echo '```'
        fi
        echo ""
    } >> "$REPORT"
}

# Function: Content analysis
analyze_content() {
    echo -e "${BLUE}[3/8] Content Analysis...${NC}"
    {
        echo "## 3. Content Analysis"
        echo ""
        if [ -f "$TARGET" ]; then
            echo "### File Type Specific Analysis"
            case "${TARGET##*.}" in
                js|ts|jsx|tsx)
                    echo "**Language:** JavaScript/TypeScript"
                    echo ""
                    echo "**Imports:**"
                    echo '```'
                    rg '^import' "$TARGET" 2>/dev/null || grep '^import' "$TARGET" || echo "None found"
                    echo '```'
                    echo ""
                    echo "**Exports:**"
                    echo '```'
                    rg '^export' "$TARGET" 2>/dev/null || grep '^export' "$TARGET" || echo "None found"
                    echo '```'
                    ;;
                py)
                    echo "**Language:** Python"
                    echo ""
                    echo "**Imports:**"
                    echo '```'
                    rg '^(import|from .* import)' "$TARGET" 2>/dev/null || grep -E '^(import|from .* import)' "$TARGET" || echo "None found"
                    echo '```'
                    ;;
                java|kt)
                    echo "**Language:** Java/Kotlin"
                    echo ""
                    echo "**Imports:**"
                    echo '```'
                    rg '^import' "$TARGET" 2>/dev/null || grep '^import' "$TARGET" || echo "None found"
                    echo '```'
                    ;;
                *)
                    echo "**File Type:** ${TARGET##*.}"
                    ;;
            esac
        elif [ -d "$TARGET" ]; then
            echo "### Language Distribution"
            echo '```'
            fd -e js -e ts -e jsx -e tsx -e py -e java -e kt -e go -e rs . "$TARGET" 2>/dev/null | awk -F. '{print $NF}' | sort | uniq -c | sort -rn || echo "fd not available"
            echo '```'
        fi
        echo ""
    } >> "$REPORT"
}

# Function: Dependency mapping
analyze_dependencies() {
    echo -e "${BLUE}[4/8] Dependency Mapping...${NC}"
    {
        echo "## 4. Dependency Mapping"
        echo ""
        if [ -d "$TARGET" ]; then
            for pkg_file in "$TARGET/package.json" "$TARGET/requirements.txt" "$TARGET/Cargo.toml" "$TARGET/go.mod" "$TARGET/build.gradle"; do
                if [ -f "$pkg_file" ]; then
                    echo "### $(basename "$pkg_file")"
                    echo '```'
                    cat "$pkg_file"
                    echo '```'
                    echo ""
                fi
            done
        fi
    } >> "$REPORT"
}

# Function: Security assessment
analyze_security() {
    echo -e "${BLUE}[5/8] Security Assessment...${NC}"
    {
        echo "## 5. Security Assessment"
        echo ""
        echo "### Potential Security Concerns"
        echo ""

        # Check for common security issues
        if [ -f "$TARGET" ] || [ -d "$TARGET" ]; then
            echo "**Hardcoded Secrets/Credentials:**"
            echo '```'
            rg -i '(password|api[_-]?key|secret|token|credential)' "$TARGET" 2>/dev/null | head -20 || echo "None found"
            echo '```'
            echo ""

            echo "**Eval/Exec Usage:**"
            echo '```'
            rg -i '(eval\(|exec\(|system\(|shell_exec)' "$TARGET" 2>/dev/null | head -20 || echo "None found"
            echo '```'
            echo ""
        fi
    } >> "$REPORT"
}

# Function: Code quality metrics
analyze_quality() {
    echo -e "${BLUE}[6/8] Code Quality Metrics...${NC}"
    {
        echo "## 6. Code Quality Metrics"
        echo ""
        if [ -d "$TARGET" ]; then
            echo "### Line Counts by File Type"
            echo '```'
            find "$TARGET" -type f -name '*.js' -o -name '*.ts' -o -name '*.py' -o -name '*.java' 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 || echo "No source files found"
            echo '```'
            echo ""

            echo "### TODO/FIXME Items"
            echo '```'
            rg -i 'TODO|FIXME|HACK|XXX|BUG' "$TARGET" 2>/dev/null | head -20 || echo "None found"
            echo '```'
        fi
        echo ""
    } >> "$REPORT"
}

# Function: Pattern recognition
analyze_patterns() {
    echo -e "${BLUE}[7/8] Pattern Recognition...${NC}"
    {
        echo "## 7. Pattern Recognition"
        echo ""
        echo "### Common Patterns Detected"
        echo ""

        # Check for common architectural patterns
        if [ -d "$TARGET" ]; then
            echo "**Design Patterns:**"
            patterns=("Factory" "Singleton" "Observer" "Strategy" "Decorator" "Adapter")
            for pattern in "${patterns[@]}"; do
                count=$(rg -i "$pattern" "$TARGET" 2>/dev/null | wc -l || echo 0)
                if [ "$count" -gt 0 ]; then
                    echo "- $pattern: $count occurrences"
                fi
            done
            echo ""
        fi
    } >> "$REPORT"
}

# Function: Findings summary
summarize_findings() {
    echo -e "${BLUE}[8/8] Generating Findings...${NC}"
    {
        echo "## 8. Findings & Recommendations"
        echo ""
        echo "### Key Findings"
        echo "- [Auto-populated findings will be added by Claude Code]"
        echo ""
        echo "### Recommendations"
        echo "- [Recommendations will be added based on analysis]"
        echo ""
        echo "---"
        echo ""
        echo "**Analysis completed:** $(date)"
    } >> "$REPORT"
}

# Execute all analysis steps
analyze_structure
analyze_file_structure
analyze_content
analyze_dependencies
analyze_security
analyze_quality
analyze_patterns
summarize_findings

echo ""
echo -e "${GREEN}✓ Analysis complete!${NC}"
echo -e "${CYAN}Report saved to:${NC} $REPORT"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the report: cat $REPORT"
echo "2. Claude Code will analyze findings and provide recommendations"
echo "3. Execute any necessary remediation steps"
