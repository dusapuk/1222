#!/usr/bin/env python3
"""Generate hero images for each category via pollinations.ai (Flux model).

Outputs JPEG files to public/images/categories/<slug>.jpg.
The JS UI overlays the localized category title on top, so the images are
prompted to contain NO text — they only carry vibes / iconography.
"""
from __future__ import annotations

import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "categories"
OUT.mkdir(parents=True, exist_ok=True)

# (slug, prompt, color-anchor for cohesion in editor's mind)
CATEGORIES: list[tuple[str, str]] = [
    (
        "ai-assistants",
        "futuristic AI chatbot interface, glowing neural network, holographic conversation bubbles, "
        "deep navy and electric purple, cinematic 3d render, no text, no letters",
    ),
    (
        "ai-image",
        "artistic AI image generation, vibrant abstract painting bursting from a canvas, "
        "fluid magenta orange teal pigment, dramatic lighting, premium 3d render, no text, no letters",
    ),
    (
        "ai-video",
        "AI video creation studio, ribbons of cinematic film unrolling, neon motion blur, "
        "rich red and blue spotlight, dark scene, premium 3d render, no text, no letters",
    ),
    (
        "ai-voice-music",
        "AI voice and music synthesis, glowing waveform ribbons around a sleek microphone, "
        "deep teal and electric green, cinematic studio lighting, premium 3d render, no text, no letters",
    ),
    (
        "ai-writing-seo",
        "AI writing assistant, futuristic glowing keyboard with floating golden words, "
        "warm amber and indigo lighting, premium 3d render, no text, no letters",
    ),
    (
        "developer-tools",
        "developer workspace, glowing terminal screens with abstract code lines, "
        "deep blue and emerald, neon highlights, cinematic 3d render, no text, no letters",
    ),
    (
        "design-creative",
        "graphic design studio, splashes of paint, color palette and creative tools, "
        "vivid pink yellow purple, premium 3d render, no text, no letters",
    ),
    (
        "productivity-work",
        "modern productivity desk, sleek laptop with glowing icons floating around, "
        "warm caramel and steel blue, soft cinematic light, premium 3d render, no text, no letters",
    ),
    (
        "streaming",
        "cinematic streaming entertainment, theatre seats with red velvet, neon film reel and popcorn, "
        "warm crimson and gold, premium 3d render, no text, no letters",
    ),
    (
        "music",
        "music streaming, glowing vinyl record floating above headphones, "
        "vibrant violet and cyan, neon studio lighting, premium 3d render, no text, no letters",
    ),
    (
        "education",
        "online education concept, stack of glowing books with a holographic lightbulb, "
        "warm gold and royal blue, premium 3d render, no text, no letters",
    ),
    (
        "cloud-storage",
        "cloud computing, luminous floating clouds with abstract data streams and servers, "
        "icy cyan and deep indigo, premium 3d render, no text, no letters",
    ),
    (
        "social-communication",
        "social network communication, glowing nodes connected with light beams, "
        "vivid pink and electric blue, cinematic 3d render, no text, no letters",
    ),
    (
        "business-marketing",
        "business marketing analytics, ascending neon graph bars and a sleek briefcase, "
        "rich emerald and gold, premium 3d render, no text, no letters",
    ),
]


WIDTH = 1024
HEIGHT = 768
MODEL = "flux"
NOLOGO = "true"
ENHANCE = "false"
TIMEOUT = 240


def url_for(prompt: str, seed: int) -> str:
    encoded = urllib.parse.quote(prompt, safe="")
    return (
        f"https://image.pollinations.ai/prompt/{encoded}"
        f"?width={WIDTH}&height={HEIGHT}&seed={seed}&model={MODEL}"
        f"&nologo={NOLOGO}&enhance={ENHANCE}"
    )


def download(url: str, dest: Path) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        data = resp.read()
    dest.write_bytes(data)
    return len(data)


def main() -> int:
    seed_base = 4242
    failures: list[str] = []
    for i, (slug, prompt) in enumerate(CATEGORIES):
        dest = OUT / f"{slug}.jpg"
        if dest.exists() and dest.stat().st_size > 5_000:
            print(f"[skip] {slug}.jpg already exists ({dest.stat().st_size} bytes)")
            continue
        seed = seed_base + i * 17
        url = url_for(prompt, seed)
        print(f"[{i + 1:>2}/{len(CATEGORIES)}] {slug:24} seed={seed}")
        for attempt in range(1, 4):
            try:
                size = download(url, dest)
                print(f"        -> {size:>7} bytes (attempt {attempt})")
                if size < 3_000:
                    raise RuntimeError(f"too small: {size}")
                break
            except Exception as exc:
                print(f"        ! attempt {attempt} failed: {exc}", file=sys.stderr)
                time.sleep(5 * attempt)
                if attempt == 3:
                    failures.append(slug)
        time.sleep(1.5)

    if failures:
        print("FAILED:", ", ".join(failures), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
