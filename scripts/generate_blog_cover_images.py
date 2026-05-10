#!/usr/bin/env python3
"""Generate unique cover images for each blog post via pollinations.ai (Flux).

Outputs JPEG files to public/images/blog/<slug>.jpg (1280×720, 16:9).
The HTML/UI overlays the Persian H1 on top, so we ask Flux for NO text.
Each prompt is brand-aware (ChatGPT → glass orb + violet glow,
Midjourney → brushes + pigment, etc.) so every blog post gets a
visually distinct hero — solving the audit gap «14 unique covers
shared across 45 posts».

Usage:
    python3 scripts/generate_blog_cover_images.py             # generate all
    python3 scripts/generate_blog_cover_images.py <slug> ...  # subset
    PIKART_BLOG_COVERS_FORCE=1 python3 scripts/generate_blog_cover_images.py
        # overwrite existing files (default: skip).
"""
from __future__ import annotations

import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "blog"
OUT.mkdir(parents=True, exist_ok=True)

# Cohesive editorial / cinematic style appended to every prompt.
BASE_STYLE = (
    "editorial product photography, premium magazine cover, muted color grading, "
    "low-key cinematic lighting, shallow depth of field, photorealistic, "
    "minimalist composition, fine grain, soft shadows, dark moody background, "
    "no people, no faces, no text, no letters, no logos, no watermark, "
    "16:9 aspect, hero banner composition"
)

