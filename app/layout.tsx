import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { CartProvider } from "@/lib/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { PixelTracker } from "@/components/PixelTracker";
import { cn } from "@/lib/utils";
import AuthContext from "@/components/AuthContext";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0a09',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://northmind.uk"),
  title: "North Mind | Premium British Heritage",
  description: "Premium British Heritage menswear. Crafted for durability and contemporary sophistication.",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", inter.variable)} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/assets/logo.svg" />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased font-sans`}>
        {/* UTMify */}
        <Script 
          src="https://cdn.utmify.com.br/scripts/utms/latest.js" 
          data-utmify-prevent-xcod-sck="" 
          data-utmify-prevent-subids="" 
          data-utmify-pixel={process.env.NEXT_PUBLIC_UTMIFY_PIXEL_ID}
          strategy="afterInteractive"
        />
        
        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID || '636389112021100'}');
          `}}
        />

        {/* TikTok Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'D4LDB1RC77UDM7TK2810'}');
            }(window, document, 'ttq');
          `}}
        />

        {/* Tracking route changes */}
        <Suspense fallback={null}>
          <PixelTracker />
        </Suspense>

        <AuthContext>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthContext>
      </body>
    </html>
  );
}
