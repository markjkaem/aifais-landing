"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

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

        // 🔥 Zorgt dat hij blijft luisteren, ook na een pauze
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "nl-NL";

        recognition.onresult = (event: any) => {
          let finalTranscript = "";

          // Alleen nieuwe, definitieve zinnen toevoegen
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            onTranscript(finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          // Negeer 'no-speech' (gebeurt als je even nadenkt/stil bent)
          if (event.error === "no-speech") {
            return;
          }

          // eslint-disable-next-line no-console
          console.error("Speech error:", event.error);

          // Alleen stoppen bij échte fouten (zoals geen microfoon toegang)
          if (
            event.error === "not-allowed" ||
            event.error === "service-not-allowed"
          ) {
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          // Als de browser zelf stopt (bijv. timeout), updaten we de knop
          // Tenzij we in een loop zitten, maar voor nu is dit veiliger voor de UX
          // setIsListening(false); // <-- Uitgezet zodat de knop rood blijft lijken
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
        // eslint-disable-next-line no-console
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
