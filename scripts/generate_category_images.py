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

# Editorial / professional product-photography style. Muted palettes,
# low-key lighting, shallow depth of field, no AI-paint-splash look.
# A common style modifier is appended to every prompt to keep cohesion.
BASE_STYLE = (
    "editorial product photography, premium magazine cover, muted color grading, "
    "low-key cinematic lighting, shallow depth of field, photorealistic, "
    "minimalist composition, fine grain, soft shadows, dark moody background, "
    "no people, no faces, no text, no letters, no logos, no watermark"
)

# (slug, subject prompt — style modifier is appended automatically)
CATEGORIES: list[tuple[str, str]] = [
    (
        "ai-assistants",
        "abstract glass orb resting on matte dark stone, faint indigo and slate light, "
        "subtle wireframe reflections, restrained sci-fi still life",
    ),
    (
        "ai-image",
        "single dry brush trailing burgundy pigment across textured cotton paper, "
        "restrained crimson and warm ivory tones, top-down studio shot",
    ),
    (
        "ai-video",
        "vintage 35mm film reel and prime lens on charcoal table, deep amber tungsten key light, "
        "soft red accent, archival cinematography mood",
    ),
    (
        "ai-voice-music",
        "studio condenser microphone on a dark stand, faint teal rim light, "
        "atmospheric haze, recording booth at night",
    ),
    (
        "ai-writing-seo",
        "open leather notebook and brass fountain pen on dark walnut desk, single warm desk lamp, "
        "subtle golden glow, editorial flat lay",
    ),
    (
        "developer-tools",
        "single dark monitor with faint abstract code reflections, mechanical keyboard, "
        "minimalist desk, ambient deep blue light, late-night office",
    ),
    (
        "design-creative",
        "calm studio still life of paper color swatches, drafting tools and sketchbook, "
        "muted dusty pink and bone white, soft daylight, top-down composition",
    ),
    (
        "productivity-work",
        "clean modern desk with slim laptop slightly open, ceramic mug and a small plant, "
        "muted steel blue and warm oak, gentle morning side light",
    ),
    (
        "streaming",
        "empty cinema auditorium with deep red velvet seats, single soft spotlight on a row, "
        "low-key warm crimson and amber, anamorphic still",
    ),
    (
        "music",
        "matte black vinyl record on a turntable platter with leather headphones beside it, "
        "low ambient violet and bronze light, atmospheric studio mood",
    ),
    (
        "education",
        "stack of weathered hardcover books with a brass reading lamp casting warm gold pool, "
        "dark academia desk, subtle indigo shadows",
    ),
    (
        "cloud-storage",
        "minimalist server-room corridor at night, geometric blue led strips, gentle cyan haze, "
        "long perspective, architectural photography",
    ),
    (
        "social-communication",
        "long-exposure light trails forming a soft network of intersecting lines on dark glass, "
        "restrained dusk pink and steel blue, abstract studio shot",
    ),
    (
        "business-marketing",
        "minimalist desk flat lay with leather briefcase, paper bar chart and a fountain pen, "
        "deep emerald and warm cream tones, soft directional light",
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
    # Bumped from 4242 to avoid pollinations seed-cache collision with the
    # previous (more-saturated) prompts.
    seed_base = 8821
    failures: list[str] = []
    for i, (slug, subject) in enumerate(CATEGORIES):
        dest = OUT / f"{slug}.jpg"
        if dest.exists() and dest.stat().st_size > 5_000:
            print(f"[skip] {slug}.jpg already exists ({dest.stat().st_size} bytes)")
            continue
        seed = seed_base + i * 17
        prompt = f"{subject}, {BASE_STYLE}"
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
