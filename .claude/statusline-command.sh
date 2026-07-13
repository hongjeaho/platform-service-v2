#!/bin/bash
# Project-scoped Claude Code status line.
# Shows: full cwd path + git branch, and a colored context-usage bar graph.

input=$(cat)

RESET='\033[0m'
DIR_COLOR='\033[38;5;110m'    # dim blue - directory path
BRANCH_COLOR='\033[38;5;138m' # dim tan  - git branch
LABEL_COLOR='\033[2;37m'      # dim gray - labels/percentage text

dir=$(echo "$input" | jq -r '.workspace.current_dir // empty')
[ -z "$dir" ] && dir="$(pwd)"

branch=$(git -C "$dir" --no-optional-locks rev-parse --abbrev-ref HEAD 2>/dev/null)
[ -z "$branch" ] && branch="no-git"

used=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
if [ -n "$used" ]; then
  used_int=$(printf '%.0f' "$used" 2>/dev/null)
else
  used_int=0
fi
[ -z "$used_int" ] && used_int=0
[ "$used_int" -lt 0 ] && used_int=0
[ "$used_int" -gt 100 ] && used_int=100

blocks=10
filled=$(( used_int * blocks / 100 ))
empty=$(( blocks - filled ))

bar=""
i=0
while [ "$i" -lt "$filled" ]; do
  bar="${bar}█"
  i=$(( i + 1 ))
done
i=0
while [ "$i" -lt "$empty" ]; do
  bar="${bar}░"
  i=$(( i + 1 ))
done

# Color the bar/percentage by usage severity (kept dim for readability on dim-color terminals).
if [ "$used_int" -ge 80 ]; then
  BAR_COLOR='\033[38;5;174m' # dim red
elif [ "$used_int" -ge 50 ]; then
  BAR_COLOR='\033[38;5;179m' # dim yellow
else
  BAR_COLOR='\033[38;5;108m' # dim green
fi

printf "${DIR_COLOR}%s${RESET} ${BRANCH_COLOR}(%s)${RESET}  ${LABEL_COLOR}Ctx${RESET} ${BAR_COLOR}[%s]${RESET} ${LABEL_COLOR}%s%%${RESET}\n" \
  "$dir" "$branch" "$bar" "$used_int"
