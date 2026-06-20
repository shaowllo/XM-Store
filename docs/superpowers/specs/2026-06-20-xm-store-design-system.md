# XM Store Design System — "Midnight Gold"

> **版本:** 2.0 | **日期:** 2026-06-20 | **定位:** 中东市场外贸独立站

---

## 1. 设计理念

**"Midnight Gold"** — 为中东高端消费市场打造的数字精品店美学。

- **调性定位:** 奢华、精致、自信
- **差异化记忆点:** 深色夜空背景上的琥珀金光，Cormorant 衬线体标题带来的杂志级排版质感
- **核心设计原则:** 克制配色、专注排版、以影像主导

---

## 2. 色彩体系

### 暗色主题（默认）

| 令牌 | 色值 | 用途 |
|------|------|------|
| `background` | `hsl(225 25% 4%)` | 页面背景 — 深午夜海军蓝 |
| `foreground` | `hsl(36 30% 92%)` | 主文本 — 暖象牙白 |
| `card` | `hsl(225 20% 7%)` | 卡片、面板背景 |
| `primary` | `hsl(42 65% 55%)` | 主色 — 琥珀金 |
| `primary-foreground` | `hsl(225 25% 4%)` | 金色按钮上的深色文字 |
| `secondary` | `hsl(225 15% 13%)` | 次级表面 |
| `muted` | `hsl(225 15% 12%)` | 静音背景（图片占位符等） |
| `muted-foreground` | `hsl(36 15% 55%)` | 辅助文本 — 温暖的灰色 |
| `accent` | `hsl(28 55% 50%)` | 强调色 — 铜色 |
| `border` | `hsl(225 15% 16%)` | 边框 |
| `ring` | `hsl(42 65% 55%)` | 焦点环 — 金色 |

### 明亮主题

| 令牌 | 色值 |
|------|------|
| `background` | `hsl(40 30% 97%)` |
| `foreground` | `hsl(225 20% 12%)` |
| `primary` | `hsl(42 55% 48%)` |
| `muted-foreground`| `hsl(225 10% 42%)` |

### 自定义工具类

| 类名 | 效果 |
|------|------|
| `.gold-text` | 金色渐变文字（用于 logo 和特殊标题） |
| `.glass` | 毛玻璃效果容器 |
| `.gold-glow` | 金色柔和发光阴影 |
| `.gold-border` | 金色渐变装饰边框 |
| `.bg-mesh` | 微妙的放射渐变背景纹理 |
| `.btn-gold` | 金色 CTA 按钮（带 shimmer 动画） |

---

## 3. 字体系统

### 字体堆叠

| 用途 | 字体 | 类型 |
|------|------|------|
| **标题 (h1-h4)** | Cormorant Garamond (`font-serif`) | 优雅衬线体 — 高对比度，杂志质感 |
| **正文 / UI** | DM Sans (`font-sans`) | 几何无衬线 — 现代干净，可读性强 |
| **代码 / 数据** | JetBrains Mono (`font-mono`) | 等宽字体 |

### 字号量纲

| 层级 | 移动端 | 桌面端 | 用途 |
|------|--------|--------|------|
| Hero 标题 | `5xl` (3rem) | `8xl` (6rem) | 首页主标题 |
| 章节标题 | `3xl`~`4xl` | `5xl`~`6xl` | "Featured Products" 等 |
| 产品卡片标题 | `sm`~`base` | `lg` | 产品名 |
| 正文 | `base` | `lg` | 描述文本 |
| 辅助文本 | `xs` | `sm` | 价格、标签 |

### 字重

- **Cormorant:** 400 (正文), 500 (副标题), 600/700 (标题)
- **DM Sans:** 400 (正文), 500 (强调), 600/700 (按钮/标签)
- **tracking-tight:** 标题默认 `-0.015em`
- **tracking-wide:** 标签和按钮为 `0.15em~0.25em`

---

## 4. 布局与间距

### 容器

- `max-w-7xl` — 最大宽度 1280px
- 水平内边距: `px-6` (移动端) / `px-10` (桌面端)
- 垂直节奏: 章节间距 `py-28`~`py-36` (桌面端)

### 网格系统

| 用途 | 移动端 | 桌面端 |
|------|--------|--------|
| 精选产品 | 1 列 | 3 列 (`gap-10`) |
| 分类 | 2 列 | 4 列 (`gap-5`) |
| 编辑特写 | 1 列 | 5 列 (`lg:grid-cols-5`) |
| Footer 特性 | 2 列 | 4 列 |
| Footer 链接 | 2 列 | 5 列 |