# (slug, subject prompt — style modifier is appended automatically)
ITEMS: list[tuple[str, str]] = [
    # ---- AI assistants ----
    (
        "buy-chatgpt-plus-iran",
        "single translucent glass orb glowing softly violet on black brushed metal desk, "
        "thin streams of pale light arcing through it, minimalist sci-fi conversation interface mood",
    ),
    (
        "buy-claude-pro-iran",
        "open hardback book and a single white feather quill on warm charcoal stone, "
        "subtle amber rim light, calm scholarly atmosphere, thoughtful reasoning mood",
    ),
    (
        "buy-gemini-advanced-iran",
        "twin polished gemstones (one cool blue, one warm gold) catching split light "
        "on dark slate, geometric reflections, dual-modality intelligence mood",
    ),
    (
        "buy-perplexity-iran",
        "vintage brass magnifying glass over folded papers and a compass on dark walnut, "
        "single warm desk lamp, deep teal background, research and discovery mood",
    ),
    # ---- AI image generation ----
    (
        "buy-midjourney-iran",
        "single dry sable brush trailing burgundy and indigo pigment across textured cotton paper, "
        "studio top-down composition, dim violet ambient light, fine art generation mood",
    ),
    (
        "buy-nightcafe-iran",
        "small empty cafe at night with warm pendant light over a marble table, "
        "an open sketchbook with abstract pigment streaks, dreamy painterly mood",
    ),
    (
        "buy-leonardo-iran",
        "renaissance bronze drafting compass and rolled vellum on dark walnut, "
        "single tungsten lamp glow, deep umber palette, classical art studio mood",
    ),
    (
        "buy-ideogram-iran",
        "set of geometric stencils, brass type slugs and ink pots on charcoal slate, "
        "deep sienna ambient, typographic precision mood",
    ),
    (
        "buy-dreamina-iran",
        "translucent silk ribbons floating in soft pink and lavender mist over dark velvet, "
        "ethereal bokeh, dream-state image generation mood",
    ),
    (
        "buy-visual-electric-iran",
        "single neon-blue light filament in a clear tube on dark concrete, "
        "subtle electric haze, modern UI-design rendering mood",
    ),
    (
        "buy-adobe-firefly-iran",
        "scarlet ember curling over black anvil with faint gold sparks, "
        "deep crimson and gold palette, generative spark mood",
    ),
    # ---- AI video ----
    (
        "buy-pika-iran",
        "vintage 16mm film reel, single clapperboard slate and lens on midnight desk, "
        "deep teal rim light, indie filmmaking automation mood",
    ),
    (
        "buy-autoshorts-ai-iran",
        "stack of polaroid frames slowly fanning out on a dark linen tablecloth, "
        "single soft top light, short-form storytelling mood",
    ),
    # ---- AI voice & music ----
    (
        "buy-suno-iran",
        "matte black studio condenser microphone on chrome arm above an audio waveform print, "
        "deep navy ambient, music generation mood",
    ),
    (
        "buy-elevenlabs-iran",
        "single brass tuning fork resting on velvet beside a silver microphone capsule, "
        "warm amber rim light, voice cloning studio mood",
    ),
    (
        "buy-easymusic-iran",
        "open piano sheet music with a fountain pen on top, soft warm desk lamp, "
        "deep oak and cream palette, songwriting workflow mood",
    ),
    (
        "buy-ilovesong-iran",
        "single vinyl record half pulled from cream sleeve under one warm spotlight, "
        "deep crimson and gold palette, romantic music gift mood",
    ),
    # ---- AI writing & SEO ----
    (
        "buy-quillbot-iran",
        "single white feather quill resting on parchment with brass inkwell, "
        "warm desk lamp, deep navy backdrop, paraphrasing and editing mood",
    ),
    (
        "buy-deepl-iran",
        "two open dictionaries (one English, one neutral) on dark walnut with bookmark ribbons, "
        "soft cool side light, precision translation mood",
    ),
    (
        "buy-prowritingaid-iran",
        "fountain pen lying across a typed manuscript with red editor marks, deep claret ambient, "
        "professional copy-editing mood",
    ),
    (
        "buy-surfer-seo-iran",
        "single chrome compass on a topographic map with rising swell shapes printed in cyan, "
        "deep indigo backdrop, SEO content navigation mood",
    ),
    (
        "buy-rephrasy-iran",
        "scrambled wooden letter tiles slowly forming a new word on dark felt, single warm spotlight, "
        "rewriting and humanising AI text mood",
    ),
    # ---- Developer tools / Productivity / Cloud ----
    (
        "buy-jetbrains-iran",
        "modern dark monitor with abstract neon-pink and orange code reflections beside mechanical "
        "keyboard, deep slate ambient, professional IDE mood",
    ),
    (
        "buy-pluralsight-iran",
        "stack of leather-bound technical manuals beside a steaming espresso mug under one warm lamp, "
        "deep oak palette, focused self-study mood",
    ),
    (
        "buy-dr-fone-iran",
        "open silver smartphone repair toolkit on dark felt with magnetic screwdrivers and a phone "
        "shell, single cool top light, mobile recovery mood",
    ),
    (
        "buy-rosetta-stone-iran",
        "carved stone tablet with abstract glyphs catching warm side light over dark slate, "
        "deep ochre palette, language mastery mood",
    ),
    (
        "buy-magoosh-iran",
        "open standardized test prep book and a sharpened pencil with a small hourglass on dark "
        "walnut, deep navy ambient, exam preparation mood",
    ),
    (
        "buy-lingq-iran",
        "open multilingual book with several silk ribbon bookmarks and a soft amber reading lamp, "
        "deep burgundy palette, immersive reading mood",
    ),
    (
        "buy-icloud-iran",
        "single brushed-aluminium server token shape on dark glass with faint mint glow, "
        "soft cyan rim light, secure cloud storage mood",
    ),
    (
        "buy-proton-iran",
        "matte black hex-key and a tiny brass padlock on dark stone, single cool moonlight, "
        "deep navy ambient, privacy and encryption mood",
    ),
    (
        "buy-dropbox-plus-iran",
        "single corrugated paper folder with a tiny linen ribbon on dark teak desk, soft daylight, "
        "muted blue palette, file storage workflow mood",
    ),
    (
        "buy-shutterstock-iran",
        "stack of glossy contact sheets and a vintage 50mm prime lens on charcoal stone, "
        "single soft daylight, stock photo licensing mood",
    ),
    (
        "buy-flexclip-iran",
        "vintage editing slate and reel of magnetic tape on dark walnut, single warm key light, "
        "muted teal palette, simple video editing mood",
    ),
    (
        "buy-hitpaw-iran",
        "single matte aluminium switchblade-style multi-tool on dark slate, faint lime rim light, "
        "deep charcoal ambient, all-in-one toolkit mood",
    ),
    (
        "buy-talkingavatar-iran",
        "smooth porcelain mannequin head silhouette catching one violet rim light on black, "
        "subtle holographic shimmer, AI avatar mood",
    ),
    (
        "buy-homestyler-iran",
        "miniature architect's drafting table with brass scale rule and folded blueprint, single "
        "warm desk lamp, deep teal ambient, interior design mood",
    ),
    (
        "buy-ajelix-iran",
        "single open spreadsheet ledger printed on cream paper with a silver fountain pen on top, "
        "deep slate ambient, business automation mood",
    ),
    # ---- Design & creative ----
    (
        "buy-canva-pro-iran",
        "calm flat lay of bone-white paper swatches, brass paperclips and pastel ink pots on dark "
        "walnut, soft daylight, social-media design mood",
    ),
    (
        "buy-adobe-creative-cloud-iran",
        "single Wacom-style stylus angled across a thick dark glossy paper with subtle red and "
        "orange brush trails, deep sienna palette, professional design suite mood",
    ),
    # ---- Music & streaming ----
    (
        "buy-apple-music-iran",
        "minimalist matte white over-ear headphones lying flat on dark slate beside a brushed "
        "aluminium dial, soft warm side light, premium music streaming mood",
    ),
    (
        "buy-hbo-iran",
        "empty cinema row of velvet red seats fading into shadow, single soft warm spotlight, "
        "deep crimson palette, prestige drama streaming mood",
    ),
    (
        "buy-crunchyroll-iran",
        "stack of glossy hardcover manga-style sketchbooks beside a metal ruler and gel pen on "
        "dark walnut, deep amber rim light, anime culture mood",
    ),
    # ---- Education / Business / Misc ----
    (
        "buy-duolingo-super-iran",
        "single small linen-bound vocabulary notebook with paper flag bookmark and brass mechanical "
        "pencil on dark felt, soft warm key light, daily language learning mood",
    ),
    (
        "buy-babbel-iran",
        "open phrasebook with handwritten margin notes and a brass coffee press on dark walnut, "
        "single warm side light, conversational language mood",
    ),
    (
        "buy-linkedin-premium-iran",
        "single brushed steel business card holder and folded crisp navy linen pocket square on "
        "dark stone, soft cool daylight, professional networking mood",
    ),
]


