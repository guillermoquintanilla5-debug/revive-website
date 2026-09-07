import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./legacy.css";
import favicon16 from "./favicon-16x16.png";
import favicon32 from "./favicon-32x32.png";
import appleTouchIcon from "./apple-touch-icon.png";
import icon192 from "./icon-192.png";
import icon512 from "./icon-512.png";

const CAPABILITY_BOOT = `(function(){var r=document.documentElement;var force=false;try{force=/(?:^|[?&])legacy=1(?:&|$)/.test(location.search)}catch(e){}var modern=false;try{modern=!!(window.CSS&&CSS.supports&&CSS.supports("color","color-mix(in srgb,#088635,#000)"))}catch(e){}if(force||!modern){r.classList.add("legacy-css")}else{r.classList.add("js","modern-css")}})();`;

/* Legacy mobile Gallery only: CSS entrance + native scroll arrows (no GSAP).
   Deferred so React can hydrate before this script mutates gallery DOM. */
const LEGACY_GALLERY_BOOT = `(function(){function ready(fn){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fn);else fn()}ready(function(){setTimeout(function(){var root=document.documentElement;if(!root.classList.contains("legacy-css"))return;if(!window.matchMedia||!window.matchMedia("(max-width:767.98px)").matches)return;var section=document.getElementById("gallery");if(!section)return;var viewport=section.querySelector(".gallery-viewport");if(!viewport)return;section.classList.add("is-ready");var reduce=false;try{reduce=window.matchMedia("(prefers-reduced-motion:reduce)").matches}catch(e){}function reveal(){section.classList.add("is-in")}if(reduce){reveal()}else{section.classList.add("gallery-pending");if("IntersectionObserver" in window){var io=new IntersectionObserver(function(entries){for(var i=0;i<entries.length;i++){if(entries[i].isIntersecting){reveal();io.disconnect();break}}}, {threshold:0.08});io.observe(section)}setTimeout(reveal,1400)}function cards(){return Array.prototype.filter.call(viewport.querySelectorAll(".gallery-card"),function(c){return window.getComputedStyle(c).display!=="none"})}function go(dir){var list=cards();if(!list.length)return;var x=viewport.scrollLeft,idx=0,i;for(i=0;i<list.length;i++){if(list[i].offsetLeft<=x+12)idx=i}var next=Math.max(0,Math.min(list.length-1,idx+dir));var smooth=!reduce;if(viewport.scrollTo){try{viewport.scrollTo({left:list[next].offsetLeft,behavior:smooth?"smooth":"auto"})}catch(e){viewport.scrollLeft=list[next].offsetLeft}}else{viewport.scrollLeft=list[next].offsetLeft}}function syncPrev(){var prev=section.querySelector(".gallery-arrow--prev");if(!prev)return;var show=viewport.scrollLeft>10;prev.style.visibility=show?"visible":"hidden";prev.style.opacity=show?"1":"0";prev.setAttribute("aria-hidden",show?"false":"true")}viewport.addEventListener("scroll",syncPrev,false);syncPrev();var prevBtn=section.querySelector(".gallery-arrow--prev");var nextBtn=section.querySelector(".gallery-arrow--next");if(prevBtn)prevBtn.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();go(-1)},true);if(nextBtn)nextBtn.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();go(1)},true)},0)})})();`;

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reviveroofing.ca"),
  title: "Revive Roof Solutions | Roof Rejuvenation in Ottawa",
  description:
    "Professional roof rejuvenation and exterior home services throughout Ottawa and surrounding areas.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: favicon16.src, sizes: "16x16", type: "image/png" },
      { url: favicon32.src, sizes: "32x32", type: "image/png" },
      { url: icon192.src, sizes: "192x192", type: "image/png" },
      { url: icon512.src, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: appleTouchIcon.src, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: CAPABILITY_BOOT }} />
        <script dangerouslySetInnerHTML={{ __html: LEGACY_GALLERY_BOOT }} />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
