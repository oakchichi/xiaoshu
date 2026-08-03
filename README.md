# 熊考研上岸

这是一个完整独立的手机竖屏网页应用，采用淡白 + 淡蓝柔和清新配色，自嘲熊可爱风格。

## 文件说明

- `index.html`：完整独立 HTML 源码，包含界面、样式和业务逻辑。
- `manifest.json`：PWA 配置，用于添加到手机桌面。
- `service-worker.js`：离线缓存脚本，让网页安装后可离线打开。
- `assets/bear-lie.gif`、`assets/bear-cheer.gif`、`assets/bear-persist.gif`、`assets/bear-lazy.gif`、`assets/bear-breakdown.gif`：页面直接使用的核心自嘲熊姿势素材，分别用于瘫、加油、坚持、摆烂、崩溃等状态。
- `assets/bear-study.gif`、`assets/bear-hula.gif`、`assets/bear-panic.gif`、`assets/bear-read.gif`、`assets/bear-shine.gif`、`assets/bear-mask.gif`、`assets/bear-flower.jpg`、`assets/bear-flower-2.jpg`、`assets/bear-flower-latest.jpg`：备用装饰熊素材和历史保留图标。
- `assets/tomatodo-import-v56.js`、`assets/tomatodo-import-v59.js`、`assets/tomatodo-import-v61.js`：番茄 Todo 历史导入留档，当前页面使用 v61，旧版本保留作备份。
- `assets/study-plan-v80.js`：最新逐日复习计划数据，由上传的《考研8月计划.md》生成，每日计划优先读取它。
- `assets/leisure-materials.js`：休闲资料更新包的预留数据文件，当前页面不主动加载，后续需要更新资料时可继续使用。

## 自嘲熊功能

- 首页新增“考研倒计时”卡，数字旁边放瘫坐熊。
- 首页新增“今日熊言”卡，支持点击“换一句”随机切换 14 条考研熊语录和姿势。
- 首页已合并精简统计模块：保留文字周报和三科时长分布；已删除重复的合计数字卡、本周累计小卡和每日学习柱状图。
- 首页已隐藏顶部说明标签和介绍文案，只保留标题、操作按钮和自嘲熊装饰。
- 首页顺序已调整为：倒计时、开始学习、今日熊言、学习统计（合并了时长统计和本周/本月统计）。
- 首页已删除"今日待办预览"，时长统计改为今日三科的时长 + 百分比分布。
- 科目页已删除顶部重复的“西综 / 英语 / 政治”切换条，三科切换统一通过左侧导航完成。
- 计时器按科目显示右上角熊：西综加油熊、英语摆烂熊、政治崩溃熊。
- 待办清单空状态显示瘫坐熊。
- 休闲区新增“自嘲熊语录”，支持“换一只”和“朗读”，会用浏览器中文语音朗读熊言。

## 本地数据持久化

所有计划、待办、计时、笔记和统计记录都保存在浏览器 `localStorage` 中。关闭页面、隔天重新打开，记录不会丢失。

注意：如果用户主动清除浏览器站点数据、更换浏览器、无痕模式访问或更换域名，本地数据会受到影响。建议在“设置”页定期导出 JSON 备份。

## 添加到手机桌面

### 安卓

1. 用 Chrome、Edge 或系统浏览器打开部署后的公网链接。
2. 点击浏览器菜单。
3. 选择“添加到主屏幕”或“安装应用”。

### iPhone

1. 用 Safari 打开部署后的公网链接。
2. 点击底部分享按钮。
3. 选择“添加到主屏幕”。

## 长期稳定公网部署

本项目是纯静态网页，可以部署到 GitHub Pages、Cloudflare Pages、Netlify、Vercel 或任意对象存储静态网站。

### 推荐：GitHub Pages

1. 新建 GitHub 仓库，例如 `xiaoshu-kaoyan-buddy`。
2. 上传本文件夹内所有文件。
3. 进入仓库 `Settings` → `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待部署完成。
7. 获得长期链接：`https://你的GitHub用户名.github.io/xiaoshu-kaoyan-buddy/`。

### 推荐：Cloudflare Pages

1. 登录 Cloudflare。
2. 进入 `Workers & Pages` → `Create application` → `Pages`。
3. 连接 GitHub 仓库或直接上传本文件夹。
4. 构建命令留空，输出目录填 `/`。
5. 部署后获得 `*.pages.dev` 长期链接。

## 注意

我没有在这里生成临时沙盒预览链接。若需要我直接帮你发布成公网链接，请提供可用的托管方式或授权环境，例如 GitHub 仓库、Cloudflare Pages、Vercel 或服务器信息。
