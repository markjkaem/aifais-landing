"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function TeamSection() {
  const t = useTranslations("team");

  const team = [
    {
      name: "Mark",
      role: t("mark.role"),
      bio: t("mark.bio"),
      skills: t.raw("mark.skills") as string[],
      image: "/mark.png",
      link: "https://www.linkedin.com/in/mark-v-898408309/",
      linkText: "LinkedIn",
      linkType: "linkedin",
    },
    {
      name: "Faissal",
      role: t("faissal.role"),
      bio: t("faissal.bio"),
      skills: t.raw("faissal.skills") as string[],
      image: "/faissal.png",
      link: "mailto:faissal@aifais.com",
      linkText: "Email",
      linkType: "email",
    },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-sm font-medium text-gray-600">
              {t("badge")}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {team.map((member, idx) => (
            <div key={idx} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
              <div className={`h-1 bg-gradient-to-r ${idx === 0 ? "from-blue-300 to-blue-600" : "from-blue-500 to-blue-800"}`} />
              <div className="p-8">
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">{member.bio}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100">
                      {skill}
                    </span>
                  ))}
                </div>
                <a
                  href={member.link}
                  target={member.linkType === "linkedin" ? "_blank" : undefined}
                  rel={member.linkType === "linkedin" ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors group/link"
                >
                  {member.linkType === "linkedin" ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span>{member.linkText}</span>
                  <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats / Trust */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center">
            {[
              { val: "2", label: t("stats.founders") },
              { val: "Gouda", label: t("stats.location") },
              { val: "100%", label: t("stats.bootstrapped") },
              { val: "24h", label: t("stats.response") },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-x-12">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stat.val}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
                {idx < 3 && <div className="hidden sm:block w-px h-10 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
