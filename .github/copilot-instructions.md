# Copilot instructions (sitemap-manager)

## 项目概览
- 这是一个 **Node.js/TypeScript 的库**（非 CLI）：核心 API 是 `SitemapManager`，对外从 `src/index.ts` 导出。
- 主要目标：按“分类(category)”把 URL 分组，生成：
  - `sitemap.xml`：sitemap 索引（指向各分类文件）
  - `sitemap-<category>.xml`：每个分类一个 `urlset`
  - `sitemap.xsl`：样式表（`src/sitemap.xsl`；在实现里以 base64 常量写出）

关键实现文件：
- `src/main.ts`：`SitemapManager` 生命周期、去重、文件写出
- `src/utils.ts`：`objToString()` 负责把 `UrlObj` 转成 XML 片段，并做参数校验
- `src/types.ts`：公共类型（`Options`/`UrlObj`/hooks）
- `scripts/test.js`：典型用法与输出目录示例

## 构建/测试/代码风格
- 构建：`npm run build`（脚本会 `rm -rf dist && tsc`；在 Windows 上通常需要 Git Bash/WSL，或手动删除 `dist/` 后再运行 `tsc`）
- 监听编译：`npm run watch`
- 测试：`npm test`（会先 `npm run build`，再跑 `node scripts/test.js`）
- Lint：`npm run lint`（eslint + standard 风格）

## 核心约定（改代码时务必保持一致）
- **生命周期**：`addUrl()` 只能在 `finish()` 之前调用；`finish()` 之后再次调用会抛错/拒绝。
- **去重策略**：用 `#urls: Set<string>` 按 `loc.toString()` 去重；重复会走 `warningHandler`。
- **hooks 机制（很关键）**：
  - `options.hooks.warningHandler(msg)`：默认行为是 **直接 throw**（见 `src/utils.ts`），因此“重复 URL / 非法 changefreq / 非法 priority”在默认配置下会导致调用方报错。
  - `options.hooks.fileHandler(file, data)`：默认是 `fs.writeFileSync`，用于写出 `sitemap.xml`、`sitemap-*.xml`、`sitemap.xsl`。
  - 需要“只警告不中断”时，按 `scripts/test.js` 的方式覆写 `warningHandler`。
- **URL/路径拼装**：索引里的 `<loc>` 用 `new URL(path.join(pathPrefix, filename), siteURL)` 生成（见 `src/main.ts`）。修改相关逻辑时保持同一策略，避免出现不一致的 URL 格式。
- **XML 生成方式**：当前实现是直接字符串拼接（不是 XML builder）。修改输出结构时，优先沿用 `utils.objToString()` 的拼接方式。

## 常见改动落点
- 新增/调整 sitemap 元素字段：优先改 `src/types.ts`（类型） + `src/utils.ts`（序列化与校验） + 需要时更新 `scripts/test.js` 示例。
- 调整输出文件名/目录：改 `src/main.ts` 中 `fileHandler(path.resolve(outDir, ...))` 的写出位置。

## 提交内容的“边界”
- 这是一个发布到 npm 的库：不要引入运行时依赖（目前无 dependencies，仅 devDependencies）。
- 对外 API 主要是 `new SitemapManager(options)`、`addUrl(category, url|url[])`、`finish(): Promise<void>`；除非明确需要，避免破坏性变更。
