"use client";

import Link from "next/link";
import Image from "next/image";

interface ServiceLink {
  title: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
}

interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
}

interface MegaMenuServicesProps {
  serviceLinks: ServiceLink[];
  getLocalizedPath: (path: string) => string;
  closeAll: () => void;
  t: (key: string) => string;
}

export function MegaMenuServices({
  serviceLinks,
  getLocalizedPath,
  closeAll,
  t,
}: MegaMenuServicesProps) {
  return (
    <div className="hidden lg:block w-full bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-2xl py-8 animate-slideDown">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 px-4">
            {t("solutions")}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {serviceLinks.map((service) => (
              <Link
                key={service.slug}
                href={getLocalizedPath(service.slug)}
                className="group p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200 flex items-start gap-4"
                onClick={closeAll}
              >
                <div className="mt-1 text-[#3066be] group-hover:scale-110 transition bg-blue-50 p-2 rounded-lg">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1 group-hover:text-[#3066be] transition">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 px-4 pt-4 border-t border-gray-100">
            <Link
              href={getLocalizedPath("/diensten")}
              className="text-gray-500 text-sm font-semibold hover:text-[#3066be] transition flex items-center gap-1"
              onClick={closeAll}
            >
              {t("allServices")}{" "}
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-linear-to-br from-[#3066be]/5 to-blue-50 border border-[#3066be]/20 rounded-2xl p-6 hover:border-[#3066be]/40 transition cursor-pointer w-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3066be]/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[#3066be]/20"></div>
            <p className="font-semibold text-lg text-gray-900 mb-2 relative z-10">
              {t("analysisTitle")}
            </p>
            <p className="text-sm text-gray-600 mb-6 relative z-10">
              {t("analysisSub")}
            </p>
            <Link
              href={getLocalizedPath("/contact")}
              onClick={closeAll}
              className="block w-full py-3 bg-[#3066be] text-white text-center rounded-lg font-medium hover:bg-[#234a8c] transition relative z-10 shadow-lg shadow-blue-900/10"
            >
              {t("analysisCTA")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MegaMenuNewsProps {
  news: NewsItem[];
  getLocalizedPath: (path: string) => string;
  closeAll: () => void;
  tEvent: (key: string) => string;
  tMega: (key: string) => string;
}

export function MegaMenuNews({
  news,
  getLocalizedPath,
  closeAll,
  tEvent,
  tMega,
}: MegaMenuNewsProps) {
  return (
    <div className="hidden lg:block w-full bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-2xl py-8 animate-slideDown">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 px-4">
            {tMega("articles")}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {news.slice(0, 1).map((blog) => (
                <Link
                  key={blog.slug}
                  href={getLocalizedPath(`/news/${blog.slug}`)}
                  className="group col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#3066be]/30 transition-all flex gap-6"
                  onClick={closeAll}
                >
                  <div className="relative w-1/3 aspect-video rounded-lg overflow-hidden shrink-0 border border-white">
                    <Image
                      src={blog.image || "/lesson1.jpg"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                        Trend 2026
                      </span>
                    </div>
                    <h3 className="text-gray-900 font-bold text-xl mb-2 group-hover:text-[#3066be] transition">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </Link>
            ))}
            {news.slice(1, 4).map((blog) => (
                <Link
                  key={blog.slug}
                  href={getLocalizedPath(`/news/${blog.slug}`)}
                  className="group p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                  onClick={closeAll}
                >
                  <h3 className="text-gray-900 font-semibold mb-1 group-hover:text-[#3066be] transition line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {blog.excerpt}
                  </p>
                </Link>
              ))}
          </div>
          <div className="mt-4 px-4 flex flex-col gap-2">
            <Link
              href={getLocalizedPath("/news")}
              className="text-gray-500 text-sm font-semibold hover:text-[#3066be] transition flex items-center gap-1"
              onClick={closeAll}
            >
              {tMega("knowledgeBase")}
            </Link>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#3066be]/30 hover:shadow-lg transition cursor-pointer w-full">
            <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="/lesson.jpg"
                alt="Event"
                fill
                className="object-cover"
              />
            </div>
            <p className="font-semibold text-lg text-gray-900 mb-2">
              {tEvent("title")}
            </p>
            <Link
              href={getLocalizedPath("/contact")}
              onClick={closeAll}
              className="text-sm text-gray-500 hover:text-[#3066be] transition"
            >
              {tEvent("cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
