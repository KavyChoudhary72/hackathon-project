"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Users,
  HeartHandshake,
  Star,
  Plus,
  ArrowRight,
  MapPin,
  FileText,
  Gift,
  Check,
  Truck,
  Flag,
  MoreHorizontal,
  Home,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { apiClient } from "@/lib/api/client";
import { Donation, RewardsProfile } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n";
import { useLiveEvents } from "@/lib/ws/eventBus";
import { formatDate } from "@/lib/utils";

export default function DonorDashboardPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [rewards, setRewards] = useState<RewardsProfile | null>(null);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);

  const loadData = async () => {
    const list = await apiClient.getDonations();
    setDonations(list);
    const inProgress = list.find(
      (d) => d.status !== "DELIVERED" && d.status !== "CANCELLED" && d.status !== "EXPIRED"
    );
    setCurrentDonation(inProgress || list[0]);
    const r = await apiClient.getRewards();
    setRewards(r);
  };

  useEffect(() => {
    loadData();
  }, []);

  useLiveEvents("donation:created", loadData);
  useLiveEvents("driver:assigned", loadData);
  useLiveEvents("donation:delivered", loadData);
  useLiveEvents("rewards:updated", loadData);

  return (
    <div className="space-y-8">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-neutral-500 mb-1">
            {t("donor.greeting", "Good to see you again 👋")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-800 tracking-tight">
            Welcome back, <span className="text-accent-500">Donor.</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {t("donor.subWelcome", "Your contributions are making a real difference.")}
          </p>
        </div>

        <Link href="/donor/new">
          <Button
            size="lg"
            variant="primary"
            leftIcon={<Plus className="w-5 h-5" />}
            className="rounded-full shadow-md"
          >
            {t("donor.newDonation", "+ New Donation")}
          </Button>
        </Link>
      </div>

      {/* 4 KPI Metrics Row from Reference Image 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Donations */}
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500">
              {t("donor.totalDonations", "Total Donations")}
            </div>
            <div className="text-2xl font-black text-neutral-900 mt-0.5">
              {rewards?.totalDonations || 24}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span>↗ +12%</span>
              <span className="text-neutral-400 font-normal">vs last month</span>
            </div>
          </div>
        </Card>

        {/* Meals Rescued */}
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500">
              {t("donor.mealsRescued", "Meals Rescued")}
            </div>
            <div className="text-2xl font-black text-neutral-900 mt-0.5">
              {rewards?.mealsRescued?.toLocaleString() || "1,240"}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span>↗ +18%</span>
              <span className="text-neutral-400 font-normal">vs last month</span>
            </div>
          </div>
        </Card>

        {/* People Helped */}
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500">
              {t("donor.peopleHelped", "People Helped")}
            </div>
            <div className="text-2xl font-black text-neutral-900 mt-0.5">
              {rewards?.peopleHelped?.toLocaleString() || "860"}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span>↗ +15%</span>
              <span className="text-neutral-400 font-normal">vs last month</span>
            </div>
          </div>
        </Card>

        {/* Impact Points */}
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-accent-500 flex-shrink-0">
            <Star className="w-6 h-6 fill-accent-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500">
              {t("donor.impactPoints", "Impact Points")}
            </div>
            <div className="text-2xl font-black text-neutral-900 mt-0.5">
              {rewards?.impactPoints?.toLocaleString() || "3,450"}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span>↗ +22%</span>
              <span className="text-neutral-400 font-normal">vs last month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Left Column (Current Tracker + Table) & Right Column (Level + Actions + Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Donation Live Stepper Card */}
          {currentDonation && (
            <Card padding="lg" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900">
                    {t("donor.currentDonation", "Current Donation")}
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{t("donor.inProgress", "In Progress")}</span>
                  </span>
                </div>
                <Link
                  href={`/donor/donations/${currentDonation.id}`}
                  className="text-xs font-bold text-neutral-400 hover:text-brand-800 transition-colors flex items-center gap-1"
                >
                  <span>#{currentDonation.id}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 4-Step Stepper Pipeline */}
              <div className="relative pt-2 pb-1">
                <div className="absolute top-5 left-6 right-6 h-0.5 bg-neutral-200 -z-0" />
                <div className="relative flex justify-between z-10 text-center">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-800 max-w-[70px]">
                      Donation Created
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-800 max-w-[70px]">
                      Shelter Matched
                    </span>
                  </div>

                  {/* Step 3 (Active Driver) */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-black text-brand-900 max-w-[70px]">
                      Driver Assigned
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-neutral-200 text-neutral-400 flex items-center justify-center">
                      <Flag className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-neutral-400 max-w-[70px]">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Inline Delivery Detail Banner */}
              <div className="bg-surface-subtle p-4 rounded-2xl border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xs flex-shrink-0">
                    <img
                      src={currentDonation.image}
                      alt={currentDonation.foodName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      {currentDonation.foodName}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {currentDonation.quantity} {currentDonation.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="text-left">
                    <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-accent-500" />
                      <span>{currentDonation.shelterName || "Hope Shelter"}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Jaipur, Rajasthan
                    </div>
                  </div>

                  <Link href={`/donor/donations/${currentDonation.id}`}>
                    <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Track Live
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Donations Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-6 pb-4 flex items-center justify-between border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {t("donor.recentDonations", "Recent Donations")}
              </h3>
              <Link
                href="/donor"
                className="text-xs font-bold text-neutral-500 hover:text-brand-800 transition-colors"
              >
                {t("common.viewAll", "See All")}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-6">Donation ID</th>
                    <th className="py-3 px-4">Food</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Shelter</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {donations.map((d) => (
                    <tr
                      key={d.id}
                      onClick={() => router.push(`/donor/donations/${d.id}`)}
                      className="hover:bg-neutral-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-6 font-bold text-neutral-900">
                        #{d.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={d.image}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="font-semibold text-neutral-900 truncate max-w-[140px]">
                            {d.foodName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {d.quantity} {d.unit}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-600">
                        {d.shelterName || "Hope Shelter"}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">
                        {formatDate(d.createdAt)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button className="p-1 rounded-lg hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Your Impact Level Card matching Reference Image 2 & 4 */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-500">
                  {t("donor.yourImpactLevel", "Your Impact Level")}
                </span>
                <h3 className="text-xl font-black text-neutral-900 mt-0.5">
                  {rewards?.level || "Community Hero"}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shadow-sm border border-amber-200">
                <Award className="w-7 h-7" />
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-800 rounded-full transition-all duration-500"
                  style={{ width: `${rewards?.levelProgress || 69}%` }}
                />
              </div>
              <div className="flex justify-end text-[10px] font-bold text-neutral-500 mt-1">
                {rewards?.impactPoints || 3450} / 5,000 points
              </div>
            </div>

            {/* Badges Row */}
            <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
              <div className="flex gap-2">
                {rewards?.badges.map((b) => (
                  <div
                    key={b.id}
                    title={b.title}
                    className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-xs shadow-2xs hover:scale-110 transition-transform"
                  >
                    <span>{b.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/rewards" className="block pt-1">
              <Button size="md" variant="secondary" className="w-full">
                {t("donor.viewRewards", "View Rewards ->")}
              </Button>
            </Link>
          </Card>

          {/* Quick Actions 2x2 Grid */}
          <Card padding="md" className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              {t("donor.quickActions", "Quick Actions")}
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/donor/new">
                <div className="p-3.5 rounded-2xl bg-surface-subtle border border-neutral-200/60 hover:bg-brand-50 hover:border-brand-200 transition-all text-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-brand-800 text-white flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-brand-800">
                    New Donation
                  </span>
                </div>
              </Link>

              <Link href="/shelter">
                <div className="p-3.5 rounded-2xl bg-surface-subtle border border-neutral-200/60 hover:bg-brand-50 hover:border-brand-200 transition-all text-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-brand-800">
                    Nearby Shelters
                  </span>
                </div>
              </Link>

              <Link href="/admin/impact">
                <div className="p-3.5 rounded-2xl bg-surface-subtle border border-neutral-200/60 hover:bg-brand-50 hover:border-brand-200 transition-all text-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4 text-brand-800" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-brand-800">
                    Impact Report
                  </span>
                </div>
              </Link>

              <Link href="/rewards">
                <div className="p-3.5 rounded-2xl bg-surface-subtle border border-neutral-200/60 hover:bg-brand-50 hover:border-brand-200 transition-all text-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <Gift className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-brand-800">
                    Redeem Perks
                  </span>
                </div>
              </Link>
            </div>
          </Card>

          {/* Small Donations Banner matching bottom right in Reference Image 2 */}
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-accent-500 flex-shrink-0">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-neutral-900">
                {t("donor.smallDonationsTitle", "Small Donations Create Big Change")}
              </h5>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                {t("donor.smallDonationsDesc", "Together, we can ensure no good food goes to waste.")}
              </p>
            </div>
            <Link
              href="/donor/new"
              className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 flex-shrink-0 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
