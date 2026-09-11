"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { META_PIXEL_ID } from "../lib/metaPixel";

export default function MetaPixel() {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!isInitialized) return;
    if (lastTrackedPath.current === null) {
      // Initial PageView already fired by the init script itself.
      lastTrackedPath.current = pathname;
      return;
    }
    if (lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;
    window.fbq?.("track", "PageView");
  }, [isInitialized, pathname]);

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        onReady={() => setIsInitialized(true)}
      >
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
