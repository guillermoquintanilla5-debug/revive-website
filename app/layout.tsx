import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./legacy.css";
import favicon16 from "./favicon-16x16.png";
import favicon32 from "./favicon-32x32.png";
import appleTouchIcon from "./apple-touch-icon.png";
import icon192 from "./icon-192.png";
import icon512 from "./icon-512.png";

const CAPABILITY_BOOT = `(function(){var r=document.documentElement;var force=false;try{force=/(?:^|[?&])legacy=1(?:&|$)/.test(location.search)}catch(e){}var modern=false;try{if(window.CSS&&CSS.supports&&CSS.supports("color","color-mix(in srgb,#088635,#000)")){var s=document.createElement("style");s.textContent="@layer __revive_probe{html{--__revive_layers:1}}";document.head.appendChild(s);modern=getComputedStyle(r).getPropertyValue("--__revive_layers").trim()==="1";s.remove()}}catch(e){}if(force||!modern){r.classList.add("legacy-css")}else{r.classList.add("js","modern-css")}})();`;

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
      </head>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
