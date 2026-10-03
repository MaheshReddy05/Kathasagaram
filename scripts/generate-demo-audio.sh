#!/usr/bin/env bash
# Generates the PLACEHOLDER audio used by the demo player: a synthesised
# tanpura-style drone (no narration). Real narration files should replace
# these — see src/data/audio.ts. Requires ffmpeg with libmp3lame.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/audio/demo

drone() { # base-frequency output-file
  local S=$1 out=$2 P=4
  # Four plucked strings (Pa, Sa', Sa', low Sa) cycling every ${P}s, each a
  # small harmonic stack with an exponential decay envelope.
  local str='(sin(2*PI*FREQ*t)+0.5*sin(4*PI*FREQ*t)+0.33*sin(6*PI*FREQ*t)+0.22*sin(8*PI*FREQ*t)+0.12*sin(10*PI*FREQ*t))*exp(-0.9*mod(t-OFFS+PER,PER))'
  local expr=""
  for pair in "0.75:0" "2:1" "2:2" "1:3"; do
    local mul=${pair%%:*} off=${pair##*:}
    local s=${str//FREQ/($S*$mul)}; s=${s//OFFS/$off}; s=${s//PER/$P}
    expr="${expr:+$expr+}$s"
  done
  ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.22*($expr)':s=44100:d=150" \
    -af "aecho=0.8:0.7:60|140:0.35|0.22,lowpass=f=3200,afade=t=in:d=3,afade=t=out:st=144:d=6" \
    -ac 1 -codec:a libmp3lame -b:a 64k "$out"
  echo "  $out"
}

drone 130.81 public/audio/demo/ambient-en.mp3
drone 146.83 public/audio/demo/ambient-te.mp3
