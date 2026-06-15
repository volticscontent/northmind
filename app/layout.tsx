import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { CartProvider } from "@/lib/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { PixelTracker } from "@/components/PixelTracker";
import { ConsentScripts } from "@/components/ConsentScripts";
import { LgpdBanner } from "@/components/LgpdBanner";
import { cn } from "@/lib/utils";
import AuthContext from "@/components/AuthContext";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0a0a09",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://northmind.uk"),
  title: "North Mind | Premium British Heritage",
  description: "Premium British Heritage menswear. Crafted for durability and contemporary sophistication.",
  icons: { icon: "/assets/logo.svg", apple: "/assets/logo.svg" },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

const getPixelConfig = unstable_cache(
  async () => {
    try {
      return await (prisma as any).storeSettings.findUnique({ where: { id: "singleton" } });
    } catch {
      return null;
    }
  },
  ["store-settings"],
  { revalidate: 3600, tags: ["store-settings"] }
);

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [session, settings] = await Promise.all([
    getServerSession(authOptions),
    getPixelConfig(),
  ]);

  const metaPixelId = settings?.metaPixelId || process.env.NEXT_PUBLIC_FB_PIXEL_ID || "636389112021100";
  const tiktokPixelId = settings?.tiktokPixelId || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "D4LDB1RC77UDM7TK2810";
  const googleTagId = settings?.googleTagId || process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || null;
  const utmifyPixelId = settings?.utmifyPixelId || process.env.NEXT_PUBLIC_UTMIFY_PIXEL_ID;
  const gbpToBrlRate = settings?.gbpToBrlRate || 7.4;

  return (
    <html lang="pt-BR" className={cn("dark", "font-sans", inter.variable)} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/assets/logo.svg" />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased font-sans`}>
        {/* Runtime config — read by lib/tracking.ts via window.__NM_CONFIG__ */}
        <Script
          id="nm-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__NM_CONFIG__=${JSON.stringify({ gbpToBrlRate, metaPixelId, tiktokPixelId })}`,
          }}
        />

        {/* UTMify — page tracking & UTM capture (legitimate interest, no consent required) */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck=""
          data-utmify-prevent-subids=""
          data-utmify-pixel={utmifyPixelId}
          strategy="afterInteractive"
        />

        {/* Meta, TikTok, Google — loaded client-side only after LGPD consent */}
        <ConsentScripts
          metaPixelId={metaPixelId}
          tiktokPixelId={tiktokPixelId}
          googleTagId={googleTagId}
        />

        <Suspense fallback={null}>
          <PixelTracker />
        </Suspense>

        <AuthContext session={session}>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthContext>

        <LgpdBanner />
      </body>
    </html>
  );
}
