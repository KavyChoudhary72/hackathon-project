"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  source?: "gemini" | "fallback";
  model?: string;
}

export const ChatWidget: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedLang, setSelectedLang] = useState<"en" | "hi">(locale === "hi" ? "hi" : "en");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync selectedLang when app locale changes
  useEffect(() => {
    setSelectedLang(locale === "hi" ? "hi" : "en");
  }, [locale]);

  const initialGreeting =
    selectedLang === "hi"
      ? "नमस्ते! मैं जयपुर फूड रेस्क्यू एआई सहायक हूँ। आप माइक दबाकर हिंदी में बोल सकते हैं या टाइप कर सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?"
      : "Namaste! I am the Jaipur Food Rescue AI Assistant. You can speak using the microphone or type your query. How can I help you tonight?";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "bot",
      text: initialGreeting,
    },
  ]);

  // Update greeting when user switches language inside chat
  const handleLanguageChange = (newLang: "en" | "hi") => {
    setSelectedLang(newLang);
    setLocale(newLang);
    // Stop any ongoing speech or recognition
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (messages.length === 1 && messages[0].sender === "bot") {
      setMessages([
        {
          id: "init-1",
          sender: "bot",
          text:
            newLang === "hi"
              ? "नमस्ते! मैं जयपुर फूड रेस्क्यू एआई सहायक हूँ। आप माइक दबाकर हिंदी में बोल सकते हैं या टाइप कर सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?"
              : "Namaste! I am the Jaipur Food Rescue AI Assistant. You can speak using the microphone or type your query. How can I help you tonight?",
        },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ==========================================
  // TEXT-TO-SPEECH (TTS) with Indian Accents
  // ==========================================
  const speakText = useCallback(
    (text: string, msgId: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      // If already speaking this message, stop it
      if (speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
        return;
      }

      window.speechSynthesis.cancel();
      setSpeakingMsgId(msgId);

      // Clean markdown tags (*, #, _, urls) for natural human speech
      const cleanText = text
        .replace(/[*#_~`]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\n+/g, ". ");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const isHindi = selectedLang === "hi" || anyHindiChar(cleanText);

      utterance.lang = isHindi ? "hi-IN" : "en-IN";
      utterance.rate = isHindi ? 0.98 : 1.02; // Natural Indian cadence
      utterance.pitch = 1.0;

      // Find best available Indian voices
      const voices = window.speechSynthesis.getVoices();
      if (isHindi) {
        const hindiVoice =
          voices.find(
            (v) =>
              v.lang === "hi-IN" ||
              v.lang.startsWith("hi") ||
              v.name.toLowerCase().includes("hindi")
          ) || voices.find((v) => v.lang.includes("IN"));
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const indianEngVoice =
          voices.find(
            (v) =>
              v.lang === "en-IN" ||
              v.name.toLowerCase().includes("india") ||
              v.name.toLowerCase().includes("neerja") ||
              v.name.toLowerCase().includes("prabhat") ||
              v.name.toLowerCase().includes("heera")
          ) || voices.find((v) => v.lang.startsWith("en"));
        if (indianEngVoice) utterance.voice = indianEngVoice;
      }

      utterance.onend = () => {
        setSpeakingMsgId(null);
      };
      utterance.onerror = () => {
        setSpeakingMsgId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [selectedLang, speakingMsgId]
  );

  // Stop speech when closing modal
  const handleClose = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsOpen(false);
  };

  // Helper function to detect Devanagari script
  function anyHindiChar(str: string) {
    return /[\u0900-\u097F]/.test(str);
  }

  // ==========================================
  // SPEECH-TO-TEXT (STT / Voice Input Mic)
  // ==========================================
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is supported in Chrome, Edge, Safari and Android browsers.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Stop any ongoing TTS audio before listening
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang === "hi" ? "hi-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);

        // If user stopped speaking (final result)
        if (event.results[0].isFinal) {
          setIsListening(false);
          if (transcript.trim()) {
            handleSend(transcript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  // ==========================================
  // SEND QUERY (Backend Gemini -> Direct REST fallback)
  // ==========================================
  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);

    let botReply = "";
    let botSource: "gemini" | "fallback" = "gemini";
    let botModel = "gemini-3.1-flash-lite";

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          locale: selectedLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          botReply = data.reply;
          botSource = data.source || "gemini";
          botModel = data.model || "gemini-3.1-flash-lite";
        }
      }
    } catch (err) {
      console.warn("Backend chat unavailable, attempting direct client fallback...");
    }

    // Direct client fallback to Gemini API if backend was unreachable
    if (!botReply) {
      try {
        const geminiKey =
          process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
          "AQ.Ab8RN6JTfDn3r4C2cig-i_eUjy_tA0F665SD8vjHTG9socUqTQ";
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are the official AI Assistant for 'Jaipur Food Rescue and Security' (FoodLink).
Provide a quick, accurate, helpful 2-3 sentence answer in ${
                        selectedLang === "hi" ? "natural Hindi (Devanagari script)" : "crisp Indian English"
                      }.
Knowledge: FSSAI safe window <=4hr cooked meals, 2-Factor OTP (pickup OTP for donor, delivery OTP for shelter), 3-tier cascade (shelters -> discount deals -> gaushalas/biogas), and achiever donor certificates.
Question: ${textToSend}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const gText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (gText) {
            botReply = gText.trim();
            botSource = "gemini";
            botModel = "gemini-3.1-flash-lite (direct)";
          }
        }
      } catch (geminiErr) {
        console.warn("Direct gemini fallback error:", geminiErr);
      }
    }

    // Offline domain knowledge fallback
    if (!botReply) {
      botSource = "fallback";
      botModel = "knowledge_base";
      const isHi = selectedLang === "hi" || anyHindiChar(textToSend);
      const lower = textToSend.toLowerCase();

      if (lower.includes("otp") || textToSend.includes("ओटीपी")) {
        botReply = isHi
          ? "पिकअप ओटीपी (Pickup OTP) दाता की सुरक्षा करता है; भोजन वाहन में लोड होने पर ही इसे ड्राइवर को दें। आश्रय समन्वयक डिलीवरी ओटीपी से पुष्टि करते हैं।"
          : "Pickup OTP protects the donor kitchen during handoff. The driver verifies it upon loading, and the shelter coordinator verifies delivery via a separate Delivery OTP.";
      } else if (lower.includes("cert") || textToSend.includes("प्रमाण पत्र") || lower.includes("achiever")) {
        botReply = isHi
          ? "अचीवर दानदाताओं (जैसे होटल क्लार्क्स आमेर, श्री राम मैरिज गार्डन) के लिए अनुकूलित प्रमाण पत्र /certificate पेज से तुरंत पीडीएफ में डाउनलोड किया जा सकता है!"
          : "Official Certificates of Appreciation for achiever donors (Hotel Clarks Amer, Shree Ram Marriage Garden) can be customized and downloaded at /certificate!";
      } else {
        botReply = isHi
          ? "नमस्ते! जयपुर फूड रेस्क्यू एंड सिक्योरिटी में आपका स्वागत है। हमारी 3-स्तरीय प्रणाली 4 किमी के भीतर निकटतम आश्रयों को प्राथमिकता देती है।"
          : "Welcome to Jaipur Food Rescue & Security. Our 3-tier matching engine prioritizes verified shelters within 4 km with complete FSSAI compliance and OTP protection.";
      }
    }

    const newBotMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: newBotMsgId,
        sender: "bot",
        text: botReply,
        source: botSource,
        model: botModel,
      },
    ]);
    setLoading(false);

    // Auto-speak response in native accent if enabled
    if (autoSpeak) {
      setTimeout(() => {
        speakText(botReply, newBotMsgId);
      }, 100);
    }
  };

  const quickPromptsEn = [
    { label: "⚡ Fast Match?", prompt: "How fast is shelter matching for surplus cooked meals in Jaipur?" },
    { label: "🔒 How does OTP work?", prompt: "How does 2-factor OTP verification protect food donors and shelters?" },
    { label: "📜 Achiever Certificate", prompt: "How can high-volume donors get their Jaipur Food Rescue certificate?" },
    { label: "📍 Shelters in Jaipur", prompt: "Which shelters in Jaipur receive surplus food donations?" },
  ];

  const quickPromptsHi = [
    { label: "⚡ मिलान कितना तेज है?", prompt: "जयपुर में अतिरिक्त भोजन के लिए शेल्टर मिलान कितना तेज होता है?" },
    { label: "🔒 ओटीपी कैसे काम करता है?", prompt: "2-फैक्टर ओटीपी सत्यापन दाता और शेल्टर की सुरक्षा कैसे करता है?" },
    { label: "📜 सम्मान प्रमाण पत्र", prompt: "अचीवर दानदाता अपना आधिकारिक प्रमाण पत्र कैसे प्राप्त कर सकते हैं?" },
    { label: "📍 जयपुर के आश्रय", prompt: "जयपुर में कौन से शेल्टर अतिरिक्त भोजन प्राप्त करते हैं?" },
  ];

  const currentPrompts = selectedLang === "hi" ? quickPromptsHi : quickPromptsEn;

  return (
    <>
      {/* Floating Action Button (Glassmorphic Emerald) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            background: "linear-gradient(135deg, rgba(14, 59, 46, 0.92) 0%, rgba(22, 86, 66, 0.85) 100%)",
            boxShadow: "0 12px 36px rgba(14, 59, 46, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
            border: "1.5px solid rgba(255, 255, 255, 0.3)",
          }}
          className="fixed bottom-20 right-4 lg:bottom-5 lg:right-5 z-40 w-12 h-12 lg:w-14 lg:h-14 rounded-full text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-[#F2622E] ring-2 ring-[#0E3B2E] animate-pulse shadow-sm" />
          </div>
        </button>
      )}

      {/* Docked Glassmorphic Chat Window */}
      {isOpen && (
        <div
          style={{
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.25) 100%)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.18), inset 0 1.5px 2px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(0, 0, 0, 0.05)",
            border: "1.5px solid rgba(255, 255, 255, 0.7)",
          }}
          className="fixed bottom-20 right-3 sm:right-6 lg:bottom-5 z-50 w-[92vw] sm:w-[410px] h-[470px] max-h-[calc(100vh-140px)] rounded-[26px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-150"
        >
          {/* Frosted Glass Header with Language Selector & Voice Toggle */}
          <div
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background: "linear-gradient(135deg, rgba(14, 59, 46, 0.94) 0%, rgba(22, 86, 66, 0.84) 100%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            className="text-white px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center text-[#F5B82E] shadow-2xs">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[12.5px] font-bold leading-tight flex items-center gap-1.5 text-white">
                  <span>Jaipur Food Rescue AI</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#F5B82E] text-[#0E3B2E] text-[8px] font-black uppercase shadow-2xs">
                    Gemini 3.1
                  </span>
                </h4>
                <p className="text-[9.5px] text-[#A3D9BE] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span>
                    {selectedLang === "hi"
                      ? "आवाज एवं हिंदी बोली सक्रिय"
                      : "Voice & Indian English Active"}
                  </span>
                </p>
              </div>
            </div>

            {/* Language & Voice Controls Header Group */}
            <div className="flex items-center gap-1.5">
              {/* Language Switcher Pill */}
              <div className="flex bg-black/25 backdrop-blur-md rounded-full p-0.5 border border-white/20 text-[10.5px] font-bold">
                <button
                  type="button"
                  onClick={() => handleLanguageChange("en")}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    selectedLang === "en"
                      ? "bg-white text-[#0E3B2E] shadow-xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange("hi")}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    selectedLang === "hi"
                      ? "bg-white text-[#0E3B2E] shadow-xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Auto Speak Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (autoSpeak && speakingMsgId) {
                    window.speechSynthesis?.cancel();
                    setSpeakingMsgId(null);
                  }
                  setAutoSpeak(!autoSpeak);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  autoSpeak
                    ? "bg-[#1E9E5A] text-white shadow-2xs"
                    : "bg-white/10 text-white/60 hover:text-white"
                }`}
                title={autoSpeak ? "Voice Readout: ON" : "Voice Readout: Muted"}
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer ml-0.5"
                title="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Translucent Messages Body (Text bubbles are pure solid white) */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-transparent text-[13px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Text Bubble: Pure Solid White with Crisp Contrast */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
                  }}
                  className={`relative max-w-[86%] p-3.5 rounded-2xl border border-white ${
                    m.sender === "user"
                      ? "text-[#0E3B2E] font-semibold rounded-br-none border-l-4 border-l-[#0E3B2E]"
                      : "text-[#13231C] rounded-bl-none border-l-4 border-l-[#1E9E5A]"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {/* Message Bottom Utility Row */}
                  <div className="mt-1.5 flex items-center justify-between gap-2 pt-0.5 border-t border-neutral-100/80 text-[9px]">
                    {m.source === "gemini" ? (
                      <span className="flex items-center gap-1 text-[#1E9E5A] font-bold">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Google Gemini AI</span>
                      </span>
                    ) : (
                      <span className="text-[#8A938F]">Jaipur Food Rescue</span>
                    )}

                    {/* Speaker Button for Bot Message */}
                    {m.sender === "bot" && (
                      <button
                        type="button"
                        onClick={() => speakText(m.text, m.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                          speakingMsgId === m.id
                            ? "bg-[#0E3B2E] text-white animate-pulse"
                            : "bg-[#F6F5F1] text-[#0E3B2E] hover:bg-[#E3F5EA]"
                        }`}
                        title="Listen to message in native accent"
                      >
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>{speakingMsgId === m.id ? "Speaking..." : "Listen"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                  }}
                  className="text-[#13231C] border border-white p-3 rounded-2xl rounded-bl-none flex items-center gap-2.5 border-l-4 border-l-[#1E9E5A]"
                >
                  <Loader2 className="w-4 h-4 text-[#0E3B2E] animate-spin" />
                  <span className="text-[11px] text-[#5B6661] font-medium">
                    {selectedLang === "hi"
                      ? "Gemini उत्तर तैयार कर रहा है..."
                      : "Gemini is generating response..."}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Frosted Glass Quick Prompts Bar */}
          <div
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              background: "rgba(255, 255, 255, 0.45)",
              borderTop: "1px solid rgba(255, 255, 255, 0.6)",
            }}
            className="px-3 py-1.5 flex gap-1.5 overflow-x-auto text-[10.5px] no-scrollbar flex-shrink-0"
          >
            {currentPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.prompt)}
                disabled={loading}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.88)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                }}
                className="px-3 py-1 rounded-full hover:bg-white hover:text-[#0E3B2E] text-[#13231C] font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 flex-shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Frosted Glass Input Bar with Live Mic Button */}
          <div
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              background: "rgba(255, 255, 255, 0.55)",
              borderTop: "1px solid rgba(255, 255, 255, 0.6)",
            }}
            className="p-3 flex items-center gap-2 flex-shrink-0"
          >
            {/* Live Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              style={{
                boxShadow: isListening
                  ? "0 0 16px rgba(242, 98, 46, 0.6)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
              }}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-90 flex-shrink-0 ${
                isListening
                  ? "bg-[#F2622E] text-white animate-bounce ring-4 ring-[#F2622E]/30"
                  : "bg-white hover:bg-[#E3F5EA] text-[#0E3B2E] border border-white"
              }`}
              title={
                isListening
                  ? "Listening... Click to stop"
                  : selectedLang === "hi"
                  ? "माइक दबाकर हिंदी में बोलें (Speak in Hindi)"
                  : "Click to speak query (Indian English)"
              }
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Text Box */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                isListening
                  ? selectedLang === "hi"
                    ? "सुन रहा हूँ... बोलिए..."
                    : "Listening... speak now..."
                  : selectedLang === "hi"
                  ? "बोलें या हिंदी में पूछें..."
                  : "Speak or ask in Indian English..."
              }
              style={{
                backgroundColor: isListening ? "#FFF7ED" : "rgba(255, 255, 255, 0.95)",
                border: isListening ? "1.5px solid #F2622E" : "1px solid rgba(255, 255, 255, 0.9)",
              }}
              className="flex-1 text-[13px] rounded-full px-4 py-2.5 text-[#13231C] placeholder:text-[#8A938F] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/30 shadow-inner transition-all"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-full bg-[#0E3B2E] hover:bg-[#165642] disabled:opacity-40 text-white active:scale-95 transition-all shadow-md cursor-pointer flex-shrink-0"
              title="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
