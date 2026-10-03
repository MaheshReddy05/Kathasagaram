/**
 * Prefixes a /public path with the deployment base path (e.g. "/Kathasagaram"
 * on GitHub Pages). Empty locally. Set via NEXT_PUBLIC_BASE_PATH at build time.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const publicPath = (path: string) => `${BASE_PATH}${path}`;
