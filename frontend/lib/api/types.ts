export type DonationStatus =
  | "CREATED"
  | "MATCHED"
  | "DRIVER_ASSIGNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "EXPIRED"
  | "ESCALATED_TIER2"
  | "ESCALATED_TIER3";

export type TierType = 1 | 2 | 3;

export type FoodCategory =
  | "COOKED_MEALS"
  | "RAW_PRODUCE"
  | "PACKAGED"
  | "BAKERY"
  | "DAIRY";

export type DietaryType = "VEG" | "NON_VEG";

export interface ScoreFactor {
  factor: string;
  score: number; // 0-100
  weight: number; // 0.0 - 1.0
  description: string;
}

export interface FilteredOutShelter {
  shelterId: string;
  name: string;
  reason: string;
  distanceKm: number;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  foodName: string;
  category: FoodCategory;
  quantity: number;
  unit: "meals" | "kg";
  isVeg: boolean;
  preparedAt: string;
  safeUntil: string;
  status: DonationStatus;
  tier: TierType;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  shelterId?: string;
  shelterName?: string;
  shelterAddress?: string;
  shelterLat?: number;
  shelterLng?: number;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverEtaMinutes?: number;
  driverLat?: number;
  driverLng?: number;
  pickupOtp: string;
  deliveryOtp: string;
  createdAt: string;
  image?: string;
  scoreBreakdown?: ScoreFactor[];
  filteredOutShelters?: FilteredOutShelter[];
  cascadeTimerSeconds?: number;
  pointsEarned?: number;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  capacityTonight: number;
  availableCapacity: number;
  historicalAcceptanceRate: number; // percentage
  distanceKm?: number;
}

export interface DriverTask {
  id: string;
  donationId: string;
  donorName: string;
  donorPhone: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  shelterName: string;
  shelterPhone: string;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  foodSummary: string;
  status: DonationStatus;
  pickupOtpRequired: boolean;
  deliveryOtpRequired: boolean;
}

export interface Deal {
  id: string;
  donationId: string;
  donorName: string;
  foodTitle: string;
  originalPrice: number;
  dealPrice: number;
  quantityRemaining: number;
  unit: string;
  safeUntil: string;
  pickupAddress: string;
  distanceKm: number;
  image: string;
  donorPhone: string;
}

export interface DiversionOffer {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerType: "GAUSHALA" | "BIOGAS";
  donorName: string;
  foodType: string;
  estimatedKg: number;
  actualKg?: number;
  status: "OFFERED" | "ACCEPTED" | "COMPLETED";
  pickupAddress: string;
  createdAt: string;
}

export type RewardLevelName =
  | "Food Friend"
  | "Impact Supporter"
  | "Community Hero"
  | "Change Maker"
  | "Impact Leader";

export interface RewardBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface RewardsProfile {
  donorId: string;
  donorName: string;
  impactPoints: number;
  level: RewardLevelName;
  levelProgress: number; // 0-100%
  pointsToNextLevel: number;
  totalDonations: number;
  mealsRescued: number;
  peopleHelped: number;
  tonsWasteSaved: number;
  badges: RewardBadge[];
}

export interface ImpactData {
  humanMeals: number;
  rescueDealMeals: number;
  nonHumanKg: number;
  totalKgDiverted: number;
  co2eKgPrevented: number;
  totalDonors: number;
  sheltersConnected: number;
  mealsTrend: number;
  co2Trend: number;
}

export interface FeatureFlags {
  dealsEnabled: boolean;
  diversionEnabled: boolean;
  rewardsEnabled: boolean;
  qualityReportsEnabled: boolean;
  aiPhotoEnabled: boolean;
}

export interface VisionContainerItem {
  container_type: string;
  item_name: string;
  count: number;
  estimated_meals: number;
}

export interface VisionParseResult {
  food_name: string;
  category: string;
  is_veg: boolean;
  quantity_estimate: number;
  unit: string;
  safe_window_minutes: number;
  safe_until_suggestion: string;
  confidence: number;
  containers: VisionContainerItem[];
  note: string;
}

export interface PlatformRules {
  pointsPerMeal: number; // default: 10
  photoBonus: number; // default: 25
  earlyPostBonus: number; // default: 50
  streakBonus: number; // default: 100
  maxRadiusKm: number; // default: 20
  spoilageThresholdMin: number; // default: 240
  cascadeTimeoutSec: number; // default: 30
  rescueDealDiscountCap: number; // default: 50
}

export interface OrganizationVerification {
  id: string;
  name: string;
  type: "DONOR" | "SHELTER";
  fssaiNumber: string;
  contactPerson: string;
  phone: string;
  address: string;
  capacityOrSurplus: string;
  safetyScore: number;
  status: "VERIFIED" | "PENDING_REVIEW" | "SUSPENDED";
  registeredAt: string;
  notes?: string;
}


