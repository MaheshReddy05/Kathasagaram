"use client";

import { MotionConfig } from "motion/react";
import { AudioProvider } from "@/components/audio/AudioProvider";
import type { AudioTrack } from "@/data/types";

export function Providers({ catalog, children }: { catalog: AudioTrack[]; children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AudioProvider catalog={catalog}>{children}</AudioProvider>
    </MotionConfig>
  );
}
