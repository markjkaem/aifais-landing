"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function VoiceInput({
  onTranscript,
  className = "",
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Browser ondersteuning checken
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();

        // 🔥 BELANGRIJK: Zorg dat hij blijft luisteren
        recognition.continuous = true;

        // Zet dit op true zodat we kunnen zien dat hij bezig is,
        // maar we sturen alleen de definitieve tekst door.
        recognition.interimResults = true;

        recognition.lang = "nl-NL";

        recognition.onresult = (event: any) => {
          let finalTranscript = "";

          // We loopen door de resultaten om alleen de *nieuwe* definitieve stukjes te pakken
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }

          // Alleen als er een definitieve zin is, sturen we die naar het formulier
          if (finalTranscript) {
            onTranscript(finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech error:", event.error);
          // Alleen stoppen bij fatale fouten, niet bij 'no-speech' (stilte)
          if (
            event.error === "not-allowed" ||
            event.error === "service-not-allowed"
          ) {
            setIsListening(false);
          }
        };

        // Als hij toch stopt (bijv door netwerk), en we wilden dat niet, herstart hem dan
        recognition.onend = () => {
          // We doen hier even niets, de state 'isListening' bepaalt of we de knop rood houden.
          // Als je wilt dat hij écht oneindig doorgaat, zou je hier recognition.start() kunnen doen
          // als isListening nog true is, maar browsers blokkeren dat soms.
          // Voor nu is de 'continuous = true' meestal genoeg.
          // Visuele update als de browser besluit écht te stoppen:
          // setIsListening(false); <--- Deze laten we weg zodat de knop actief lijkt zolang de sessie loopt
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Kon niet starten:", err);
        setIsListening(false);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center border ${
        isListening
          ? "bg-red-50 border-red-200 text-red-500 animate-pulse shadow-md shadow-red-500/20"
          : "bg-white border-gray-200 text-gray-400 hover:text-[#3066be] hover:border-[#3066be]/50"
      } ${className}`}
      title={isListening ? "Klik om te stoppen" : "Klik om in te spreken"}
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
