#!/bin/sh
input=$(cat)

# -- 경로 및 Git 브랜치 --
cwd=$(echo "$input" | jq -r '.workspace.current_dir // .cwd')
branch=$(git -C "$cwd" symbolic-ref --short HEAD 2>/dev/null || echo "")

# -- 컨텍스트 사용 비율 --
used=$(echo "$input" | jq -r '.context_window.used_percentage // empty')

# ANSI 색상 (실제 이스케이프 문자로 초기화)
CYAN=$(printf '\033[0;36m')
GREEN=$(printf '\033[0;32m')
YELLOW=$(printf '\033[1;33m')
RED=$(printf '\033[0;31m')
BLUE=$(printf '\033[0;34m')
BOLD=$(printf '\033[1m')
RESET=$(printf '\033[0m')

# -- 경로 + Git 브랜치 --
if [ -n "$branch" ]; then
  path_branch="${CYAN}${BOLD}${cwd}${RESET} ${YELLOW}${BOLD}(${branch})${RESET}"
else
  path_branch="${CYAN}${BOLD}${cwd}${RESET}"
fi

# -- 컨텍스트 막대 그래프 --
if [ -n "$used" ]; then
  used_int=$(printf '%.0f' "$used")
  bar_total=20
  filled=$(( used_int * bar_total / 100 ))
  empty=$(( bar_total - filled ))

  if [ "$used_int" -lt 50 ]; then
    bar_color="$GREEN"
  elif [ "$used_int" -lt 80 ]; then
    bar_color="$YELLOW"
  else
    bar_color="$RED"
  fi

  bar=""
  i=0
  while [ "$i" -lt "$filled" ]; do
    bar="${bar}█"
    i=$(( i + 1 ))
  done
  j=0
  while [ "$j" -lt "$empty" ]; do
    bar="${bar}░"
    j=$(( j + 1 ))
  done

  ctx_str=" ${BLUE}ctx:${RESET}${bar_color}[${bar}]${RESET} ${bar_color}${used_int}%${RESET}"
else
  ctx_str=""
fi

printf '%s' "${path_branch}${ctx_str}"
