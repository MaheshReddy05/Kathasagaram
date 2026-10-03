"use client";

import { useEffect } from "react";
import { library, type RecentEntry } from "@/lib/storage";

/** Records a visit for the Library's "Recently viewed". Renders nothing. */
export function TrackVisit({ kind, slug }: { kind: RecentEntry["kind"]; slug: string }) {
  useEffect(() => {
    library.recordVisit(kind, slug);
  }, [kind, slug]);
  return null;
}
