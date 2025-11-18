"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { projects } from "../portfolio/data";
// At the top, import:
import { useRouter } from "next/navigation";
import { news } from "../news/[slug]/data";

export default function HeaderMockup() {
  // Inside the component:
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<
    "services" | "news" | "languages" | null
  >(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDropdownToggle = (
    dropdown: "services" | "news" | "languages"
  ) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  return (
    <header className="w-full bg-black/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" onClick={closeAll}>
          <Image
            className="invert w-20"
            src="/logo_official.png"
            alt="AI Faiss Logo"
            width={200}
            height={200}
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-sm text-gray-300">
          <button
            onClick={() => handleDropdownToggle("services")}
            className="hover:text-purple-400 transition flex items-center gap-1"
          >
            Diensten <span className="text-xs">▼</span>
          </button>

          <button
            onClick={() => handleDropdownToggle("news")}
            className="hover:text-purple-400 transition flex items-center gap-1"
          >
            Nieuws <span className="text-xs">▼</span>
          </button>

          <Link
            href="#cases"
            className="hover:text-purple-400 transition"
            onClick={(e) => {
              e.preventDefault();
              router.push("/#cases");
              closeAll();
            }}
          >
            Cases
          </Link>
          <Link
            href="#about"
            className="hover:text-purple-400 transition"
            onClick={(e) => {
              e.preventDefault();
              router.push("/#about");
              closeAll();
            }}
          >
            Over ons
          </Link>

          <Link
            href="/contact"
            className="hover:text-purple-400 transition"
            onClick={closeAll}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop language selector */}
        <div className="hidden md:block relative">
          <button
            onClick={() => handleDropdownToggle("languages")}
            className="text-gray-300 hover:text-purple-400 transition text-sm flex items-center gap-1"
          >
            nl | en <span className="text-xs">▼</span>
          </button>

          {openDropdown === "languages" && (
            <div className="absolute right-0 mt-3 bg-black/95 border border-white/10 rounded-md shadow-xl p-4 text-sm w-40">
              <Link
                href="#"
                className="block py-1 hover:text-purple-400"
                onClick={closeAll}
              >
                Nederlands
              </Link>
              <Link
                href="#"
                className="block py-1 hover:text-purple-400"
                onClick={closeAll}
              >
                English
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-200 text-3xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* Desktop Mega Menu */}
      {openDropdown === "services" && (
        <div className="hidden md:block w-full bg-black/95 border-b border-white/10 shadow-2xl py-10">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="grid grid-cols-2 gap-x-10 text-gray-200 text-sm">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="hover:text-purple-400 transition"
                  onClick={closeAll}
                >
                  {project.title}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-center bg-black border border-white/10 rounded-2xl p-4 shadow-lg hover:border-purple-500 transition cursor-pointer">
              <div className="flex items-center space-x-5">
                <Image
                  src="/event.jpg"
                  alt="Event Preview"
                  width={180}
                  height={120}
                  className="rounded-lg object-cover"
                />
                <div className="text-sm text-gray-200 leading-tight ">
                  <p className="font-semibold text-lg">AI Event — 2 Dec 2025</p>
                  <p className="text-gray-400 mt-1">
                    In 1 dag helemaal up-to-date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openDropdown === "news" && (
        <div className="hidden md:block w-full bg-black/95 border-b border-white/10 shadow-2xl py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="grid grid-cols-2 gap-x-10  text-gray-200 text-sm">
              {news
                .filter((item) => item.id < 6)
                .map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/news/${blog.slug}`}
                    className="block p-2 hover:text-purple-400 transition"
                    onClick={closeAll}
                  >
                    {blog.title}
                  </Link>
                ))}
              <Link
                href="#introduction"
                className="block p-2 hover:text-purple-400"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/#introduction");
                  closeAll();
                }}
              >
                Bekijk hoe automatisering jouw werk vereenvoudigt
              </Link>
            </div>
            <div className="flex items-center justify-center bg-black border border-white/10 rounded-2xl p-4 shadow-lg hover:border-purple-500 transition cursor-pointer">
              <div className="flex items-center space-x-5">
                <Image
                  src="/event.jpg"
                  alt="Event Preview"
                  width={180}
                  height={120}
                  className="rounded-lg object-cover"
                />
                <div className="text-sm text-gray-200 leading-tight ">
                  <p className="font-semibold text-lg">AI Event — 2 Dec 2025</p>
                  <p className="text-gray-400 mt-1">
                    In 1 dag helemaal up-to-date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-4 space-y-4 text-gray-200 text-base">
          {/* Mobile: Services */}
          <div>
            <button
              onClick={() => handleDropdownToggle("services")}
              className="w-full flex justify-between items-center py-2"
            >
              Diensten <span>▼</span>
            </button>
            {openDropdown === "services" && (
              <div className="pl-4 mt-2 space-y-2">
                {projects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/portfolio/${project.slug}`}
                    className="block hover:text-purple-400"
                    onClick={closeAll}
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => handleDropdownToggle("news")}
              className="w-full flex justify-between items-center py-2"
            >
              Nieuws <span>▼</span>
            </button>
            {openDropdown === "news" && (
              <div className="pl-4 mt-2 space-y-2">
                <Link
                  href="#introduction"
                  className="block hover:text-purple-400"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/#introduction");
                    closeAll();
                  }}
                >
                  Bekijk hoe automatisering jouw werk vereenvoudigt
                </Link>
                {news.map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/news/${blog.slug}`}
                    className="block hover:text-purple-400 transition"
                    onClick={closeAll}
                  >
                    {blog.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="#cases"
            className="block py-2 hover:text-purple-400"
            onClick={(e) => {
              e.preventDefault();
              router.push("/#cases");
              closeAll();
            }}
          >
            Cases
          </Link>
          <Link
            href="#about"
            className="block py-2 hover:text-purple-400"
            onClick={(e) => {
              e.preventDefault();
              router.push("/#about");
              closeAll();
            }}
          >
            Over ons
          </Link>
          <Link
            href="/contact"
            className="block py-2 hover:text-purple-400"
            onClick={closeAll}
          >
            Contact
          </Link>

          {/* Mobile languages */}
          <div>
            <button
              onClick={() => handleDropdownToggle("languages")}
              className="w-full flex justify-between items-center py-2"
            >
              nl | en <span>▼</span>
            </button>
            {openDropdown === "languages" && (
              <div className="pl-4 mt-2 space-y-2">
                <Link
                  href="#"
                  className="block hover:text-purple-400"
                  onClick={closeAll}
                >
                  Nederlands
                </Link>
                <Link
                  href="#"
                  className="block hover:text-purple-400"
                  onClick={closeAll}
                >
                  English
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
