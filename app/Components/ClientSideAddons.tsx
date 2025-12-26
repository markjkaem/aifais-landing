"use client";

import dynamic from "next/dynamic";

const ExitIntentPopup = dynamic(() => import("./ExitIntentPopup"), {
  ssr: false,
});

const AIChatbot = dynamic(() => import("./Aichatbot"), {
  ssr: false,
});

const CookieBanner = dynamic(() => import("./CookieBanner"), {
  ssr: false,
});

export default function ClientSideAddons() {
  return (
    <>
      <CookieBanner />
      <ExitIntentPopup />
      <AIChatbot />
    </>
  );
}
