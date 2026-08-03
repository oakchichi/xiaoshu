#!/bin/bash
# 一键部署脚本：提交改动并推送到 GitHub Pages
# 用法：bash deploy.sh "本次改了什么"

cd "$(dirname "$0")" || exit 1

MSG="${1:-auto deploy $(date '+%Y-%m-%d %H:%M')}"

echo "==> 添加改动..."
git add -A

echo "==> 提交: $MSG"
git commit -m "$MSG" --no-verify

echo "==> 推送到 GitHub..."
git push origin main

echo ""
echo "✅ 部署完成！"
echo "   网址: https://oakchichi.github.io/xiaoshu-kaoyan-buddy/"
echo "   （GitHub Pages 构建需要约 30 秒~1 分钟）"
