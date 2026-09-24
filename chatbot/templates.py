"""
templates.py
Bilingual (Hindi / Hinglish / English) message templates.
All outbound messages go through these templates so the tone is consistent.

Usage:
    from templates import T
    msg = T.donation_posted(lang="hinglish", qty=50, food="Dal chawal")
"""

from dataclasses import dataclass
from typing import Optional


# ─── Tiny i18n helper ─────────────────────────────────────────────────────────

def _pick(lang: str, hi: str, hinglish: str, en: str) -> str:
    if lang == "hi":
        return hi
    if lang == "hinglish":
        return hinglish
    return en


# ─── Templates namespace ──────────────────────────────────────────────────────

class _Templates:
    # ── Onboarding / unknown user ────────────────────────────────────────────

    def unknown_user(self, lang: str = "en") -> str:
        return _pick(
            lang,
            "नमस्ते! 🌱 मैं AnnaSetu असिस्टेंट हूँ।\n"
            "अभी केवल demo accounts काम कर रहे हैं।\n"
            "कृपया अपनी टीम से संपर्क करें।",

            "Namaste! 🌱 Main AnnaSetu assistant hoon.\n"
            "Abhi sirf demo accounts kaam karte hain.\n"
            "Please apni team se sampark karein.",

            "Hi! 🌱 I'm the AnnaSetu assistant.\n"
            "Only verified demo accounts are active right now.\n"
            "Please contact your team to get access.",
        )

    def help_menu(self, lang: str, role: str) -> str:
        menus = {
            "donor": _pick(
                lang,
                "📋 *आप क्या कर सकते हैं:*\n• भोजन दान करें\n• स्टेटस देखें\n• इम्पैक्ट देखें\n• help — यह मेनू",
                "📋 *Aap kya kar sakte ho:*\n• Khana donate karo\n• Status dekho\n• Impact dekho\n• help — yeh menu",
                "📋 *What you can do:*\n• Post a donation\n• Check status\n• View impact\n• help — this menu",
            ),
            "shelter": _pick(
                lang,
                "📋 *आप क्या कर सकते हैं:*\n• Offers देखें\n• HAAN / NAHI — accept / decline\n• capacity 40 — क्षमता अपडेट करें\n• status — नवीनतम अपडेट",
                "📋 *Aap kya kar sakte ho:*\n• Offers dekho\n• HAAN / NAHI — accept / decline karo\n• capacity 40 — capacity update karo\n• status — latest update",
                "📋 *What you can do:*\n• View pending offers\n• HAAN / NAHI — accept or decline\n• capacity 40 — update your capacity\n• status — latest update",
            ),
            "driver": _pick(
                lang,
                "📋 *आप क्या कर सकते हैं:*\n• tasks — असाइन्ड काम देखें\n• [OTP] — पिकअप/डिलीवरी कन्फर्म करें\n• status — नवीनतम अपडेट",
                "📋 *Aap kya kar sakte ho:*\n• tasks — assigned kaam dekho\n• [OTP] — pickup/delivery confirm karo\n• status — latest update",
                "📋 *What you can do:*\n• tasks — view assigned tasks\n• [OTP] — confirm pickup or delivery\n• status — latest update",
            ),
            "buyer": _pick(
                lang,
                "📋 *आप क्या कर सकते हैं:*\n• deals near me — नज़दीकी deals देखें\n• claim 2 — 2 meals claim करें\n• status — क्लेम स्टेटस",
                "📋 *Aap kya kar sakte ho:*\n• deals near me — paas ke deals dekho\n• claim 2 — 2 meals claim karo\n• status — claim status",
                "📋 *What you can do:*\n• deals near me — browse nearby deals\n• claim 2 — claim 2 meals\n• status — claim status",
            ),
        }
        return menus.get(role, menus["donor"])

    # ── Donation flows ────────────────────────────────────────────────────────

    def ask_food_type(self, lang: str) -> str:
        return _pick(
            lang,
            "🍱 कौन सा खाना है? (जैसे: दाल-चावल, बिरयानी, रोटी-सब्ज़ी)",
            "🍱 Kaun sa khaana hai? (jaise: dal-chawal, biryani, roti-sabzi)",
            "🍱 What food is it? (e.g. Dal-chawal, Biryani, Roti-sabzi)",
        )

    def ask_quantity(self, lang: str) -> str:
        return _pick(
            lang,
            "🔢 कितने meals हैं? (संख्या बताएं, जैसे: 50 meals या 10 kg)",
            "🔢 Kitne meals hain? (number batao, jaise: 50 meals ya 10 kg)",
            "🔢 How many meals (or kg)? (e.g. 50 meals or 10 kg)",
        )

    def ask_veg(self, lang: str) -> str:
        return _pick(
            lang,
            "🥗 वेज है या नॉन-वेज?\n[वेज ✅] [नॉन-वेज 🍗]",
            "🥗 Veg hai ya non-veg?\n[Veg ✅] [Non-veg 🍗]",
            "🥗 Is it veg or non-veg?\n[Veg ✅] [Non-veg 🍗]",
        )

    def ask_safe_until(self, lang: str) -> str:
        return _pick(
            lang,
            "⏰ खाना कब तक safe है? (जैसे: रात 11 बजे तक, 2 घंटे, kal subah 8)",
            "⏰ Khaana kab tak safe hai? (jaise: raat 11 baje tak, 2 ghante, kal subah 8)",
            "⏰ Until when is the food safe? (e.g. 11 PM, 2 hours, tomorrow 8 AM)",
        )

    def ask_location(self, lang: str) -> str:
        return _pick(
            lang,
            "📍 पिकअप कहाँ से होगा?\nLocation pin भेजें या address type करें।",
            "📍 Pickup kahan se hoga?\nLocation pin bhejein ya address type karein.",
            "📍 Where should the driver pick up from?\nShare a location pin or type the address.",
        )

    def confirm_location(self, lang: str, address: str) -> str:
        return _pick(
            lang,
            f"📍 पता: *{address}*\nसही है? [हाँ ✅] [बदलो ✏️]",
            f"📍 Address: *{address}*\nSahi hai? [Haan ✅] [Badlo ✏️]",
            f"📍 Address: *{address}*\nIs this correct? [Yes ✅] [Change ✏️]",
        )

    def donation_summary_card(
        self, lang: str, qty: int, unit: str, food: str, is_veg: bool,
        safe_until: str, address: str,
    ) -> str:
        veg_str = _pick(lang, "वेज ✅" if is_veg else "नॉन-वेज 🍗",
                        "Veg ✅" if is_veg else "Non-veg 🍗",
                        "Veg ✅" if is_veg else "Non-veg 🍗")
        return _pick(
            lang,
            f"📋 *पुष्टि करें:*\n"
            f"• {qty} {unit} · {food} · {veg_str}\n"
            f"• Safe till: {safe_until}\n"
            f"• Pickup: {address}\n\n"
            f"Post करें? [हाँ ✅] [बदलो ✏️]",

            f"📋 *Confirm karein:*\n"
            f"• {qty} {unit} · {food} · {veg_str}\n"
            f"• Safe till: {safe_until}\n"
            f"• Pickup: {address}\n\n"
            f"Post karein? [Haan ✅] [Badlo ✏️]",

            f"📋 *Confirm donation:*\n"
            f"• {qty} {unit} · {food} · {veg_str}\n"
            f"• Safe till: {safe_until}\n"
            f"• Pickup: {address}\n\n"
            f"Post it? [Yes ✅] [Edit ✏️]",
        )

    def donation_posted(self, lang: str) -> str:
        return _pick(
            lang,
            "✅ Donation post ho gaya! Shelter dhundh raha hoon...",
            "✅ Donation post ho gaya! Shelter dhundh raha hoon...",
            "✅ Donation posted! Finding the best shelter match...",
        )

    def photo_suggestion(self, lang: str, food: str, qty: str, category: str) -> str:
        return _pick(
            lang,
            f"📷 AI suggestion (please confirm):\n"
            f"• Food: {food}\n• Qty: ~{qty}\n• Category: {category}\n"
            f"Sahi hai? [Haan ✅] [Badlo ✏️]\n_(Fields auto-filled, not posted yet)_",

            f"📷 AI suggestion (please confirm):\n"
            f"• Food: {food}\n• Qty: ~{qty}\n• Category: {category}\n"
            f"Sahi hai? [Haan ✅] [Badlo ✏️]\n_(Fields auto-filled, not posted yet)_",

            f"📷 AI suggestion (please confirm):\n"
            f"• Food: {food}\n• Qty: ~{qty}\n• Category: {category}\n"
            f"Correct? [Yes ✅] [Edit ✏️]\n_(Not posted yet — please review)_",
        )

    # ── Status / events ───────────────────────────────────────────────────────

    def matched(self, lang: str, shelter: str, km: float, eta_min: int) -> str:
        return _pick(
            lang,
            f"🏠 Match मिला: *{shelter}* ({km:.1f} km, ~{eta_min} min) ✅",
            f"🏠 Match mila: *{shelter}* ({km:.1f} km, ~{eta_min} min) ✅",
            f"🏠 Matched: *{shelter}* ({km:.1f} km · ~{eta_min} min ETA) ✅",
        )

    def driver_assigned(self, lang: str, driver: str, otp: str) -> str:
        return _pick(
            lang,
            f"🚴 Driver assign हुआ: *{driver}*\n"
            f"Pickup OTP (driver को दें): *{otp}*",
            f"🚴 Driver assign hua: *{driver}*\n"
            f"Pickup OTP (driver ko dein): *{otp}*",
            f"🚴 Driver assigned: *{driver}*\n"
            f"Pickup OTP (share with driver): *{otp}*",
        )

    def delivered(self, lang: str, shelter: str, qty: int) -> str:
        return _pick(
            lang,
            f"🎉 Delivered! {qty} meals *{shelter}* पहुँचे। शुक्रिया! 🌱",
            f"🎉 Delivered! {qty} meals *{shelter}* pahunche. Shukriya! 🌱",
            f"🎉 Delivered! {qty} meals reached *{shelter}*. Thank you! 🌱",
        )

    def unmatched(self, lang: str) -> str:
        return _pick(
            lang,
            "⚠️ कोई shelter match नहीं मिला। Rescue Deal / diversion try हो रहा है।",
            "⚠️ Koi shelter match nahi mila. Rescue Deal / diversion try ho raha hai.",
            "⚠️ No shelter match found. Trying Rescue Deal / diversion next.",
        )

    # ── Shelter flows ─────────────────────────────────────────────────────────

    def offer_alert(
        self, lang: str, qty: int, food: str, is_veg: bool,
        km: float, eta_min: int, capacity: int, seconds: int,
    ) -> str:
        veg = _pick(lang, "वेज ✅" if is_veg else "नॉन-वेज 🍗",
                    "Veg ✅" if is_veg else "Non-veg 🍗",
                    "Veg ✅" if is_veg else "Non-veg 🍗")
        return _pick(
            lang,
            f"🍱 *नया offer!*\n"
            f"{qty} meals · {food} · {veg}\n"
            f"{km:.1f} km · ~{eta_min} min\n"
            f"आपकी capacity: {capacity} meals ✅\n"
            f"{seconds} सेकंड में reply करें\n"
            f"[HAAN ✅] [NAHI ❌]",

            f"🍱 *Naya offer!*\n"
            f"{qty} meals · {food} · {veg}\n"
            f"{km:.1f} km · ~{eta_min} min\n"
            f"Aapki capacity: {capacity} meals ✅\n"
            f"{seconds} sec mein reply karein\n"
            f"[HAAN ✅] [NAHI ❌]",

            f"🍱 *New offer!*\n"
            f"{qty} meals · {food} · {veg}\n"
            f"{km:.1f} km · ~{eta_min} min ETA\n"
            f"Your capacity: {capacity} meals ✅\n"
            f"Reply within {seconds}s\n"
            f"[HAAN ✅] [NAHI ❌]",
        )

    def offer_accepted(self, lang: str, driver: str, eta_min: int, delivery_otp: str) -> str:
        return _pick(
            lang,
            f"✅ Accept किया!\n"
            f"Driver: *{driver}* 🚴\n"
            f"ETA: ~{eta_min} min\n"
            f"Delivery OTP (driver को दें): *{delivery_otp}*",

            f"✅ Accept kar liya!\n"
            f"Driver: *{driver}* 🚴\n"
            f"ETA: ~{eta_min} min\n"
            f"Delivery OTP (driver ko dein): *{delivery_otp}*",

            f"✅ Accepted!\n"
            f"Driver: *{driver}* 🚴\n"
            f"ETA: ~{eta_min} min\n"
            f"Delivery OTP (give to driver): *{delivery_otp}*",
        )

    def offer_declined(self, lang: str) -> str:
        return _pick(
            lang, "❌ Decline kar diya. Agle shelter ko offer ho raha hai.",
            "❌ Decline kar diya. Agle shelter ko offer ho raha hai.",
            "❌ Declined. Offering to the next shelter now.",
        )

    def capacity_updated(self, lang: str, meals: int) -> str:
        return _pick(
            lang,
            f"✅ Capacity update हुई: *{meals} meals* available।",
            f"✅ Capacity update hui: *{meals} meals* available.",
            f"✅ Capacity updated: *{meals} meals* available.",
        )

    # ── Driver flows ──────────────────────────────────────────────────────────

    def task_alert(
        self, lang: str,
        pickup_name: str, pickup_addr: str,
        drop_name: str,   drop_addr: str,
        donor_phone: str,
        maps_pickup: str,
    ) -> str:
        return _pick(
            lang,
            f"🚴 *नया task!*\n"
            f"📦 Pickup: {pickup_name}\n{pickup_addr}\n"
            f"🏠 Drop: {drop_name}\n{drop_addr}\n"
            f"📞 Donor: {donor_phone}\n"
            f"🗺️ {maps_pickup}\n"
            f"Donor se Pickup OTP लें।",

            f"🚴 *Naya task!*\n"
            f"📦 Pickup: {pickup_name}\n{pickup_addr}\n"
            f"🏠 Drop: {drop_name}\n{drop_addr}\n"
            f"📞 Donor: {donor_phone}\n"
            f"🗺️ {maps_pickup}\n"
            f"Donor se Pickup OTP lein.",

            f"🚴 *New task!*\n"
            f"📦 Pickup: {pickup_name}\n{pickup_addr}\n"
            f"🏠 Drop: {drop_name}\n{drop_addr}\n"
            f"📞 Donor: {donor_phone}\n"
            f"🗺️ {maps_pickup}\n"
            f"Ask the donor for the Pickup OTP.",
        )

    def pickup_confirmed(self, lang: str, drop_name: str, maps_drop: str, delivery_otp: str) -> str:
        return _pick(
            lang,
            f"✅ Pickup confirm!\n"
            f"🏠 Drop: {drop_name}\n🗺️ {maps_drop}\n"
            f"Delivery OTP (shelter को दें): *{delivery_otp}*",

            f"✅ Pickup confirm!\n"
            f"🏠 Drop: {drop_name}\n🗺️ {maps_drop}\n"
            f"Delivery OTP (shelter ko dein): *{delivery_otp}*",

            f"✅ Pickup confirmed!\n"
            f"🏠 Drop: {drop_name}\n🗺️ {maps_drop}\n"
            f"Delivery OTP (give to shelter): *{delivery_otp}*",
        )

    def delivery_confirmed(self, lang: str, qty: int) -> str:
        return _pick(
            lang,
            f"🎉 Delivery confirm! {qty} meals safe पहुँचे। Great work! 🌱",
            f"🎉 Delivery confirm! {qty} meals safe pahunche. Great work! 🌱",
            f"🎉 Delivery confirmed! {qty} meals delivered safely. Great work! 🌱",
        )

    def wrong_otp(self, lang: str, attempts_left: int) -> str:
        return _pick(
            lang,
            f"❌ OTP galat hai। Dobara try karein। (Attempts baaki: {attempts_left})",
            f"❌ OTP galat hai. Dobara try karein. (Attempts baaki: {attempts_left})",
            f"❌ Wrong OTP. Please try again. (Attempts remaining: {attempts_left})",
        )

    # ── Buyer / Rescue Deal flows ─────────────────────────────────────────────

    def deal_alert(
        self, lang: str, food: str, price: int,
        qty: int, km: float, collect_by: str,
    ) -> str:
        return _pick(
            lang,
            f"🛒 *Rescue Deal!*\n"
            f"{food} · ₹{price}/meal · {qty} left · {km:.1f} km\n"
            f"Collect by: {collect_by}\n"
            f"[CLAIM 1] [CLAIM 2] [CLAIM 3]",

            f"🛒 *Rescue Deal!*\n"
            f"{food} · ₹{price}/meal · {qty} left · {km:.1f} km\n"
            f"Collect by: {collect_by}\n"
            f"[CLAIM 1] [CLAIM 2] [CLAIM 3]",

            f"🛒 *Rescue Deal!*\n"
            f"{food} · ₹{price}/meal · {qty} left · {km:.1f} km\n"
            f"Collect by: {collect_by}\n"
            f"[CLAIM 1] [CLAIM 2] [CLAIM 3]",
        )

    def deal_claimed(
        self, lang: str, qty: int, total: int,
        otp: str, collect_by: str, donor: str, safe_until: str,
    ) -> str:
        disclaimer = (
            f"⚠️ Surplus food sold directly by {donor}. "
            f"Consume before {safe_until}."
        )
        return _pick(
            lang,
            f"✅ {qty} meals claim ho gaye!\n"
            f"Pickup OTP: *{otp}*\n"
            f"Payment: ₹{total} cash/UPI at pickup\n"
            f"Collect by: {collect_by}\n"
            f"{disclaimer}",

            f"✅ {qty} meals claim ho gaye!\n"
            f"Pickup OTP: *{otp}*\n"
            f"Payment: ₹{total} cash/UPI at pickup\n"
            f"Collect by: {collect_by}\n"
            f"{disclaimer}",

            f"✅ Claimed {qty} meals!\n"
            f"Pickup OTP: *{otp}*\n"
            f"Pay ₹{total} by cash/UPI at pickup\n"
            f"Collect by: {collect_by}\n"
            f"{disclaimer}",
        )

    def deal_donor_notified(self, lang: str, buyer: str, qty: int, otp: str) -> str:
        return _pick(
            lang,
            f"🛒 *{buyer}* ne {qty} meals claim kiya!\nPickup OTP: *{otp}*",
            f"🛒 *{buyer}* ne {qty} meals claim kiya!\nPickup OTP: *{otp}*",
            f"🛒 *{buyer}* claimed {qty} meals!\nPickup OTP: *{otp}*",
        )

    def deal_collected(self, lang: str, qty: int) -> str:
        return _pick(
            lang,
            f"✅ Deal collect ho gaya! {qty} meals liya gaya।",
            f"✅ Deal collect ho gaya! {qty} meals liya gaya.",
            f"✅ Deal collected! {qty} meals picked up.",
        )

    def diversion_going(self, lang: str, partner: str, qty: int) -> str:
        return _pick(
            lang,
            f"🌱 Baaki {qty} meals *{partner}* ja rahe hain. Kuch bhi waste nahi!",
            f"🌱 Baaki {qty} meals *{partner}* ja rahe hain. Kuch bhi waste nahi!",
            f"🌱 Remaining {qty} meals going to *{partner}*. Nothing wasted! 🌱",
        )

    # ── Partner / diversion flows ─────────────────────────────────────────────

    def diversion_offer(self, lang: str, qty_kg: float, food: str, pickup_addr: str) -> str:
        return _pick(
            lang,
            f"🐄 *Diversion offer!*\n"
            f"{qty_kg:.1f} kg · {food}\n"
            f"Pickup: {pickup_addr}\n"
            f"[ACCEPT ✅]",

            f"🐄 *Diversion offer!*\n"
            f"{qty_kg:.1f} kg · {food}\n"
            f"Pickup: {pickup_addr}\n"
            f"[ACCEPT ✅]",

            f"🐄 *Diversion offer!*\n"
            f"{qty_kg:.1f} kg · {food}\n"
            f"Pickup: {pickup_addr}\n"
            f"[ACCEPT ✅]",
        )

    def diversion_accepted(self, lang: str) -> str:
        return _pick(
            lang, "✅ Accept kar liya. Food ready hoga pickup ke liye.",
            "✅ Accept kar liya. Food ready hoga pickup ke liye.",
            "✅ Accepted! The food will be ready for pickup.",
        )

    def diversion_completed(self, lang: str, kg: float) -> str:
        return _pick(
            lang,
            f"✅ {kg:.1f} kg landfill se bacha liya! Shukriya 🌱",
            f"✅ {kg:.1f} kg landfill se bacha liya! Shukriya 🌱",
            f"✅ {kg:.1f} kg diverted from landfill! Thank you 🌱",
        )

    # ── Generic ───────────────────────────────────────────────────────────────

    def error_generic(self, lang: str) -> str:
        return _pick(
            lang,
            "❌ Kuch gadbad ho gaya. Thoda wait karein aur dobara try karein.",
            "❌ Kuch gadbad ho gaya. Thoda wait karein aur dobara try karein.",
            "❌ Something went wrong. Please wait a moment and try again.",
        )

    def faq_not_found(self, lang: str, contact: str = "team") -> str:
        return _pick(
            lang,
            f"❓ Mujhe is sawaal ka jawab nahi pata. Kripaya *{contact}* se contact karein.",
            f"❓ Mujhe is sawaal ka jawab nahi pata. Please *{contact}* se contact karein.",
            f"❓ I don't have an answer to that. Please contact *{contact}* for help.",
        )

    def llm_timeout(self, lang: str) -> str:
        return _pick(
            lang,
            "⏳ Thoda slow ho gaya. Help ke liye 'help' type karein.",
            "⏳ Thoda slow ho gaya. Help ke liye 'help' type karein.",
            "⏳ Taking a moment. Type 'help' to see what I can do.",
        )

    def impact_stats(
        self, lang: str,
        meals: int, deals: int, kg: float, co2: float,
    ) -> str:
        return _pick(
            lang,
            f"🌍 *Impact (aaj tak):*\n"
            f"• {meals} meals rescued (Tier 1)\n"
            f"• {deals} Rescue Deal meals\n"
            f"• {kg:.1f} kg diverted\n"
            f"• {co2:.1f} kg CO₂e saved\n"
            f"_(0.4 kg/meal · 2.5 kg CO₂e/kg — assumptions)_",

            f"🌍 *Impact (aaj tak):*\n"
            f"• {meals} meals rescued (Tier 1)\n"
            f"• {deals} Rescue Deal meals\n"
            f"• {kg:.1f} kg diverted\n"
            f"• {co2:.1f} kg CO₂e saved\n"
            f"_(0.4 kg/meal · 2.5 kg CO₂e/kg — assumptions)_",

            f"🌍 *Impact (today):*\n"
            f"• {meals} meals rescued (Tier 1)\n"
            f"• {deals} Rescue Deal meals\n"
            f"• {kg:.1f} kg diverted from landfill\n"
            f"• {co2:.1f} kg CO₂e saved\n"
            f"_(Assumptions: 0.4 kg/meal · 2.5 kg CO₂e/kg)_",
        )


# ── Singleton ──────────────────────────────────────────────────────────────────
T = _Templates()
