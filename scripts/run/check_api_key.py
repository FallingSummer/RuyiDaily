#!/usr/bin/env python3
"""
检查硅基流动（SiliconFlow）API Key 是否可用。

用途：测试 key.txt 中的 API Key 能否正常调用硅基流动的模型。
支持两种方式：
  1) python scripts/run/check_api_key.py [--model MODEL]
     — 自动从项目根目录的 key.txt 读取 key
  2) python scripts/run/check_api_key.py --key YOUR_KEY [--model MODEL]
     — 显式传入 key

默认测试模型：Qwen/Qwen2.5-7B-Instruct（便宜、速度快）
"""

import argparse
import json
import os
import sys
from pathlib import Path


def get_project_root() -> Path:
    """从脚本路径向上查找项目根目录（包含 key.txt 的目录）。"""
    script = Path(__file__).resolve()
    for parent in [script] + list(script.parents):
        if (parent / "key.txt").exists():
            return parent
        # 也检查 AGENTS.md 标志
        if (parent / "AGENTS.md").exists() and (parent / "main.py").exists():
            return parent
    # fallback: 当前目录往上 3 层
    return script.parents[1]


def read_key(key_path: Path) -> str:
    """读取 key 文件，去掉首尾空白。"""
    content = key_path.read_text(encoding="utf-8").strip()
    if not content:
        print(f"❌ {key_path} 文件内容为空", file=sys.stderr)
        sys.exit(1)
    return content


def test_key(api_key: str, model: str) -> None:
    """
    用 OpenAI 兼容客户端测试 API Key。
    发送一条短消息，检查是否返回有效响应。
    """
    base_url = "https://api.siliconflow.cn/v1"

    try:
        from openai import OpenAI
    except ImportError:
        print("❌ 依赖缺失：请先安装 openai 包", file=sys.stderr)
        print("   pip install openai", file=sys.stderr)
        sys.exit(1)

    client = OpenAI(api_key=api_key, base_url=base_url)

    print(f"🔌 测试端点: {base_url}")
    print(f"🤖 测试模型: {model}")
    print()

    # 1. 先列出模型列表（验证 key 是否有基本权限）
    print("📋 步骤 1/2: 列举可用模型（验证 key 权限）...", end=" ", flush=True)
    try:
        models = client.models.list()
        model_ids = [m.id for m in models]
        print(f"✅ 成功 (共 {len(model_ids)} 个模型)")
    except Exception as e:
        print(f"❌ 失败: {e}", file=sys.stderr)
        # 不直接退出——某些 key 可能没有 models.list 权限但能对话
        print("   ⚠️  继续尝试对话测试...")
        model_ids = []

    # 2. 发一条简单对话
    print("📋 步骤 2/2: 发送测试对话...", end=" ", flush=True)
    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "你是一个助手。请用一句话回答。"},
                {"role": "user", "content": "回复OK表示你活着"},
            ],
            max_tokens=20,
            temperature=0,
        )
        reply = resp.choices[0].message.content.strip()
        print(f"✅ 成功")
        print(f"   💬 回复: {reply}")
        print()
        print(f"   📊 Token 用量: {resp.usage.total_tokens if resp.usage else '未知'}")
        print(f"   🆔 模型: {resp.model}")
        print()
        print("✅✅✅ API Key 可用！")
    except Exception as e:
        print(f"❌ 失败", file=sys.stderr)
        error_msg = str(e)
        print(f"   错误: {error_msg}", file=sys.stderr)

        # 常见错误诊断
        if "401" in error_msg or "Unauthorized" in error_msg or "Authentication" in error_msg:
            print()
            print("🔴 诊断: API Key 无效或已过期", file=sys.stderr)
            print("   请检查 key.txt 的内容是否正确", file=sys.stderr)
        elif "429" in error_msg or "quota" in error_msg.lower() or "insufficient" in error_msg.lower():
            print()
            print("🟡 诊断: API Key 有效但余额不足或触发速率限制", file=sys.stderr)
        elif "model_not_found" in error_msg or "not found" in error_msg.lower():
            print(f"\n🟡 诊断: 模型 '{model}' 不可用，可能名称不对或已被弃用", file=sys.stderr)
        else:
            print(f"\n🟡 诊断: 未知错误，可能是网络问题或服务端问题", file=sys.stderr)

        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="测试硅基流动 API Key 是否可用",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    key_group = parser.add_mutually_exclusive_group()
    key_group.add_argument(
        "--key",
        help="直接传入 API Key（不指定则从项目根目录 key.txt 读取）",
    )
    key_group.add_argument(
        "--key-file",
        help="指定 key 文件路径（默认项目根目录 key.txt）",
    )
    parser.add_argument(
        "--model",
        default="Qwen/Qwen2.5-7B-Instruct",
        help="测试用的模型名（默认 Qwen/Qwen2.5-7B-Instruct）",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="输出详细信息（包括模型列表）",
    )

    args = parser.parse_args()

    # 获取 API Key
    if args.key:
        api_key = args.key
        key_source = "命令行参数"
    elif args.key_file:
        api_key = read_key(Path(args.key_file))
        key_source = f"文件 {args.key_file}"
    else:
        project_root = get_project_root()
        key_path = project_root / "key.txt"
        if not key_path.exists():
            print(f"❌ key.txt 不存在于项目根目录: {project_root}", file=sys.stderr)
            print("   请将硅基流动的 API Key 放入 key.txt，或使用 --key 参数", file=sys.stderr)
            sys.exit(1)
        api_key = read_key(key_path)
        key_source = f"文件 {key_path}"

    masked_key = api_key[:8] + "..." + api_key[-4:] if len(api_key) > 12 else api_key[:4] + "..."
    print(f"🔑 API Key 来源: {key_source}")
    print(f"🔑 Key (脱敏):  {masked_key}")
    print()

    test_key(api_key, args.model)


if __name__ == "__main__":
    main()