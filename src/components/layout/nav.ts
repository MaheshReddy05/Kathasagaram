export const NAV_ITEMS = [
  { href: "/", label: "Home", telugu: "హోమ్" },
  { href: "/explore", label: "Explore", telugu: "అన్వేషణ" },
  { href: "/library", label: "Library", telugu: "గ్రంథాలయం" },
] as const;

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
