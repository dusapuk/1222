#!/usr/bin/env python3
"""Generate homepage hero + trust-strip background images via pollinations.ai.

Outputs JPEG files to public/images/home/*.jpg.
Persian text is overlaid by the React UI (HTML), so the prompts force NO text
in the generated images (AI generators consistently butcher Persian/Arabic
glyphs).
"""
from __future__ import annotations

import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "home"
OUT.mkdir(parents=True, exist_ok=True)

# Cohesive editorial / cinematic style appended to every prompt.
BASE_STYLE = (
    "editorial product photography, premium magazine cover, muted color grading, "
    "low-key cinematic lighting, shallow depth of field, photorealistic, "
    "minimalist composition, fine grain, soft shadows, dark moody background, "
    "no people, no faces, no text, no letters, no logos, no watermark"
)

# (filename_stem, width, height, subject prompt)
ITEMS: list[tuple[str, int, int, str]] = [
    # Hero — premium international subscriptions vibe. Wide 16/7 banner.
    (
        "hero-premium",
        1600,
        720,
        "minimalist still life of golden gift card, sleek black smartphone with glowing "
        "violet screen and a brass key on dark marble, single warm gold spotlight from the "
        "left, soft purple rim light from the right, deep midnight backdrop, premium "
        "concierge / digital subscription mood",
    ),
]


MODEL = "flux"
TIMEOUT = 240
NOLOGO = "true"
ENHANCE = "false"
SEED_BASE = 9521


def url_for(prompt: str, width: int, height: int, seed: int) -> str:
    encoded = urllib.parse.quote(prompt, safe="")
    return (
        f"https://image.pollinations.ai/prompt/{encoded}"
        f"?width={width}&height={height}&seed={seed}&model={MODEL}"
        f"&nologo={NOLOGO}&enhance={ENHANCE}"
    )


def download(url: str, dest: Path) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        data = resp.read()
    dest.write_bytes(data)
    return len(data)


def main() -> int:
    failures: list[str] = []
    for i, (stem, w, h, subject) in enumerate(ITEMS):
        prompt = f"{subject}. {BASE_STYLE}"
        seed = SEED_BASE + i
        url = url_for(prompt, w, h, seed)
        dest = OUT / f"{stem}.jpg"
        print(f"[{i+1}/{len(ITEMS)}] {stem} -> {dest.name} (seed={seed}) ...", flush=True)
        try:
            size = download(url, dest)
            print(f"   ok, {size:,} bytes", flush=True)
        except Exception as e:  # noqa: BLE001
            print(f"   FAILED: {e}", flush=True)
            failures.append(stem)

    if failures:
        print(f"\nFailed: {failures}", flush=True)
        return 1
    print("\nAll homepage images generated.", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
