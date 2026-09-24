"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! I am FoodLink AI. How can I help you save surplus food or coordinate a delivery tonight?",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate smart AI response
    setTimeout(() => {
      let reply = "Our automated matching system prioritizes nearest verified shelters within 4 km with available capacity. Cooked meals remain safe for pickup within a 4-hour window under FSSAI surplus guidelines.";
      if (input.toLowerCase().includes("banquet") || input.toLowerCase().includes("wedding")) {
        reply = "For wedding halls in Jaipur, you can use our <60-second quick post form. Simply select 'Cooked Meals', verify veg compliance, and a driver will be dispatched instantly.";
      } else if (input.toLowerCase().includes("otp")) {
        reply = "Pickup OTP protects donors; give it to the driver only when food is physically loaded. The shelter coordinator validates delivery with a separate delivery OTP.";
      }
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: reply },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-800 text-white shadow-float flex items-center justify-center hover:bg-brand-700 active:scale-95 transition-all"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-500 ring-2 ring-brand-800" />
          </div>
        )}
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-40 w-84 sm:w-96 bg-white rounded-3xl shadow-float border border-neutral-200 overflow-hidden flex flex-col h-[460px] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-brand-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-accent-500">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight flex items-center gap-1">
                  <span>FoodLink AI Assistant</span>
                  <Sparkles className="w-3 h-3 text-accent-500 fill-accent-500" />
                </h4>
                <p className="text-[10px] text-brand-200">Online · Instant Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-base text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-brand-800 text-white rounded-br-none"
                      : "bg-white text-neutral-800 border border-neutral-200/80 shadow-2xs rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="px-3 py-2 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => {
                setInput("How fast does a shelter accept?");
              }}
              className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 font-medium whitespace-nowrap"
            >
              ⚡ How fast is match?
            </button>
            <button
              onClick={() => {
                setInput("How does OTP handover work?");
              }}
              className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 font-medium whitespace-nowrap"
            >
              🔒 How does OTP work?
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about food surplus..."
              className="flex-1 text-xs bg-surface-subtle border border-neutral-200 rounded-full px-3.5 py-2.5 focus:outline-none focus:border-brand-700"
            />
            <button
              onClick={handleSend}
              className="p-2.5 rounded-full bg-brand-800 text-white hover:bg-brand-700 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
