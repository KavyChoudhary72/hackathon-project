import {
  Donation,
  DonationStatus,
  Shelter,
  Deal,
  DiversionOffer,
  RewardsProfile,
  ImpactData,
  FeatureFlags,
  VisionParseResult,
  PlatformRules,
  OrganizationVerification,
} from "./types";
import { mockEngine } from "../mock/engine";

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
  process.env.NEXT_PUBLIC_USE_MOCK === undefined;

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("foodlink_jwt_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const apiClient = {
  // Donations
  async getDonations(): Promise<Donation[]> {
    if (USE_MOCK) return mockEngine.getDonations();
    const res = await fetch("/api/donations", { headers: getAuthHeaders() });
    return res.json();
  },

  async getDonation(id: string): Promise<Donation | undefined> {
    if (USE_MOCK) return mockEngine.getDonationById(id);
    const res = await fetch(`/api/donations/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async createDonation(data: Partial<Donation>): Promise<Donation> {
    if (USE_MOCK) return mockEngine.createDonation(data);
    const res = await fetch("/api/donations", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Shelters
  async getShelters(): Promise<Shelter[]> {
    if (USE_MOCK) return mockEngine.getShelters();
    const res = await fetch("/api/shelters", { headers: getAuthHeaders() });
    return res.json();
  },

  async updateShelterCapacity(id: string, capacity: number): Promise<void> {
    if (USE_MOCK) return mockEngine.updateShelterCapacity(id, capacity);
    await fetch(`/api/shelters/${id}/capacity`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ capacity }),
    });
  },

  async acceptOffer(donationId: string, shelterId: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.acceptShelterOffer(donationId, shelterId);
    const res = await fetch(`/api/donations/${donationId}/accept`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ shelterId }),
    });
    return res.ok;
  },

  async declineOffer(donationId: string, shelterId: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.declineShelterOffer(donationId, shelterId);
    const res = await fetch(`/api/donations/${donationId}/decline`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ shelterId }),
    });
    return res.ok;
  },

  // Driver OTPs
  async verifyPickupOtp(donationId: string, otp: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.verifyPickupOtp(donationId, otp);
    const res = await fetch(`/api/donations/${donationId}/verify-pickup`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ otp }),
    });
    return res.ok;
  },

  async verifyDeliveryOtp(donationId: string, otp: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.verifyDeliveryOtp(donationId, otp);
    const res = await fetch(`/api/donations/${donationId}/verify-delivery`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ otp }),
    });
    return res.ok;
  },

  // Deals
  async getDeals(): Promise<Deal[]> {
    if (USE_MOCK) return mockEngine.getDeals();
    const res = await fetch("/api/deals", { headers: getAuthHeaders() });
    return res.json();
  },

  async claimDeal(dealId: string, qty: number): Promise<{ success: boolean; otp: string }> {
    if (USE_MOCK) return mockEngine.claimDeal(dealId, qty);
    const res = await fetch(`/api/deals/${dealId}/claim`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity: qty }),
    });
    return res.json();
  },

  // Diversion
  async getDiversions(): Promise<DiversionOffer[]> {
    if (USE_MOCK) return mockEngine.getDiversions();
    const res = await fetch("/api/diversions", { headers: getAuthHeaders() });
    return res.json();
  },

  async completeDiversion(id: string, actualKg: number): Promise<void> {
    if (USE_MOCK) return mockEngine.completeDiversion(id, actualKg);
    await fetch(`/api/diversions/${id}/complete`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ actualKg }),
    });
  },

  // Impact
  async getImpact(): Promise<ImpactData> {
    if (USE_MOCK) return mockEngine.getImpactData();
    const res = await fetch("/api/impact", { headers: getAuthHeaders() });
    return res.json();
  },

  // Rewards
  async getRewards(): Promise<RewardsProfile> {
    if (USE_MOCK) return mockEngine.getRewardsProfile();
    const res = await fetch("/api/rewards", { headers: getAuthHeaders() });
    return res.json();
  },

  // Features
  async getFeatureFlags(): Promise<FeatureFlags> {
    if (USE_MOCK) return mockEngine.getFeatureFlags();
    const res = await fetch("/api/features", { headers: getAuthHeaders() });
    return res.json();
  },

  // Vision AI Photo Parsing
  async parsePhoto(payload: {
    photoUrl?: string;
    imageBase64?: string;
    presetId?: string;
  }): Promise<{ success: boolean; data: VisionParseResult }> {
    const mockMap: Record<string, VisionParseResult> = {
      dal_rice_trays: {
        food_name: "Dal Makhani & Steamed Basmati Rice",
        category: "Cooked",
        is_veg: true,
        quantity_estimate: 50,
        unit: "Meals",
        safe_window_minutes: 180,
        safe_until_suggestion: "+3 hr",
        confidence: 0.96,
        containers: [
          { container_type: "Deep Catering Tray (GN 1/1)", item_name: "Steamed Basmati Rice", count: 1, estimated_meals: 25 },
          { container_type: "Deep Catering Tray (GN 1/1)", item_name: "Dal Makhani", count: 1, estimated_meals: 25 }
        ],
        note: "Vision model identified 2 standard full-size catering trays (GN 1/1). Estimated 50 portions."
      },
      roti_paneer_pack: {
        food_name: "Tandoori Roti Stack with Shahi Paneer Gravy",
        category: "Cooked",
        is_veg: true,
        quantity_estimate: 35,
        unit: "Meals",
        safe_window_minutes: 180,
        safe_until_suggestion: "+3 hr",
        confidence: 0.93,
        containers: [
          { container_type: "Foil Wrapped Casserole", item_name: "Tandoori Roti (40 pcs)", count: 1, estimated_meals: 20 },
          { container_type: "Stainless Donga / Pot", item_name: "Shahi Paneer", count: 1, estimated_meals: 15 }
        ],
        note: "Detected foil-wrapped bread pack (~40 rotis) + 1 medium curry donga."
      },
      biryani_handi: {
        food_name: "Dum Biryani with Mirchi Salan & Raita",
        category: "Cooked",
        is_veg: false,
        quantity_estimate: 40,
        unit: "Meals",
        safe_window_minutes: 120,
        safe_until_suggestion: "+2 hr",
        confidence: 0.95,
        containers: [
          { container_type: "Large Sealed Handi / Degchi", item_name: "Dum Biryani", count: 1, estimated_meals: 40 }
        ],
        note: "Identified large commercial banquet handi (~16 kg gross). Estimated 40 individual servings."
      },
      bakery_assortment: {
        food_name: "Fresh Bakery Bread Buns & Veg Patties",
        category: "Bakery",
        is_veg: true,
        quantity_estimate: 30,
        unit: "Meals",
        safe_window_minutes: 300,
        safe_until_suggestion: "+4 hr",
        confidence: 0.91,
        containers: [
          { container_type: "Bakery Crates / Boxes", item_name: "Buns & Savory Pastries", count: 3, estimated_meals: 30 }
        ],
        note: "Recognized 3 corrugated bakery delivery boxes with evening batch bread & buns."
      }
    };

    if (USE_MOCK || payload.presetId) {
      const selected = (payload.presetId && mockMap[payload.presetId]) || mockMap.dal_rice_trays;
      return { success: true, data: selected };
    }

    try {
      const res = await fetch("/api/ai/parse-photo", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          photo_url: payload.photoUrl,
          image_base64: payload.imageBase64,
          preset_id: payload.presetId,
        }),
      });
      if (res.ok) {
        return res.json();
      }
    } catch {
      // Fallback
    }

    const selected = (payload.presetId && mockMap[payload.presetId]) || mockMap.dal_rice_trays;
    return { success: true, data: selected };
  },

  // Super Admin Platform Rules
  async getPlatformRules(): Promise<PlatformRules> {
    if (USE_MOCK) return mockEngine.getPlatformRules();
    try {
      const res = await fetch("/api/rewards/rules", { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data?.rules || mockEngine.getPlatformRules();
      }
    } catch {}
    return mockEngine.getPlatformRules();
  },

  async updatePlatformRules(rules: Partial<PlatformRules>): Promise<PlatformRules> {
    if (USE_MOCK) return mockEngine.updatePlatformRules(rules);
    try {
      const res = await fetch("/api/rewards/rules", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(rules),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || mockEngine.updatePlatformRules(rules);
      }
    } catch {}
    return mockEngine.updatePlatformRules(rules);
  },

  // Super Admin Verifications
  async getVerifications(): Promise<OrganizationVerification[]> {
    if (USE_MOCK) return mockEngine.getVerifications();
    return mockEngine.getVerifications();
  },

  async updateVerification(
    id: string,
    status: "VERIFIED" | "PENDING_REVIEW" | "SUSPENDED",
    notes?: string
  ): Promise<boolean> {
    if (USE_MOCK) return mockEngine.updateVerification(id, status, notes);
    return mockEngine.updateVerification(id, status, notes);
  },

  // Super Admin Donation Overrides
  async overrideDonationShelter(donationId: string, shelterId: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.overrideDonationShelter(donationId, shelterId);
    return mockEngine.overrideDonationShelter(donationId, shelterId);
  },

  async forceDonationStatus(donationId: string, status: DonationStatus): Promise<boolean> {
    if (USE_MOCK) return mockEngine.forceDonationStatus(donationId, status);
    return mockEngine.forceDonationStatus(donationId, status);
  },

  async cancelDonation(donationId: string, reason?: string): Promise<boolean> {
    if (USE_MOCK) return mockEngine.cancelDonation(donationId, reason);
    return mockEngine.cancelDonation(donationId, reason);
  },
};
