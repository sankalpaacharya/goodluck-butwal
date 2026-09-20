import localFont from "next/font/local";
import { Bricolage_Grotesque } from "next/font/google";

// Not on Google Fonts, so the latin files are bundled. Only 500 and 600 are used, and both are
// preloaded: they carry the body text, the nav and the buttons.
export const interDisplay = localFont({
  src: [
    { path: "../assets/fonts/InterDisplay-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/InterDisplay-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

// The headings are the only thing in this face. Swap paints them in the fallback either way, so
// preloading it only took 22 KB off the picture the page is waiting for.
export const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600"], variable: "--font-bricolage", display: "swap", preload: false });
