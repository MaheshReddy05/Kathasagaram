#!/usr/bin/env bash
# Derives the web artwork in public/images from the source art in design/source.
# Requires ImageMagick (`convert`). Re-run after replacing any source image.
#
# Most story images are CROPS of the two Karna source images and are stand-ins
# until dedicated story illustrations exist. Replace the files in public/images
# directly (same filename) or edit src/data/assets.ts to point elsewhere.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=design/source
OUT=public/images
mkdir -p "$OUT/brand" "$OUT/karna" "$OUT/stories"

HERO="$SRC/karna-hero.png"            # 1672x941 landscape
SHEET="$SRC/karna-character-sheet.png" # 1536x1024 character sheet
LOGO="$SRC/kathasagaram-logo.png"      # 1536x1024 logo

crop() { # src geometry out [resize]
  local resize="${4:-}"
  if [[ -n "$resize" ]]; then
    convert "$1" -crop "$2" +repage -resize "$resize" -quality 82 "$3"
  else
    convert "$1" -crop "$2" +repage -quality 82 "$3"
  fi
  echo "  $3 ($(identify -format '%wx%h' "$3"))"
}

echo "Brand"
crop "$LOGO" 1536x1024+0+0     "$OUT/brand/logo-full.webp" 1200x
crop "$LOGO" 760x560+388+70    "$OUT/brand/logo-mark.webp" 480x
convert "$LOGO" -crop 560x560+488+60 +repage -resize 512x512 "public/icon-512.png"
convert "$LOGO" -crop 560x560+488+60 +repage -resize 180x180 "src/app/apple-icon.png"
convert "$LOGO" -crop 560x560+488+60 +repage -resize 64x64 "src/app/icon.png"

echo "Karna"
crop "$HERO"  1672x941+0+0      "$OUT/karna/hero.webp"
crop "$SHEET" 405x700+250+0     "$OUT/karna/portrait.webp"
crop "$SHEET" 250x640+652+8     "$OUT/karna/full-figure.webp"
crop "$SHEET" 236x220+1298+4    "$OUT/karna/face-front.webp"
crop "$SHEET" 236x200+1298+250  "$OUT/karna/face-three-quarter.webp"
crop "$SHEET" 236x210+1298+468  "$OUT/karna/face-profile.webp"
crop "$SHEET" 322x222+26+708    "$OUT/karna/kavacha.webp"
crop "$SHEET" 222x222+368+708   "$OUT/karna/kundala.webp"
crop "$SHEET" 236x222+610+708   "$OUT/karna/bow.webp"

echo "Stories (stand-in crops)"
crop "$HERO"  420x520+1252+40   "$OUT/stories/birth-of-karna.webp"
crop "$HERO"  760x470+0+470     "$OUT/stories/child-found-on-the-river.webp"
crop "$HERO"  860x560+0+150     "$OUT/stories/search-for-a-teacher.webp"
crop "$HERO"  520x330+330+470   "$OUT/stories/the-tournament.webp"
crop "$SHEET" 250x340+652+8     "$OUT/stories/friendship-with-duryodhana.webp"
crop "$SHEET" 236x222+610+708   "$OUT/stories/karna-and-parashurama.webp"
crop "$SHEET" 322x222+26+708    "$OUT/stories/kavacha-and-kundala.webp"
crop "$SHEET" 236x200+1298+250  "$OUT/stories/kunti-meets-karna.webp"
crop "$HERO"  760x620+820+0     "$OUT/stories/karna-and-arjuna.webp"
crop "$HERO"  300x340+1372+520  "$OUT/stories/the-final-battle.webp"
