"use client";

import React, { useState } from "react";
import {
  Trophy,
  Award,
  Crown,
  Medal,
  TrendingUp,
  Search,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LeaderboardPage() {
  const [timeTab, setTimeTab] = useState<"week" | "month" | "all">("month");
  const [typeFilter, setTypeFilter] = useState("all");

  const leaders = [
    {
      rank: 1,
      name: "ITC Rajputana",
      type: "Hotel & Banquet",
      meals: "4,520",
      points: 11300,
      badge: "🥇",
      trend: "+2",
      isUser: false,
    },
    {
      rank: 2,
      name: "Rambagh Palace Jaipur",
      type: "Heritage Hotel",
      meals: "3,890",
      points: 9720,
      badge: "🥈",
      trend: "+1",
      isUser: false,
    },
    {
      rank: 3,
      name: "Chokhi Dhani Resort",
      type: "Resort & Banquet",
      meals: "3,110",
      points: 7775,
      badge: "🥉",
      trend: "0",
      isUser: false,
    },
    {
      rank: 4,
      name: "Vikas Mehta (ITC Rajputana)",
      type: "Community Donor",
      meals: "1,240",
      points: 3450,
      badge: "👑",
      trend: "+4",
      isUser: true, // HIGHLIGHTS "YOU"
    },
    {
      rank: 5,
      name: "Hotel Clarks Amer",
      type: "Hotel",
      meals: "1,150",
      points: 2875,
      badge: "⭐",
      trend: "-1",
      isUser: false,
    },
    {
      rank: 6,
      name: "Shri Diggi Palace",
      type: "Banquet Hall",
      meals: "980",
      points: 2450,
      badge: "⭐",
      trend: "+1",
      isUser: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Jaipur Hunger Champions</span>
          </div>
          <h1 className="text-3xl font-black text-brand-800 tracking-tight">
            Impact Leaderboard
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Top hotel donors, banquet managers, and volunteer food rescue heroes.
          </p>
        </div>

        {/* Timeframe tabs */}
        <div className="flex items-center bg-white p-1 rounded-full border border-neutral-200 shadow-2xs text-xs font-bold">
          {(["week", "month", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeTab(tab)}
              className={`px-3 py-1 rounded-full capitalize transition-colors ${
                timeTab === tab
                  ? "bg-brand-800 text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {tab === "all" ? "All-Time" : `This ${tab}`}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Rank 2 */}
        <Card padding="md" className="order-2 sm:order-1 text-center space-y-2 border-neutral-200">
          <div className="text-3xl">🥈</div>
          <div className="text-xs font-bold text-neutral-400">Rank #2</div>
          <h3 className="text-sm font-bold text-neutral-900 truncate">
            Rambagh Palace
          </h3>
          <div className="font-mono text-sm font-black text-brand-800">
            3,890 Meals
          </div>
        </Card>

        {/* Rank 1 */}
        <Card
          padding="lg"
          className="order-1 sm:order-2 text-center space-y-2.5 bg-brand-50/80 border-brand-200 shadow-md ring-2 ring-brand-800/10 -mt-2"
        >
          <div className="text-4xl animate-bounce">🥇</div>
          <div className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">
            Champion
          </div>
          <h3 className="text-base font-black text-neutral-900">
            ITC Rajputana
          </h3>
          <div className="font-mono text-lg font-black text-brand-900">
            4,520 Meals
          </div>
        </Card>

        {/* Rank 3 */}
        <Card padding="md" className="order-3 text-center space-y-2 border-neutral-200">
          <div className="text-3xl">🥉</div>
          <div className="text-xs font-bold text-neutral-400">Rank #3</div>
          <h3 className="text-sm font-bold text-neutral-900 truncate">
            Chokhi Dhani
          </h3>
          <div className="font-mono text-sm font-black text-brand-800">
            3,110 Meals
          </div>
        </Card>
      </div>

      {/* Full Leaderboard Table */}
      <Card padding="none" className="overflow-hidden shadow-card border-neutral-200">
        <div className="p-4 bg-surface-subtle border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider flex justify-between">
          <div className="flex gap-6">
            <span className="w-8">Rank</span>
            <span>Donor & Organization</span>
          </div>
          <div className="flex gap-12 mr-4">
            <span>Meals Saved</span>
            <span className="w-16 text-right">Points</span>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              className={`p-4 flex items-center justify-between transition-colors ${
                leader.isUser
                  ? "bg-brand-50/70 border-l-4 border-brand-800 font-bold"
                  : "hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 font-black text-sm text-neutral-700">
                  {leader.badge}
                </span>
                <div>
                  <div className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <span>{leader.name}</span>
                    {leader.isUser && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-800 text-white text-[10px] font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500">{leader.type}</div>
                </div>
              </div>

              <div className="flex items-center gap-12 mr-4">
                <span className="font-semibold text-neutral-800">
                  {leader.meals}
                </span>
                <span className="w-16 text-right font-black font-mono text-brand-800">
                  {leader.points.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}