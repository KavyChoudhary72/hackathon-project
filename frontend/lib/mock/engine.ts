"use client";

import {
  initialDonations,
  initialShelters,
  initialDeals,
  initialDiversions,
  initialRewardsProfile,
  initialImpactData,
  defaultFeatureFlags,
} from "./seed";
import {
  Donation,
  Shelter,
  Deal,
  DiversionOffer,
  RewardsProfile,
  ImpactData,
  FeatureFlags,
} from "../api/types";
import { eventBus } from "../ws/eventBus";

class MockEngine {
  private donations: Donation[] = [];
  private shelters: Shelter[] = [];
  private deals: Deal[] = [];
  private diversions: DiversionOffer[] = [];
  private rewards: RewardsProfile = initialRewardsProfile;
  private impact: ImpactData = initialImpactData;
  private flags: FeatureFlags = defaultFeatureFlags;
  private cascadeTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.reset();
  }

  public reset() {
    this.cascadeTimers.forEach((timer) => clearTimeout(timer));
    this.cascadeTimers.clear();

    this.donations = JSON.parse(JSON.stringify(initialDonations));
    this.shelters = JSON.parse(JSON.stringify(initialShelters));
    this.deals = JSON.parse(JSON.stringify(initialDeals));
    this.diversions = JSON.parse(JSON.stringify(initialDiversions));
    this.rewards = JSON.parse(JSON.stringify(initialRewardsProfile));
    this.impact = JSON.parse(JSON.stringify(initialImpactData));
    this.flags = JSON.parse(JSON.stringify(defaultFeatureFlags));
    eventBus.emit("mock:reset");
  }

  // Donations
  public getDonations(): Donation[] {
    return this.donations;
  }

  public getDonationById(id: string): Donation | undefined {
    return this.donations.find((d) => d.id === id);
  }

  public createDonation(data: Partial<Donation>): Donation {
    const id = `DN${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: Donation = {
      id,
      donorId: data.donorId || "donor_vikas",
      donorName: data.donorName || "Vikas Mehta (ITC Rajputana)",
      foodName: data.foodName || "Assorted Cooked Dishes",
      category: data.category || "COOKED_MEALS",
      quantity: data.quantity || 25,
      unit: data.unit || "meals",
      isVeg: data.isVeg !== undefined ? data.isVeg : true,
      preparedAt: data.preparedAt || new Date().toISOString(),
      safeUntil:
        data.safeUntil ||
        new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      status: "CREATED",
      tier: 1,
      pickupAddress:
        data.pickupAddress || "ITC Rajputana, Station Road, Jaipur",
      pickupLat: 26.9214,
      pickupLng: 75.7925,
      pickupOtp: "5824",
      deliveryOtp: "9142",
      createdAt: new Date().toISOString(),
      image:
        data.image ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      scoreBreakdown: [
        {
          factor: "Proximity (Distance)",
          score: 95,
          weight: 0.35,
          description: "2.1 km to nearest available shelter.",
        },
        {
          factor: "Capacity Match",
          score: 98,
          weight: 0.35,
          description: "Capacity exactly matches surplus lot.",
        },
        {
          factor: "Acceptance Record",
          score: 96,
          weight: 0.15,
          description: "High priority verified shelter partner.",
        },
        {
          factor: "Safety Window",
          score: 90,
          weight: 0.15,
          description: "4-hour consumption window remaining.",
        },
      ],
      filteredOutShelters: [
        {
          shelterId: "shelter_seva",
          name: "Seva Ghar (C-Scheme)",
          reason: "Night capacity full (0 seats available).",
          distanceKm: 3.4,
        },
        {
          shelterId: "shelter_balika",
          name: "Balika Ashram (Raja Park)",
          reason: "Distance exceeds optimal safety travel radius (7.8 km).",
          distanceKm: 7.8,
        },
      ],
      cascadeTimerSeconds: 30,
    };

    this.donations.unshift(newDonation);
    eventBus.emit("donation:created", newDonation);

    // Auto-match to first shelter after brief delay
    setTimeout(() => {
      newDonation.status = "MATCHED";
      newDonation.shelterId = this.shelters[0].id;
      newDonation.shelterName = this.shelters[0].name;
      newDonation.shelterAddress = this.shelters[0].address;
      newDonation.shelterLat = this.shelters[0].lat;
      newDonation.shelterLng = this.shelters[0].lng;
      eventBus.emit("shelter:matched", newDonation);
    }, 1500);

    return newDonation;
  }

  public acceptShelterOffer(donationId: string, shelterId: string): boolean {
    const donation = this.donations.find((d) => d.id === donationId);
    if (!donation) return false;

    donation.status = "DRIVER_ASSIGNED";
    donation.driverId = "driver_ramesh";
    donation.driverName = "Ramesh Kumar (Bike)";
    donation.driverPhone = "+91 98290 44521";
    donation.driverEtaMinutes = 20;
    donation.driverLat = 26.924;
    donation.driverLng = 75.791;

    // Deduct shelter capacity
    const shelter = this.shelters.find((s) => s.id === shelterId);
    if (shelter) {
      shelter.availableCapacity = Math.max(
        0,
        shelter.availableCapacity - donation.quantity
      );
    }

    eventBus.emit("driver:assigned", donation);
    eventBus.emit("shelter:updated", shelter);
    return true;
  }

  public declineShelterOffer(donationId: string, shelterId: string): boolean {
    const donation = this.donations.find((d) => d.id === donationId);
    if (!donation) return false;

    // Cascade to next shelter
    if (this.shelters.length > 1) {
      const nextShelter = this.shelters.find((s) => s.id !== shelterId);
      if (nextShelter) {
        donation.shelterId = nextShelter.id;
        donation.shelterName = nextShelter.name;
        donation.shelterAddress = nextShelter.address;
        eventBus.emit("cascade:timeout", {
          donationId,
          previousShelterId: shelterId,
          newShelter: nextShelter,
        });
        return true;
      }
    }

    // Otherwise escalate to Tier 2 Rescue Deals
    donation.tier = 2;
    donation.status = "ESCALATED_TIER2";
    eventBus.emit("cascade:escalated", { donationId, tier: 2 });
    return true;
  }

  public verifyPickupOtp(donationId: string, otp: string): boolean {
    const donation = this.donations.find((d) => d.id === donationId);
    if (!donation) return false;
    if (donation.pickupOtp !== otp.trim()) return false;

    donation.status = "IN_TRANSIT";
    eventBus.emit("donation:in_transit", donation);
    return true;
  }

  public verifyDeliveryOtp(donationId: string, otp: string): boolean {
    const donation = this.donations.find((d) => d.id === donationId);
    if (!donation) return false;
    if (donation.deliveryOtp !== otp.trim()) return false;

    donation.status = "DELIVERED";
    const pointsGained = 150;
    donation.pointsEarned = pointsGained;

    // Update impact & rewards
    this.rewards.impactPoints += pointsGained;
    this.rewards.totalDonations += 1;
    this.rewards.mealsRescued += donation.quantity;
    this.rewards.peopleHelped += Math.round(donation.quantity * 0.8);
    this.rewards.tonsWasteSaved += Math.round((donation.quantity * 0.42) / 1000 * 10) / 10;

    // Update global impact
    this.impact.humanMeals += donation.quantity;
    this.impact.totalKgDiverted += Math.round(donation.quantity * 0.42);
    this.impact.co2eKgPrevented += Math.round(donation.quantity * 0.42 * 2.5);

    eventBus.emit("donation:delivered", donation);
    eventBus.emit("rewards:updated", this.rewards);
    eventBus.emit("impact:updated", this.impact);
    eventBus.emit("toast:celebration", {
      title: "Delivery Verified!",
      message: `+${pointsGained} Points Earned! You are a Community Hero.`,
    });
    return true;
  }

  // Shelters
  public getShelters(): Shelter[] {
    return this.shelters;
  }

  public updateShelterCapacity(id: string, newCapacity: number) {
    const s = this.shelters.find((item) => item.id === id);
    if (s) {
      s.capacityTonight = newCapacity;
      s.availableCapacity = newCapacity;
      eventBus.emit("shelter:updated", s);
    }
  }

  // Deals
  public getDeals(): Deal[] {
    return this.deals;
  }

  public claimDeal(dealId: string, quantity: number): { success: boolean; otp: string } {
    const deal = this.deals.find((d) => d.id === dealId);
    if (!deal || deal.quantityRemaining < quantity) {
      return { success: false, otp: "" };
    }
    deal.quantityRemaining -= quantity;
    this.impact.rescueDealMeals += quantity;
    const claimOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    eventBus.emit("deal:claimed", { dealId, quantity, otp: claimOtp });
    return { success: true, otp: claimOtp };
  }

  // Diversion
  public getDiversions(): DiversionOffer[] {
    return this.diversions;
  }

  public completeDiversion(id: string, actualKg: number) {
    const div = this.diversions.find((d) => d.id === id);
    if (div) {
      div.actualKg = actualKg;
      div.status = "COMPLETED";
      this.impact.nonHumanKg += actualKg;
      this.impact.totalKgDiverted += actualKg;
      this.impact.co2eKgPrevented += Math.round(actualKg * 2.5);
      eventBus.emit("diversion:completed", div);
      eventBus.emit("impact:updated", this.impact);
    }
  }

  // Rewards
  public getRewardsProfile(): RewardsProfile {
    return this.rewards;
  }

  public getImpactData(): ImpactData {
    return this.impact;
  }

  public getFeatureFlags(): FeatureFlags {
    return this.flags;
  }
}

export const mockEngine = new MockEngine();
