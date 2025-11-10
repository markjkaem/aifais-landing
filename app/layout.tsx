import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="container mx-auto bg-black px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <Image
              className="invert w-32"
              src="/logo.png"
              alt="AI Faiss Logo"
              width={1000}
              height={1000}
            />
          </Link>
          <div className="flex justify-center items-center md:space-x-8">
            <div className="md:flex space-x-2 hidden">
              <img
                src="/uk.jpg"
                alt="Description of image"
                className="md:w-5 md:h-4 w-14"
              />
              <img
                src="/netherlands.webp"
                alt="Description of image"
                className="md:w-5 md:h-4 w-14"
              />
            </div>
            <nav className="space-x-6">
              <a
                href="#services"
                className={`text-gray-300 hover:${accentColor} transition`}
              >
                Services
              </a>
              <a
                href="/contact"
                className={`text-gray-300 hover:${accentColor} transition`}
              >
                Contact
              </a>
            </nav>
          </div>
        </header>
        {children}
        {/* Soft minimal footer */}
        <footer className=" text-gray-200 bg-gray-950 mt-12">
          <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg mb-2">Aifais</h3>
              <p>Kampenringweg 45D</p>
              <p>2803 PE Gouda</p>
              <p>
                Tel:{" "}
                <a href="tel:+31627467225" className="hover:underline">
                  0627467225
                </a>
              </p>
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
