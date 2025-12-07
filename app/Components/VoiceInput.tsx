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
    // Check of browser spraakherkenning ondersteunt
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop na het praten
        recognition.interimResults = false; // Alleen eindresultaat
        recognition.lang = "nl-NL"; // Nederlands

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          onTranscript(text);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
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
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isSupported) return null; // Verberg knop als browser het niet kan

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center border ${
        isListening
          ? "bg-red-50 border-red-200 text-red-500 animate-pulse"
          : "bg-white border-gray-200 text-gray-400 hover:text-[#3066be] hover:border-[#3066be]/50"
      } ${className}`}
      title="Spreek je bericht in"
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
