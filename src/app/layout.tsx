import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { getAudioCatalog } from "@/lib/content";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kathasagaram · కథాసాగరం — Stories without borders",
    template: "%s · Kathasagaram",
  },
  description:
    "Kathasagaram is a premium Indian mythology reading and listening experience. Discover the Mahabharata through Karna — his stories, timeline and relationships, in English and తెలుగు.",
  applicationName: "Kathasagaram",
};

export const viewport: Viewport = {
  themeColor: "#041516",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getAudioCatalog();
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Providers catalog={catalog}>
          <AppShell footer={<Footer />}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
