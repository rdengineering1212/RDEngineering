"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

export default function GoogleTranslate() {
  const [isTamil, setIsTamil] = useState(false);

  useEffect(() => {
    const loadScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "ta",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
        };
      }
    };

    // Defer execution until main thread is idle
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(loadScript);
    } else {
      setTimeout(loadScript, 1000);
    }

    // Check current cookie to see if already translated
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match && match[2] === "/en/ta") {
      setIsTamil(true);
    }
  }, []);

  const toggleTranslate = () => {
    if (isTamil) {
      // Switch back to English by clearing the googtrans cookie
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      setIsTamil(false);
      window.location.reload();
    } else {
      // Switch to Tamil by setting the googtrans cookie
      document.cookie = "googtrans=/en/ta; path=/;";
      document.cookie = `googtrans=/en/ta; path=/; domain=${window.location.hostname}`;
      setIsTamil(true);
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-[160px] right-6 z-50 flex items-center justify-center">
      {/* Hidden container for actual Google Translate widget */}
      <div id="google_translate_element" className="hidden opacity-0 invisible absolute -z-10 pointer-events-none"></div>

      {/* Custom Floating Button */}
      <button
        onClick={toggleTranslate}
        className="bg-zinc-900 border border-accent/30 rounded-full px-4 py-2.5 shadow-xl text-sm font-bold text-accent flex items-center justify-center gap-2 hover:bg-accent hover:text-zinc-900 transition-all duration-300 transform hover:scale-105"
        title="Translate to Tamil / English"
      >
        <Languages className="w-4 h-4" />
        {isTamil ? "English" : "தமிழ்"}
      </button>

      <style jsx global>{`
        /* Hide all Google Translate default overlays and bars */
        .skiptranslate > iframe.skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0px !important; 
        }
        .goog-te-banner-frame {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

// Global declaration for the callback
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}
