"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GA_MEASUREMENT_ID = "G-BWVS7QZ2WT";
const GOOGLE_ADS_ID = "AW-18436793858";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!isInitialized || lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [isInitialized, pathname]);

  return (
    <>
      <Script
        id="ga4-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-initialization"
        strategy="afterInteractive"
        onReady={() => setIsInitialized(true)}
      >
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false});gtag('config','${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  );
}