MODEL = "flux"
TIMEOUT = 240
NOLOGO = "true"
ENHANCE = "false"
SEED_BASE = 11211
WIDTH = 1280
HEIGHT = 720


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
    args = set(sys.argv[1:])
    force = bool(os.environ.get("PIKART_BLOG_COVERS_FORCE"))
    failures: list[str] = []
    work = [it for it in ITEMS if (not args) or (it[0] in args)]
    if args:
        unknown = args - {it[0] for it in ITEMS}
        if unknown:
            print(f"Unknown slugs (skipped): {sorted(unknown)}", flush=True)
    for i, (slug, subject) in enumerate(work):
        dest = OUT / f"{slug}.jpg"
        if dest.exists() and not force:
            print(f"[{i+1}/{len(work)}] {slug} -> exists, skipping", flush=True)
            continue
        prompt = f"{subject}. {BASE_STYLE}"
        seed = SEED_BASE + i
        url = url_for(prompt, WIDTH, HEIGHT, seed)
        print(f"[{i+1}/{len(work)}] {slug} (seed={seed}) ...", flush=True)
        try:
            size = download(url, dest)
            print(f"   ok, {size:,} bytes", flush=True)
        except Exception as e:  # noqa: BLE001
            print(f"   FAILED: {e}", flush=True)
            failures.append(slug)
        time.sleep(0.4)

    if failures:
        print(f"\nFailed: {failures}", flush=True)
        return 1
    print(f"\nAll blog cover images present in {OUT}.", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
