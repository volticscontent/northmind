import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { CartProvider } from "@/lib/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
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
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", inter.variable)}>
      <head>
        <link rel="apple-touch-icon" href="/assets/logo.svg" />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased font-sans`}>
        {/* UTMify */}
        <Script 
          src="https://cdn.utmify.com.br/scripts/utms/latest.js" 
          data-utmify-prevent-xcod-sck="" 
          data-utmify-prevent-subids="" 
          strategy="afterInteractive"
        />
        
        {/* Facebook Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '636389112021100');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TTP = w.TTP || []; w.TTP.prepare = function (t, e) { w.TTP.push({ type: t, value: e }) };
              var a = d.createElement('script'); a.async = !0, a.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=D4LDB1RC77UDM7TK2810';
              var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(a, s)
            }(window, document);
          `}
        </Script>

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
