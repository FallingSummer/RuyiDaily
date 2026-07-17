# 📈 如意金股（RuyiDailyStockAnalysis）

> **作者**: fufu  
> **上游**: 基于 [daily_stock_analysis v3.26.0](https://github.com/ZhuLinsen/daily_stock_analysis) 二开，感谢原作者 [ZhuLinsen](https://github.com/ZhuLinsen)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)

> 🤖 基于 AI 大模型的 A 股智能量化分析系统，每日自动分析选股并生成「决策仪表盘」报告。支持飞书/企业微信/Telegram/Discord/Slack/邮件多渠道推送。

[**快速开始**](#-快速开始) · [**配置说明**](#-配置说明) · [**Web 界面**](#-web-界面) · [**Agent 策略问股**](#-agent-策略问股)

简体中文 | [English](docs/README_EN.md) | [繁體中文](docs/README_CHT.md)

---

## ✨ 功能特性

| 能力 | 覆盖内容 |
|------|------|
| AI 决策报告 | 核心结论、评分、趋势、买卖点位、风险警报、催化因素、操作检查清单 |
| 多市场数据 | A 股/港股/美股/日股/韩股/台股/ETF，行情 / K 线 / 技术指标 / 新闻 / 公告 / 基本面 |
| Web 工作台 | 手动分析、历史报告、完整 Markdown、回测、持仓管理、浅色/深色主题 |
| Agent 策略问股 | 多轮追问，15 种内置策略（均线/缠论/波浪/热点/事件/成长等），Web/Bot/API |
| 定时推送 | GitHub Actions / Docker / 本地定时 / FastAPI 服务 + 多渠道通知 |
| 智能导入 | 图片 / CSV / Excel / 剪贴板导入，代码/名称/拼音/别名补全 |

### 技术栈与数据来源

| 类型 | 支持 |
|------|------|
| AI 模型 | OpenAI 兼容接口（硅基流动/DeepSeek/通义千问等）、Gemini、Claude、Anspire、本地 Ollama |
| 行情数据 | AkShare、Baostock、YFinance（默认免费）；Tushare、Longbridge（可选稳定源） |
| 新闻搜索 | Anspire、SerpAPI、Tavily、Bocha、Brave、MiniMax、SearXNG |

> 项目默认内置 AkShare / Baostock / YFinance 等免费行情源，零配置可运行。

---

## 🚀 快速开始

### 本地运行

```bash
# 克隆项目
git clone git@github.com:FallingSummer/RuyiDaily.git
cd RuyiDaily

# 创建虚拟环境 + 安装依赖
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt

# 配置 LLM（本项目使用硅基流动渠道模式）
cp .env.example .env
# 编辑 .env 填入你的硅基流动 API Key：
#   LLM_SILICONFLOW_API_KEY=sk-xxxxxxxx
#   LLM_SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1

# 运行单股分析
python main.py --stocks 600519

# 启动 Web 服务
python main.py --serve-only
```

常用命令：

```bash
python main.py --debug                   # 调试模式
python main.py --dry-run                 # 空跑（不调用 LLM）
python main.py --stocks 600519,000858    # 指定多只股票
python main.py --market-review           # 大盘复盘
python main.py --schedule                # 定时模式
python main.py --serve-only              # 仅 Web 服务（http://127.0.0.1:8000）
```

---

## ⚙️ 配置说明

### LLM 配置（渠道模式）

本项目默认使用**渠道模式**配置大模型，通过 `LLM_SILICONFLOW_*` 前缀指定硅基流动接口。支持所有 OpenAI 兼容服务。

| 环境变量 | 说明 |
|---------|------|
| `LLM_SILICONFLOW_API_KEY` | 硅基流动 API Key |
| `LLM_SILICONFLOW_BASE_URL` | API 地址（默认 `https://api.siliconflow.cn/v1`） |
| `LITELLM_MODEL` | 模型名（默认 `openai/Qwen/Qwen2.5-14B-Instruct`） |

详细配置参考 `docs/LLM_CONFIG_GUIDE.md`。

### Key 测试

```bash
.venv\Scripts\python.exe scripts/run/check_api_key.py
```

---

## 🖥️ Web 界面

启动后访问 `http://127.0.0.1:8000`：

- 📊 首页仪表盘 — 选股分析 + 大盘复盘
- 📝 历史报告 — 完整 Markdown 浏览/复制/导出
- 🤖 Agent 问股 — 15 种策略的多轮对话分析
- 📈 回测 — 策略历史回测验证
- 💼 持仓管理 — 组合风险 + 交易记录
- ⚙️ 系统设置 — LLM / 数据源 / 通知配置

---

## 🤖 Agent 策略问股

`/chat` 页面支持以下内置策略，配置 LLM Key 即可使用：

均线金叉、缠论、波浪理论、多头趋势、箱体震荡、底部放量、涨停板、筹码集中、热点题材、事件驱动、成长质量、预期重估、缩量回调、一阳三阴、情绪周期

---

## 📱 推送效果

```
🎯 如意金股 决策仪表盘
📊 贵州茅台(600519): 观望 | 评分 72 | 看多
🔴 五粮液(000858): 卖出 | 评分 38 | 看空

📈 大盘复盘
上证指数: 3250.12 (+0.85%) | 上涨: 3920 | 下跌: 1349
领涨: 互联网服务 | 领跌: 保险
```

---

## 🐳 Docker 部署

```bash
docker-compose up -d
```

---

## 📄 协议

[MIT License](LICENSE) © 2026 fufu  
上游项目 [daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) © ZhuLinsen

二次开发请注明来源。

## ⚠️ 免责声明

本项目仅供学习和研究使用，不构成任何投资建议。股市有风险，投资需谨慎。