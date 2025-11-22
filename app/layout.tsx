import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Stardos_Stencil } from "next/font/google";
import HeaderMockup from "./Components/Header";

const anton = Inter({
  weight: "400",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Fais - AI Consulting & Automation",
  description: "AI Consulting & Automation Services",
};

const accentColor = "text-purple-500"; // tertiary color tertiary color

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TMVXP6WQ');`,
          }}
        />
      </head>
      <body className={`${anton.className} tracking-wider`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TMVXP6WQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <HeaderMockup />

        {children}
        {/* Soft minimal footer */}
        <footer className=" text-gray-200 bg-gray-950 mt-12">
          <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg mb-2">Aifais</h3>
              <p>Kampenringweg 45D</p>
              <p>2803 PE Gouda</p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg mb-2">
                Zakelijke informatie
              </h3>
              <p>
                BTW: <span className="italic">NL000099998B57</span>
              </p>
              <p>KvK: 27199999</p>
              <p>Verzekerd & gecertificeerd</p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg mb-2">Navigatie</h3>
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/portfolio" className="hover:underline">
                Portfolio
              </Link>

              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/agv" className="hover:underline">
                Algemene Voorwaarden
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Aifais — Alle rechten voorbehouden
          </div>
        </footer>
      </body>
    </html>
  );
}
