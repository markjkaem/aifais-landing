"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";

export default function IntroVideoSection() {
  const t = useTranslations("explainer.introVideo");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background elements matching ExplainerSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-l from-purple-100/30 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {t("badge")}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-[1.1]">
            {t("title")}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                {t("titleHighlight")}
              </span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-0 rounded" />
            </span>
          </h2>
          
          <p className="text-xl text-gray-500 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto group">
          {/* Decorative Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Video Container */}
          <div className="relative bg-white rounded-[2rem] border border-gray-200 shadow-2xl overflow-hidden aspect-video cursor-pointer">
            <video
              ref={videoRef}
              src="/intro.mp4"
              className="w-full h-full object-cover"
              controls={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Play Overlay */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px] hover:bg-black/30 transition-all duration-300"
                onClick={handlePlay}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-blue-600 border-b-[12px] border-b-transparent ml-2" />
                </div>
                
                {/* Pulse Effect */}
                <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-white/30 rounded-full animate-ping" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