### 圆角

- `--radius: 0.625rem` (10px) — 全局基准
- 卡片/图片容器: `rounded-2xl` (16px)
- 按钮/标签: `rounded-lg` (8px)
- 图标容器: `rounded-xl` (12px)

---

## 5. 组件规范

### 导航栏

- **高度:** 56px (`h-14`)
- **样式:** `.glass` 毛玻璃效果 + `sticky top-0 z-50`
- **Logo:** 琥珀金渐变色图标方块 + `.gold-text` 文字
- **链接:** 大写追踪文字，悬停变亮
- **图标按钮:** 36px (`h-9 w-9`)，圆角 8px
- **移动端菜单:** 全屏毛玻璃下拉

### 首页 Hero

- **高度:** `min-h-[100svh]`
- **背景:** 全出血图片 + 多层渐变叠加（黑→背景色）
- **金色氛围光:** 右上角 `from-amber-500/8`
- **标题:** Cormorant 衬线，多级字号响应式
- **CTA:** `.btn-gold` 带 shimmer 动画
- **滚动指示器:** 底部居中，跳动箭头动画

### 产品卡片

- **图片比例:** `aspect-[4/5]`（竖版）
- **圆角:** `rounded-2xl`
- **悬停效果:** 
  - 图片放大 `scale-[1.04]`
  - 渐变遮罩淡入
  - "Add to Cart" 从底部滑入
- **产品名:** Cormorant，悬停变金色
- **价格:** `$` 前缀，DM Sans

### 编辑特写区

- **布局:** `lg:grid-cols-5`（文字 2 列 / 图片 3 列）
- **图片:** `gold-glow` 发光阴影
- **装饰:** 章节标签前置琥珀色水平线分隔

### Footer

- **特性带:** 4 列，琥珀色图标容器
- **链接区:** 品牌 + 3 列链接
- **链接悬停:** 琥珀色 + 箭头动画
- **底栏:** 版权 + 法律链接

---

## 6. 动效规范

| 元素 | 动效 | 参数 |
|------|------|------|
| 页面入场 | framer-motion `fadeUp` | `y: 0→40`, `duration: 0.6~1s` |
| 交错显示 | `staggerChildren: 0.12~0.15` | 列表/网格项目 |
| 悬停缩放 | CSS `scale` | `group-hover:scale-[1.04]`, `duration 700ms` |
| 金色按钮 | shimmer 动画 | `3s ease-in-out infinite` |
| 滚动指示器 | 上下弹跳 | `y: [0, 8, 0]`, `2s easeInOut infinite` |
| 导航入场 | spring | `stiffness: 120, damping: 22` |
| 移动菜单 | height 动画 | AnimatePresence |

### 缓动函数

- 主缓动: `[0.25, 0.46, 0.45, 0.94]` (cubic-bezier — 自定义缓出)
- 弹跳: spring 物理

---

## 7. 响应式设计

### 断点

- `sm`: 640px — 平板竖屏
- `md`: 768px — 平板横屏
- `lg`: 1024px — 小桌面
- `xl`: 1280px — 标准桌面

### 关键适配

- 导航: 桌面端全展开 → 平板/手机端汉堡菜单
- 产品网格: 1→2→3→4 列
- Hero 标题: `text-5xl` → `text-8xl`
- 表格/表单: 纵向堆叠 → 横向并排

---

## 8. 可访问性

- 所有交互元素带 `aria-label`
- 颜色对比度: 前景/背景比 ≥ 4.5:1（正文），≥ 3:1（大标题）
- 键盘导航: 所有链接和按钮可通过 Tab 访问
- 焦点指示: 金色 `ring` 可见焦点环
- 图片: 所有 Next/Image 带 `alt` 文本

---

## 9. 文件索引

| 文件 | 职责 |
|------|------|
| `src/app/globals.css` | 色彩体系、`@theme` 令牌、工具类、动画关键帧 |
| `src/app/layout.tsx` | 字体加载 (next/font/google)、全局 Provider 包裹 |
| `src/app/page.tsx` | 首页 — Hero、精选、编辑特写、分类、促销、Newsletter |
| `src/components/navbar.tsx` | 全局导航栏 |
| `src/components/footer.tsx` | 全局页脚 |
| `src/components/product-card.tsx` | 产品卡片组件 |
| `tailwind.config.ts` | Tailwind v4 `@theme` 配置（通过 CSS） |
