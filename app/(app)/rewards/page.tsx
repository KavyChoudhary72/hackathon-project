"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Sparkles,
  UtensilsCrossed,
  Heart,
  Users,
  Leaf,
  Trophy,
  Crown,
  CheckCircle2,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiClient } from "@/lib/api/client";
import { RewardsProfile } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";

export default function RewardsHubPage() {
  const { toast, celebrate } = useToast();
  const { t } = useI18n();

  const [profile, setProfile] = useState<RewardsProfile | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    apiClient.getRewards().then(setProfile);
  }, []);

  const handleRedeem = (itemTitle: string, cost: number) => {
    if (!profile) return;
    if (profile.impactPoints < cost) {
      toast({
        type: "error",
        title: "Insufficient Points",
        message: `You need ${cost} points to redeem ${itemTitle}. Keep saving food!`,
      });
      return;
    }

    profile.impactPoints -= cost;
    celebrate("Perk Redeemed!", `You have successfully redeemed ${itemTitle}!`);
    toast({
      type: "success",
      title: "Reward Claimed",
      message: `Your voucher has been sent to your registered email.`,
    });
  };

  const perks = [
    {
      id: "p1",
      title: "Plant a Tree",
      category: "Perks",
      points: 500,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80",
      description: "We will plant a tree in your name and send you a digital certificate.",
    },
    {
      id: "p2",
      title: "FoodLink Eco Bottle",
      category: "Perks",
      points: 1000,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
      description: "Get a premium eco-friendly bottle and support sustainability.",
    },
    {
      id: "p3",
      title: "FoodLink Tote Bag",
      category: "Perks",
      points: 2000,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80",
      description: "Carry the change. A stylish tote bag for our amazing donors.",
    },
    {
      id: "p4",
      title: "Sponsor 10 Meals",
      category: "Experiences",
      points: 3000,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
      description: "Use your points to directly sponsor 10 meals at a shelter.",
    },
    {
      id: "p5",
      title: "Recognition Certificate",
      category: "Recognition",
      points: 5000,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
      description: "Get a special recognition certificate for your contributions.",
    },
  ];

  const filteredPerks =
    activeCategory === "All"
      ? perks
      : perks.filter((p) => p.category === activeCategory || activeCategory === "All");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header matching Reference Image 4 */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
          <span className="text-brand-800">Re</span>
          <span className="text-accent-500">wards</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
          {t(
            "rewards.subtitle",
            "Every donation creates impact. Earn points, unlock rewards, and be a part of something bigger."
          )}
        </p>
      </div>

      {/* Top Section: Impact Level Banner + Your Stats Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Impact Level Banner */}
        <Card
          padding="lg"
          className="lg:col-span-2 bg-[#FFFDF9] border-amber-200/60 shadow-md relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-neutral-500">
                Your Impact Level
              </span>
              <h2 className="text-3xl font-black text-neutral-900 mt-0.5 flex items-center gap-2">
                <span>{profile?.level || "Community Hero"}</span>
                <span className="text-xl">👑</span>
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                You're making a real difference! Keep going!
              </p>
            </div>

            {/* Rosette Medal Badge from Reference 4 */}
            <div className="w-24 h-24 rounded-full bg-amber-400/20 border-4 border-amber-400 flex items-center justify-center text-amber-500 shadow-md flex-shrink-0">
              <Award className="w-14 h-14 fill-amber-400 stroke-amber-600" />
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-8 space-y-1.5">
            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-800 rounded-full transition-all duration-500"
                style={{ width: `${profile?.levelProgress || 69}%` }}
              />
            </div>
            <div className="flex justify-end text-xs font-bold text-neutral-500">
              {profile?.impactPoints || 3450} / 5,000 points
            </div>
          </div>
        </Card>

        {/* Your Stats 2x2 Grid from Reference 4 */}
        <Card padding="md" className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-900">Your Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Impact points */}
            <div className="p-3 rounded-2xl bg-surface-subtle flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black text-neutral-900">
                  {profile?.impactPoints || 3450}
                </div>
                <div className="text-[10px] text-neutral-500 font-semibold">
                  Impact Points
                </div>
              </div>
            </div>

            {/* Total donations */}
            <div className="p-3 rounded-2xl bg-surface-subtle flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <div className="text-sm font-black text-neutral-900">
                  {profile?.totalDonations || 24}
                </div>
                <div className="text-[10px] text-neutral-500 font-semibold">
                  Total Donations
                </div>
              </div>
            </div>

            {/* Meals Donated */}
            <div className="p-3 rounded-2xl bg-surface-subtle flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black text-neutral-900">
                  {profile?.mealsRescued?.toLocaleString() || "1,240"}
                </div>
                <div className="text-[10px] text-neutral-500 font-semibold">
                  Meals Donated
                </div>
              </div>
            </div>

            {/* Food Waste Saved */}
            <div className="p-3 rounded-2xl bg-surface-subtle flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black text-neutral-900">
                  {profile?.tonsWasteSaved || 12} Tons
                </div>
                <div className="text-[10px] text-neutral-500 font-semibold">
                  Food Waste Saved
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Your Impact Journey Section + Callout Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
        {/* Journey Milestones (3 Cols) */}
        <Card padding="lg" className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">
              {t("rewards.journey", "Your Impact Journey")}
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Current Level: Community Hero
            </span>
          </div>

          {/* Connected Dots Pipeline */}
          <div className="relative pt-6 pb-2">
            <div className="absolute top-11 left-6 right-6 h-0.5 bg-neutral-200 -z-0" />
            <div className="relative flex justify-between z-10 text-center">
              {/* Milestone 1 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-800">Food Friend</div>
                  <div className="text-[10px] text-neutral-400">0 - 1,000 pts</div>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-800">Impact Supporter</div>
                  <div className="text-[10px] text-neutral-400">1,000 - 2,500 pts</div>
                </div>
              </div>

              {/* Milestone 3 (Current) */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md ring-4 ring-amber-100 -mt-0.5">
                  <Award className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-brand-900">Community Hero</div>
                  <div className="text-[10px] font-bold text-amber-600">2,500 - 5,000 pts</div>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-600">Change Maker</div>
                  <div className="text-[10px] text-neutral-400">5,000 - 10,000 pts</div>
                </div>
              </div>

              {/* Milestone 5 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-600">Impact Leader</div>
                  <div className="text-[10px] text-neutral-400">10,000+ pts</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Small Donations Banner (1 Col) matching Reference Image 4 */}
        <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 shadow-sm flex flex-col justify-between h-full space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-3xl">
            🌍
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900">
              Small Donations Create Big Change
            </h4>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Redeem rewards, support shelters, and help us build a hunger-free tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* Redeem Your Rewards Store */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-brand-800 tracking-tight">
            {t("rewards.redeemTitle", "Redeem Your Rewards")}
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-1 rounded-full border border-neutral-200 shadow-2xs text-xs font-bold">
            {["All", "Vouchers", "Experiences", "Perks", "Recognition"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-brand-800 text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Cards Grid matching Reference Image 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredPerks.map((perk) => (
            <Card
              key={perk.id}
              padding="none"
              className="overflow-hidden flex flex-col justify-between border-neutral-200 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all"
            >
              <div>
                {/* Photo with Points Badge */}
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={perk.image}
                    alt={perk.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-brand-900 font-black text-[11px] shadow-sm">
                    {perk.points} Points
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleRedeem(perk.title, perk.points)}
                  className="w-full text-xs"
                >
                  {t("rewards.redeemBtn", "Redeem Now ->")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}