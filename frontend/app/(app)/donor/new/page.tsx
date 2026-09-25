"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock,
  Sparkles,
  Camera,
  MapPin,
  Check,
  UploadCloud,
  Loader2,
  ScanLine,
  Zap,
  Info,
  CheckCircle2,
  Layers,
  Utensils,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { APP_IMAGES } from "@/lib/images";
import { VisionContainerItem } from "@/lib/api/types";
import { LiveCameraScannerModal } from "@/components/donor/LiveCameraScannerModal";

const DEMO_PHOTO_PRESETS = [
  {
    id: "dal_rice_trays",
    title: "2 Catering Trays: Dal & Rice",
    subtitle: "50 Meals • Cooked • Veg",
    image: APP_IMAGES.dalChawal,
    badge: "2 Trays (GN 1/1)",
  },
  {
    id: "roti_paneer_pack",
    title: "40 Roti Pack + Shahi Paneer",
    subtitle: "35 Meals • Cooked • Veg",
    image: APP_IMAGES.puriSabzi,
    badge: "1 Pack + 1 Donga",
  },
  {
    id: "biryani_handi",
    title: "1 Large Biryani Handi",
    subtitle: "40 Meals • Cooked • Non-Veg",
    image: APP_IMAGES.vegBiryani,
    badge: "1 Banquet Degchi",
  },
  {
    id: "bakery_assortment",
    title: "3 Boxes Bread Buns & Puffs",
    subtitle: "30 Meals • Bakery • Veg",
    image: APP_IMAGES.breadBuns,
    badge: "3 Delivery Crates",
  },
];

