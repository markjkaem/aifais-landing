"use client";
import { useEffect, useRef, useState } from "react";

export default function VantaHalo() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effect;

    async function initVanta() {
      const THREE = (await import("three")).default || (await import("three"));
      const VANTA = (await import("vanta/dist/vanta.halo.min")).default;

      if (!vantaEffect && vantaRef.current) {
        effect = VANTA({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          amplitudeFactor: 3.0,
          xOffset: 0.24,
          size: 1.6,
        });
        setVantaEffect(effect);
        console.log("Vanta initialized!");
      }
    }

    initVanta();

    return () => {
      if (effect) effect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="absolute inset-0" />;
}
