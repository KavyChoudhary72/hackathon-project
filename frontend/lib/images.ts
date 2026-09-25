/**
 * Centralized Platform Image Assets
 * Direct local paths in frontend/public/images
 */

export const APP_IMAGES = {
  // Food items
  dalChawal: "/images/dal_chawal.jpg",
  vegBiryani: "/images/veg_biryani.jpg",
  thaliCombo: "/images/thali_combo.jpg",
  breadBuns: "/images/bread_buns.jpg",
  paneerRoll: "/images/paneer_roll.jpg",
  pastries: "/images/pastries.jpg",
  samosaSnack: "/images/samosa_snack.jpg",
  puriSabzi: "/images/puri_sabzi.jpg",
  fruitsBasket: "/images/fruits_basket.jpg",
  cookedCurry: "/images/cooked_curry.jpg",

  // Entities, Donors & Shelters
  marriageGarden: "/images/marriage_garden.jpg",
  hotelClarks: "/images/hotel_clarks.jpg",
  ashaShelter: "/images/asha_shelter.jpg",
  sevaGhar: "/images/seva_ghar.jpg",
  deliveryDriver: "/images/delivery_driver.jpg",
  rescueVan: "/images/food_rescue_van.jpg",
} as const;

export type AppImageKey = keyof typeof APP_IMAGES;
