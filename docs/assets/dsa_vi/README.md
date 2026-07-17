# 如意金股（RuyiDailyStockAnalysis）视觉识别资产

## 设计理念

**如意走势图（Ruyi Chart）**——将中国传统如意纹与金融K线图融合：
- 如意钩（顶部金色曲线）：代表"如意"吉祥寓意
- 看涨K线柱（3根递增红柱）：代表量化分析，看涨趋势
- AI 星标（金色圆点）：人工智能 + 量化决策
- 配色：红金渐变（#dc2626 → #f59e0b）

## 资产清单

### SVG 源文件

| 文件 | 尺寸 | 说明 |
| --- | --- | --- |
| `icon.svg` | 64×64 | 方形图标（暗底圆形 + 图标核心） |
| `logo-light.svg` | 512×256 | 浅色底 Logo（白底 + 图标 + 中文 + 英文副标题） |
| `logo-dark.svg` | 512×256 | 深色底 Logo（深蓝底 + 图标 + 中文 + 英文副标题） |

### PNG 导出

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| `icon-16.png` | 16×16 | favicon 小图标 |
| `icon-32.png` | 32×32 | 任务栏 / 桌面通知图标 |
| `icon-48.png` | 48×48 | 桌面快捷方式 / Start 菜单 |
| `icon-64.png` | 64×64 | 高 DPI 标准图标 |
| `icon-128.png` | 128×128 | 中分辨率图标 |
| `icon-180.png` | 180×180 | Apple Touch Icon |
| `icon-256.png` | 256×256 | 高分辨率图标 |
| `icon-512.png` | 512×512 | 极高分辨率 / 母版 |

### ICO

| 文件 | 包含尺寸 | 说明 |
| --- | --- | --- |
| `favicon.ico` | 16×16, 32×32, 48×48 | 多尺寸 ICO，浏览器 / Windows 通用 |

## 生成方式

```bash
pip install pillow
python hermes-gen-icons.py
```

## Web 集成

前端应用的品牌资产副本位于 `apps/dsa-web/public/brand/`。

页面集成：
- `apps/dsa-web/index.html` — favicon 链接（SVG + ICO + Apple Touch Icon）
- `apps/dsa-web/src/components/common/BrandMark.tsx` — 复用品牌组件
- `apps/dsa-web/src/components/layout/SidebarNav.tsx` — 侧边栏 Logo
- `apps/dsa-web/src/pages/LoginPage.tsx` — 登录页品牌标识

## 作者

fufu | 如意金股 v0.1.0 | 2026
