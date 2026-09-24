import {
  Donation,
  Shelter,
  Deal,
  DiversionOffer,
  RewardsProfile,
  ImpactData,
  FeatureFlags,
} from "./types";
import { mockEngine } from "../mock/engine";

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
  process.env.NEXT_PUBLIC_USE_MOCK === undefined;

export const apiClient = {
  // Donations
  async getDonations(): Promise<Donation[]> {
    if (USE_MOCK) return mockEngine.getDonations();
    const res = await fetch("/api/donations");
    return res.json();
  },

  async getDonation(id: string): Promise<Donation | undefined> {
    if (USE_MOCK) return mockEngine.getDonationById(id);
    const res = await fetch(`/api/donations/${id}`);
    return res.json();
  },

  async createDonation(data: Partial<Donation>): Promise<Donation> {
    if (USE_MOCK) return mockEngine.createDonation(data);
    const res = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Shelters
  async getShelters(): Promise<Shelter[]> {
    if (USE_MOCK) return mockEngine.getShelters();
    const res = await fetch("/api/shelters");
    return res.json();
  },

  async updateShelterCapacity(id: string, capacity: number): Promise<void> {
    if (USE_MOCK) return mockEngine.updateShelterCapacity(id, capacity);
    await fetch(`/api/shelters/${id}/capacity`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capacity }),
    });
  },

  async acceptOffer(donationId: string, shelterId: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.acceptShelterOffer(donationId, shelterId);
    const res = await fetch(`/api/donations/${donationId}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shelterId }),
    });
    return res.ok;
  },

  async declineOffer(donationId: string, shelterId: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.declineShelterOffer(donationId, shelterId);
    const res = await fetch(`/api/donations/${donationId}/decline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shelterId }),
    });
    return res.ok;
  },

  // Driver OTPs
  async verifyPickupOtp(donationId: string, otp: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.verifyPickupOtp(donationId, otp);
    const res = await fetch(`/api/donations/${donationId}/verify-pickup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    return res.ok;
  },

  async verifyDeliveryOtp(donationId: string, otp: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.verifyDeliveryOtp(donationId, otp);
    const res = await fetch(`/api/donations/${donationId}/verify-delivery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    return res.ok;
  },

  // Deals
  async getDeals(): Promise<Deal[]> {
    if (USE_MOCK) return mockEngine.getDeals();
    const res = await fetch("/api/deals");
    return res.json();
  },

  async claimDeal(dealId: string, qty: number): Promise<{ success: boolean; otp: string }> {
    if (USE_MOCK) return mockEngine.claimDeal(dealId, qty);
    const res = await fetch(`/api/deals/${dealId}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
    return res.json();
  },

  // Diversion
  async getDiversions(): Promise<DiversionOffer[]> {
    if (USE_MOCK) return mockEngine.getDiversions();
    const res = await fetch("/api/diversions");
    return res.json();
  },

  async completeDiversion(id: string, actualKg: number): Promise<void> {
    if (USE_MOCK) return mockEngine.completeDiversion(id, actualKg);
    await fetch(`/api/diversions/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actualKg }),
    });
  },

  // Impact
  async getImpact(): Promise<ImpactData> {
    if (USE_MOCK) return mockEngine.getImpactData();
    const res = await fetch("/api/impact");
    return res.json();
  },

  // Rewards
  async getRewards(): Promise<RewardsProfile> {
    if (USE_MOCK) return mockEngine.getRewardsProfile();
    const res = await fetch("/api/rewards");
    return res.json();
  },

  // Features
  async getFeatureFlags(): Promise<FeatureFlags> {
    if (USE_MOCK) return mockEngine.getFeatureFlags();
    const res = await fetch("/api/features");
    return res.json();
  },
};
