"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "918883389766";
const DEFAULT_MESSAGE = "Hello RD Engineering, I would like to know more about your services.";

export default function FloatingWhatsApp() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Chat Popup */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">RD Engineering</h4>
                    <p className="text-xs text-white/80">Typically replies within 1 hour</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-4">
                  👋 Hi! How can we help you? Send us a message and we'll get back to you shortly.
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg py-3 font-semibold text-sm hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Start Chat
                </button>
              </div>
            </motion.div>
          )}

          {/* Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
              isOpen
                ? "bg-gray-800 rotate-90"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl hover:shadow-green-500/40"
            )}
            aria-label="Chat on WhatsApp"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-7 w-7 text-white" />
            )}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
