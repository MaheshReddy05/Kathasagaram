"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULTS, read, subscribe, type Key, type Schema } from "./storage";

/** Subscribe a component to one key of the local library store. */
export function useLibrary<K extends Key>(key: K): Schema[K] {
  const sub = useCallback((cb: () => void) => subscribe(key, cb), [key]);
  return useSyncExternalStore(
    sub,
    () => read(key),
    () => DEFAULTS[key],
  );
}

const noop = () => () => {};

/**
 * False during SSR and hydration, true afterwards. Use it to avoid flashing
 * "empty" states before locally stored data has been read.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
