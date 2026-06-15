"use client";

import { useEffect } from "react";

interface ConsentScriptsProps {
  metaPixelId: string;
  tiktokPixelId: string;
  googleTagId?: string | null;
}

export function ConsentScripts({ metaPixelId, tiktokPixelId, googleTagId }: ConsentScriptsProps) {
  useEffect(() => {
    const loadPixels = () => {
      const consent = localStorage.getItem("nm_cookie_consent");
      if (consent !== "all") return;

      // Meta Pixel
      if (metaPixelId && !(window as any).fbq) {
        const s = document.createElement("script");
        s.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${metaPixelId}');
          fbq('track','PageView');
        `;
        document.head.appendChild(s);
      }

      // TikTok Pixel
      if (tiktokPixelId && !(window as any).ttq?.instance) {
        const s = document.createElement("script");
        s.innerHTML = `
          !function(w,d,t){
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},
            ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
            ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
            var o=document.createElement("script");o.type="text/javascript",o.async=!0,
            o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];
            a.parentNode.insertBefore(o,a)};
            ttq.load('${tiktokPixelId}');
            ttq.page();
          }(window,document,'ttq');
        `;
        document.head.appendChild(s);
      }

      // Google Tag Manager
      if (googleTagId && !document.getElementById("gtm-script")) {
        const s = document.createElement("script");
        s.id = "gtm-script";
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagId}`;
        document.head.appendChild(s);

        const inline = document.createElement("script");
        inline.innerHTML = `
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','${googleTagId}');
        `;
        document.head.appendChild(inline);
      }
    };

    loadPixels();

    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === "all") loadPixels();
    };
    window.addEventListener("nm_consent_changed", handler);
    return () => window.removeEventListener("nm_consent_changed", handler);
  }, [metaPixelId, tiktokPixelId, googleTagId]);

  return null;
}
