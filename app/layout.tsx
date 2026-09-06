import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./baseline.css";
import "./globals.css";
import favicon16 from "./favicon-16x16.png";
import favicon32 from "./favicon-32x32.png";
import appleTouchIcon from "./apple-touch-icon.png";
import icon192 from "./icon-192.png";
import icon512 from "./icon-512.png";

const CRITICAL_CSS =
  'html,body{width:100%;max-width:100%;margin:0;overflow-x:hidden}*,*:before,*:after{box-sizing:border-box}.nav-logo{display:block;width:auto;max-width:140px;max-height:58px}.site-nav-desktop{display:none}@media (min-width:1024px){.site-nav-desktop{display:flex}.nav-logo{max-width:180px}.site-nav-toggle{display:none}}';

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
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}