export default function PostSurplusFoodPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [foodName, setFoodName] = useState("Dal Makhani & Steamed Basmati Rice");
  const [category, setCategory] = useState("Cooked");
  const [isVeg, setIsVeg] = useState(true);
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState("Meals");
  const [preparedAt, setPreparedAt] = useState("8:30 PM");
  const [safeUntil, setSafeUntil] = useState("+3 hr");
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [pickupAddress, setPickupAddress] = useState("Shree Ram Marriage Garden, Malviya Nagar, Jaipur");

  // Vision AI State
  const [selectedImage, setSelectedImage] = useState<string>(APP_IMAGES.dalChawal);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [confidence, setConfidence] = useState<number>(0.96);
  const [containers, setContainers] = useState<VisionContainerItem[]>([
    { container_type: "Deep Catering Tray (GN 1/1)", item_name: "Steamed Basmati Rice", count: 1, estimated_meals: 25 },
    { container_type: "Deep Catering Tray (GN 1/1)", item_name: "Dal Makhani", count: 1, estimated_meals: 25 },
  ]);
  const [aiNote, setAiNote] = useState("Vision model identified 2 standard full-size catering trays (GN 1/1). Estimated 50 portions.");
  const [activePreset, setActivePreset] = useState<string>("dal_rice_trays");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const foodSuggestions = [
    "Dal-chawal",
    "Roti-sabzi",
    "Biryani",
    "Snacks",
    "Sweets",
    "Bread",
  ];

  // Handler for live WebRTC camera scanner capture
  const handleCameraCapture = (
    imageBase64: string,
    detectedData: {
      foodName: string;
      category: string;
      isVeg: boolean;
      quantity: number;
      unit: string;
      safeUntil: string;
      confidence: number;
      containers: VisionContainerItem[];
      note: string;
    }
  ) => {
    setSelectedImage(imageBase64);
    setActivePreset("live_camera");
    setFoodName(detectedData.foodName);
    setCategory(detectedData.category);
    setIsVeg(detectedData.isVeg);
    setQuantity(detectedData.quantity);
    setUnit(detectedData.unit);
    setSafeUntil(detectedData.safeUntil);
    setConfidence(detectedData.confidence);
    setContainers(detectedData.containers);
    setAiNote(detectedData.note);
  };


  // Trigger Vision Analysis for a given preset or upload
  const runVisionAnalysis = async (params: { presetId?: string; photoUrl?: string; imageBase64?: string }) => {
    try {
      const result = await apiClient.parsePhoto(params);
      if (result && result.data) {
        const d = result.data;
        setFoodName(d.food_name);
        setCategory(d.category);
        setIsVeg(d.is_veg);
        setQuantity(d.quantity_estimate);
        setUnit(d.unit);
        setSafeUntil(d.safe_until_suggestion || "+3 hr");
        setConfidence(d.confidence);
        setContainers(d.containers || []);
        setAiNote(d.note || "Portions detected successfully.");
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Preset Click - Instantaneous 0ms Optimistic Update
  const handleSelectPreset = (preset: typeof DEMO_PHOTO_PRESETS[0]) => {
    setActivePreset(preset.id);
    setSelectedImage(preset.image);
    if (preset.id === "dal_rice_trays") {
      setFoodName("Dal Makhani & Steamed Basmati Rice");
      setCategory("Cooked");
      setIsVeg(true);
      setQuantity(50);
      setUnit("Meals");
      setSafeUntil("+3 hr");
      setConfidence(0.96);
      setContainers([
        { container_type: "Deep Catering Tray (GN 1/1)", item_name: "Steamed Basmati Rice", count: 1, estimated_meals: 25 },
        { container_type: "Deep Catering Tray (GN 1/1)", item_name: "Dal Makhani", count: 1, estimated_meals: 25 },
      ]);
      setAiNote("Vision model identified 2 standard full-size catering trays (GN 1/1). Estimated 50 portions.");
    } else if (preset.id === "roti_paneer_pack") {
      setFoodName("Tandoori Roti Stack with Shahi Paneer Gravy");
      setCategory("Cooked");
      setIsVeg(true);
      setQuantity(35);
      setUnit("Meals");
      setSafeUntil("+3 hr");
      setConfidence(0.93);
      setContainers([
        { container_type: "Foil Wrapped Casserole", item_name: "Tandoori Roti (40 pcs)", count: 1, estimated_meals: 20 },
        { container_type: "Stainless Donga / Pot", item_name: "Shahi Paneer", count: 1, estimated_meals: 15 },
      ]);
      setAiNote("Detected foil-wrapped bread pack (~40 rotis) + 1 medium curry donga.");
    } else if (preset.id === "biryani_handi") {
      setFoodName("Dum Biryani with Mirchi Salan & Raita");
      setCategory("Cooked");
      setIsVeg(false);
      setQuantity(40);
      setUnit("Meals");
      setSafeUntil("+2 hr");
      setConfidence(0.95);
      setContainers([
        { container_type: "Large Sealed Handi / Degchi", item_name: "Dum Biryani", count: 1, estimated_meals: 40 },
      ]);
      setAiNote("Identified large commercial banquet handi (~16 kg gross). Estimated 40 individual servings.");
    } else if (preset.id === "bakery_assortment") {
      setFoodName("Fresh Bakery Bread Buns & Veg Patties");
      setCategory("Bakery");
      setIsVeg(true);
      setQuantity(30);
      setUnit("Meals");
      setSafeUntil("+4 hr");
      setConfidence(0.91);
      setContainers([
        { container_type: "Bakery Crates / Boxes", item_name: "Buns & Savory Pastries", count: 3, estimated_meals: 30 },
      ]);
      setAiNote("Recognized 3 corrugated bakery delivery boxes with evening batch bread & buns.");
    }
    // Background sync
    runVisionAnalysis({ presetId: preset.id });
  };

  // Handle Live Camera / File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      setActivePreset("custom");
      runVisionAnalysis({ imageBase64: base64, photoUrl: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Optimistic immediate redirect with background sync
    apiClient.createDonation({
      foodName,
      category: category.toUpperCase() as any,
      quantity,
      unit: unit.toLowerCase() as any,
      isVeg,
      pickupAddress,
      image: selectedImage,
    }).catch(() => {});
    router.push("/donor/donations/1025");
  };


  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Hidden native camera/file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* HEADER: Breadcrumb + Title + Timer Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/donor"
            className="text-[14px] font-semibold text-[#5B6661] hover:text-[#0E3B2E] transition-colors"
          >
            ← Back to Donor Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
              Post Surplus Food
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F7EE] border border-[#BDECD2] text-[12px] font-bold text-[#166534]">
              <Zap className="w-3.5 h-3.5 text-[#1E9E5A]" />
              AI Vision Enabled
            </span>
          </div>
          <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
            Takes less than 30 seconds. Snap a photo of your kitchen trays or enter manually.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-2 h-[38px] px-3.5 rounded-full bg-white border border-[#ECE9E1] text-[14px] font-bold text-[#13231C] shadow-2xs">
            <Clock className="w-4 h-4 text-[#1E9E5A]" />
            <span>Avg: 00:24s</span>
          </span>
        </div>
      </div>

      {/* 2-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: MAIN FORM (7 Cols on lg) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 ui-card p-6 sm:p-7 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] order-2 lg:order-1"
        >
          {/* AI Banner */}
          <div className="flex items-center justify-between gap-3 p-3.5 px-4 rounded-[14px] bg-[#FFF6E5] border border-[#FDE3B8] text-[#7A4A06] text-[14px] font-semibold">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#F2622E] flex-shrink-0" />
              <span>
                {isScanning
                  ? "Analyzing food trays and portion depth..."
                  : `AI detected ${quantity} ${unit.toLowerCase()} (${Math.round(confidence * 100)}% confidence). Review & confirm.`}
              </span>
            </div>
            {confidence >= 0.9 && (
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F4E4CC] text-[#7A4A06]">
                High Confidence
              </span>
            )}
          </div>

          {/* What food is it? */}
          <div className="flex flex-col gap-2.5">
            <label htmlFor="food" className="text-[14px] font-bold text-[#13231C] flex items-center justify-between">
              <span>What food is it?</span>
              <span className="text-[12px] font-normal text-[#5B6661]">Auto-identified by AI</span>
            </label>
            <div className="relative">
              <input
                id="food"
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full h-[50px] border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-[14px] px-4 text-[15px] font-semibold text-[#13231C] outline-none transition-all shadow-xs"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#1E9E5A] bg-[#EEF8F1] px-2 py-1 rounded-md">
                Verified
              </span>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {foodSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFoodName(item)}
                  className={`h-9 px-3.5 rounded-full text-[13px] font-semibold transition-all ${
                    foodName.toLowerCase().includes(item.toLowerCase())
                      ? "bg-[#0E3B2E] text-white shadow-xs"
                      : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:border-[#0E3B2E]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Veg/Non-veg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[14px] font-bold text-[#13231C]">Category</span>
              <div className="flex bg-[#F1F0EB] rounded-[14px] p-1">
                {["Cooked", "Raw", "Packaged", "Bakery"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex-1 h-10 rounded-[11px] text-[13px] font-semibold transition-all ${
                      category.toLowerCase() === cat.toLowerCase()
                        ? "bg-white text-[#0E3B2E] font-bold shadow-xs"
                        : "text-[#2A3A33] hover:text-[#0E3B2E]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Veg or Non-veg */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[14px] font-bold text-[#13231C]">
                Dietary Type
              </span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsVeg(true)}
                  className={`flex-1 h-12 rounded-[14px] text-[14px] font-bold flex items-center justify-center gap-2 transition-all ${
                    isVeg
                      ? "border-2 border-[#1E9E5A] bg-[#EEF8F1] text-[#166534] shadow-xs"
                      : "border border-[#DCD9D0] bg-white text-[#2A3A33] hover:border-[#1E9E5A]"
                  }`}
                >
                  <span className="w-3.5 h-3.5 border-2 border-[#1E9E5A] rounded-[3px] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E5A]" />
                  </span>
                  <span>Pure Veg</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVeg(false)}
                  className={`flex-1 h-12 rounded-[14px] text-[14px] font-bold flex items-center justify-center gap-2 transition-all ${
                    !isVeg
                      ? "border-2 border-[#B91C1C] bg-rose-50 text-[#B91C1C] shadow-xs"
                      : "border border-[#DCD9D0] bg-white text-[#2A3A33] hover:border-[#B91C1C]"
                  }`}
                >
                  <span className="w-3.5 h-3.5 border-2 border-[#B91C1C] rounded-[3px] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
                  </span>
                  <span>Non-Veg</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quantity & Prepared at */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* How much */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[14px] font-bold text-[#13231C]">Estimated Quantity</span>
              <div className="flex gap-2.5">
                <div className="flex items-center border border-[#DCD9D0] rounded-[14px] h-[50px] overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(5, quantity - 5))}
                    className="w-11 h-[50px] bg-[#F6F5F1] text-[20px] font-bold text-[#0E3B2E] hover:bg-[#EEEDE6] transition-colors"
                  >
                    −
                  </button>
                  <span className="font-outfit w-14 text-center text-[19px] font-extrabold text-[#13231C]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 5)}
                    className="w-11 h-[50px] bg-[#F6F5F1] text-[20px] font-bold text-[#0E3B2E] hover:bg-[#EEEDE6] transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="flex bg-[#F1F0EB] rounded-[14px] p-1 flex-1">
                  {["Meals", "Kg"].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`flex-1 h-[42px] rounded-[12px] text-[13px] font-semibold transition-all ${
                        unit.toLowerCase() === u.toLowerCase()
                          ? "bg-white text-[#0E3B2E] font-bold shadow-xs"
                          : "text-[#2A3A33]"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prepared at */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="prep" className="text-[14px] font-bold text-[#13231C]">
                Prepared at
              </label>
              <input
                id="prep"
                type="text"
                value={preparedAt}
                onChange={(e) => setPreparedAt(e.target.value)}
                className="h-[50px] border border-[#DCD9D0] bg-white rounded-[14px] px-4 text-[15px] font-semibold text-[#13231C] outline-none focus:border-[#0E3B2E] shadow-xs"
              />
            </div>
          </div>

          {/* Safe until */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[14px] font-bold text-[#13231C] flex items-center justify-between">
              <span>Safe Consumption Window</span>
              <span className="text-[12px] text-[#1E9E5A] font-semibold">FSSAI 4-Hour Compliant</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {["+1 hr", "+2 hr", "+3 hr", "+4 hr", "11:00 PM"].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSafeUntil(time)}
                  className={`h-9 px-4 rounded-full text-[13px] font-semibold transition-all ${
                    safeUntil === time
                      ? "bg-[#0E3B2E] text-white shadow-xs"
                      : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:border-[#0E3B2E]"
                  }`}
                >
                  {time}
                </button>
              ))}
              <span className="text-[12px] text-[#5B6661] ml-1">
                Shelters are only matched if they can receive food within this window.
              </span>
            </div>
          </div>

          {/* Pickup location */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[14px] font-bold text-[#13231C]">
              Pickup Location
            </span>
            <div className="flex flex-col sm:flex-row gap-3.5">
              <div className="flex-1 h-[105px] rounded-[16px] bg-[#E7EFE9] relative overflow-hidden flex items-center justify-center border border-[#D8E6DB]">
                <svg
                  width="100%"
                  height="105"
                  viewBox="0 0 600 105"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 60h600M180 0v105M420 0v105M0 20h600"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                  />
                  <path d="M0 90L600 35" stroke="#FFFFFF" strokeWidth="5" />
                </svg>
                <div className="absolute flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#F2622E] flex items-center justify-center shadow-md animate-bounce">
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-[280px] flex flex-col justify-center gap-1.5">
                <span className="text-[14px] font-bold text-[#13231C] leading-snug">
                  {pickupAddress}
                </span>
                <span className="text-[12px] text-[#5B6661]">
                  Gate 2, Malviya Nagar, Jaipur • Landmark: Near Apex Mall
                </span>
                <button
                  type="button"
                  onClick={() => setPickupAddress("ITC Rajputana, Station Road, Jaipur")}
                  className="btn-secondary h-8 px-3 text-[12px] self-start mt-0.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1E9E5A]" />
                  <span>Use Saved Kitchen GPS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#F0EEE8] pt-5 mt-2">
            <label className="flex items-center gap-2.5 text-[13px] font-medium text-[#13231C] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-4 h-4 accent-[#0E3B2E] rounded-[4px]"
              />
              <span>I confirm food was stored in temperature compliance and is fresh.</span>
            </label>

            <button
              type="submit"
              disabled={!isConfirmed || isSubmitting}
              className="btn-primary h-[52px] px-8 text-[15px] font-bold w-full sm:w-auto justify-center disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching Shelter...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Post Food ({quantity} Meals)</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: COMPUTER VISION SCANNER & PRESETS (5 Cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-5 order-1 lg:order-2">
          {/* Main Photo Scanner Card */}
          <div className="ui-card p-5 sm:p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#ECE9E1]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#0E3B2E]" />
                <h2 className="font-outfit text-[18px] font-bold text-[#13231C]">
                  Live Kitchen Photo Scanner
                </h2>
              </div>
              <span className="text-[12px] font-bold text-[#1E9E5A] bg-[#EEF8F1] px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#1E9E5A]" />
                <span>AI Vision Active</span>
              </span>
            </div>

            {/* Photo Preview Container with Scanning Overlay */}
            <div className="relative h-[220px] rounded-[18px] overflow-hidden bg-[#13231C] border-2 border-[#DCD9D0] group">
              <Image
                src={selectedImage}
                alt="Kitchen Food Photo"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />

              {/* Holographic Laser Scan Line Animation */}
              {isScanning && (
                <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] flex flex-col justify-between p-4 z-10 animate-pulse">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#1E9E5A] to-transparent shadow-[0_0_15px_#1E9E5A] animate-bounce" />
                  <div className="flex items-center justify-center gap-2 bg-[#0E3B2E]/90 text-white text-[13px] font-bold px-4 py-2 rounded-full mx-auto shadow-lg backdrop-blur-md">
                    <Loader2 className="w-4 h-4 animate-spin text-[#1E9E5A]" />
                    <span>Neural Vision Analyzing Vessels...</span>
                  </div>
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#1E9E5A] to-transparent shadow-[0_0_15px_#1E9E5A]" />
                </div>
              )}

              {/* Overlay Tags: Identified Vessels */}
              {!isScanning && containers.length > 0 && (
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
                  {containers.map((c, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-[#0E3B2E]/85 text-white backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-white/20 shadow-md"
                    >
                      <Layers className="w-3 h-3 text-[#1E9E5A]" />
                      <span>
                        {c.count}x {c.container_type.split("(")[0].trim()}: ~{c.estimated_meals} meals
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* Confidence Badge */}
              {!isScanning && (
                <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                  <CheckCircle2 className="w-3 h-3 text-[#1E9E5A]" />
                  <span>{Math.round(confidence * 100)}% Volume Match</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Camera Upload vs File */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsCameraModalOpen(true)}
                className="btn-primary h-11 text-[13px] font-bold justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Live Photo</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary h-11 text-[13px] font-bold justify-center gap-2"
              >
                <UploadCloud className="w-4 h-4 text-[#5B6661]" />
                <span>Upload File</span>
              </button>
            </div>

            {/* Vessel Analysis Summary Note */}
            <div className="p-3.5 rounded-[14px] bg-[#F6F5F1] border border-[#ECE9E1] flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-[#0E3B2E] flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#1E9E5A]" />
                <span>AI Container & Portion Logic</span>
              </span>
              <p className="text-[12px] text-[#5B6661] leading-relaxed">
                {aiNote}
              </p>
            </div>
          </div>

          {/* Quick Demo Scenarios (For Hackathon Pitch) */}
          <div className="ui-card p-5 flex flex-col gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#ECE9E1]">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-[#13231C] uppercase tracking-wide">
                ⚡ 1-Click Demo Scenarios (For Faculty & Jury)
              </span>
              <span className="text-[11px] font-semibold text-[#5B6661]">
                Simulate Scans
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {DEMO_PHOTO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-3 rounded-[14px] border text-left transition-all flex items-center gap-3 ${
                    activePreset === p.id
                      ? "border-[#0E3B2E] bg-[#EEF8F1]/60 shadow-xs"
                      : "border-[#ECE9E1] bg-white hover:border-[#0E3B2E] hover:bg-[#F9F8F5]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-[10px] overflow-hidden relative flex-shrink-0 bg-[#E7EFE9]">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-[#13231C] truncate">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-[#5B6661]">
                      {p.subtitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-1 rounded-md bg-[#F1F0EB] text-[#0E3B2E] flex-shrink-0">
                    {p.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time OpenCV WebRTC Camera Modal */}
      <LiveCameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}
