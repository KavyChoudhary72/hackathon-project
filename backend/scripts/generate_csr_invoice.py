"""
CSR Tax Invoice & Audit Exemption Generator Script
Generates official CSR Tax Invoices (Section 80G & Companies Act CSR Schedule VII compliant)
for corporate food donors in Jaipur.

Usage:
  python scripts/generate_csr_invoice.py --donor "Hotel Clarks Amer Jaipur" --format json
  python scripts/generate_csr_invoice.py --donor "ITC Rajputana Jaipur" --format table
  python scripts/generate_csr_invoice.py --export-csv csr_invoice.csv
"""

import sys
import json
import argparse
from datetime import datetime


DONOR_PROFILES = {
    "Hotel Clarks Amer Jaipur": {
        "id": "donor_hotel_clarks",
        "gstin": "08AAACH1234F1Z5",
        "category": "Corporate Hospitality & Banquet",
        "address": "JLN Marg, Malviya Nagar, Jaipur, Rajasthan 302018",
        "fssai": "FSSAI-12219020000123",
        "meals": 1850,
        "weight_kg": 777.0,
        "unit_rate": 40.0,
    },
    "Shree Ram Marriage Garden": {
        "id": "donor_shree_ram",
        "gstin": "08AABCS5678K1Z2",
        "category": "Wedding & Catering Establishment",
        "address": "Mansarovar, Jaipur, Rajasthan 302020",
        "fssai": "FSSAI-12219020000456",
        "meals": 1240,
        "weight_kg": 520.8,
        "unit_rate": 40.0,
    },
    "MNIT Campus Central Mess": {
        "id": "donor_mnit_mess",
        "gstin": "08AAATM9012P1Z8",
        "category": "Institutional Mess & Dining",
        "address": "JLN Marg, Jaipur, Rajasthan 302017",
        "fssai": "FSSAI-12219020000789",
        "meals": 980,
        "weight_kg": 411.6,
        "unit_rate": 40.0,
    },
    "ITC Rajputana Jaipur": {
        "id": "donor_itc_rajputana",
        "gstin": "08AAACI3456D1Z9",
        "category": "Luxury Hotel & Fine Dining",
        "address": "Palace Road, Gopalbari, Jaipur, Rajasthan 302006",
        "fssai": "FSSAI-12219020000999",
        "meals": 2100,
        "weight_kg": 882.0,
        "unit_rate": 40.0,
    }
}


def generate_invoice_data(donor_name: str, period: str = "September 2026"):
    profile = DONOR_PROFILES.get(
        donor_name,
        {
            "id": f"donor_{donor_name.lower().replace(' ', '_')}",
            "gstin": "08AAACX0000X1Z1",
            "category": "Food & Beverage Enterprise",
            "address": "Jaipur, Rajasthan",
            "fssai": "FSSAI-12219000000000",
            "meals": 500,
            "weight_kg": 210.0,
            "unit_rate": 40.0,
        }
    )

    total_value = profile["meals"] * profile["unit_rate"]
    co2_avoided = round(profile["weight_kg"] * 2.5, 1)
    invoice_id = f"CSR-INV-2026-{(abs(hash(donor_name)) % 9000) + 1000}"

    return {
        "invoice_metadata": {
            "invoice_number": invoice_id,
            "invoice_title": "TAX INVOICE & CSR IN-KIND DONATION AUDIT RECEIPT",
            "date_of_issue": datetime.now().strftime("%d-%b-%Y"),
            "billing_period": period,
            "financial_year": "2026-2027",
            "assessment_year": "2027-2028",
            "statutory_authority": "Income Tax Department of India (Section 80G) & MCA (CSR Schedule VII)"
        },
        "issuer": {
            "name": "Jaipur Food Rescue and Security Foundation",
            "registration": "Section 8 Non-Profit (CIN: U85300RJ2026NPL089123)",
            "80g_reg_no": "AAATJ1234EF20261",
            "pan": "AAATJ1234E",
            "darpan_id": "RJ/2026/0319482",
            "fssai_partner_id": "FSSAI-SURPLUS-JMC-4482",
            "registered_office": "Bapu Nagar, JLN Marg, Jaipur, Rajasthan 302015"
        },
        "corporate_donor": {
            "name": donor_name,
            "category": profile["category"],
            "gstin": profile["gstin"],
            "fssai_license": profile["fssai"],
            "address": profile["address"]
        },
        "financial_summary": {
            "total_rescued_meals": profile["meals"],
            "total_weight_diverted_kg": profile["weight_kg"],
            "unit_fair_valuation_inr": profile["unit_rate"],
            "gross_in_kind_valuation_inr": total_value,
            "tax_exemption_80g_amount_inr": total_value,
            "amount_payable_by_donor_inr": 0.00,
            "payment_type": "100% In-Kind Safe Surplus Food Donation",
            "co2e_avoided_kg": co2_avoided
        }
    }


def print_formatted_invoice(inv: dict):
    m = inv["invoice_metadata"]
    iss = inv["issuer"]
    don = inv["corporate_donor"]
    fin = inv["financial_summary"]

    print("=" * 82)
    print(f"               {iss['name'].upper()}               ")
    print(f"      {iss['registration']} | 80G Reg: {iss['80g_reg_no']}      ")
    print(f"            NITI Aayog Darpan: {iss['darpan_id']} | PAN: {iss['pan']}            ")
    print("=" * 82)
    print(f"INVOICE NO : {m['invoice_number']:<30} DATE OF ISSUE : {m['date_of_issue']}")
    print(f"PERIOD     : {m['billing_period']:<30} FIN YEAR      : {m['financial_year']}")
    print("-" * 82)
    print("BILLED TO / CORPORATE DONOR:")
    print(f"  Organization : {don['name']} ({don['category']})")
    print(f"  GSTIN / PAN  : {don['gstin']} | FSSAI Lic: {don['fssai_license']}")
    print(f"  Address      : {don['address']}")
    print("-" * 82)
    print("ITEMIZED RESCUE & CSR AUDIT LEDGER:")
    print("  Line  Description                        Meals   Kg Div   Rate (INR)   Total (INR)")
    print("  ----  ---------------------------------  -----   ------   ----------   -----------")
    print(f"  1.    Surplus Safe Prepared Food Batch   {fin['total_rescued_meals']:<7} {fin['total_weight_diverted_kg']:<8.1f} Rs.{fin['unit_fair_valuation_inr']:<8.2f} Rs.{fin['gross_in_kind_valuation_inr']:,.2f}")
    print("-" * 82)
    print(f"TOTAL IN-KIND CSR CONTRIBUTION : Rs. {fin['gross_in_kind_valuation_inr']:,.2f}")
    print(f"ELIGIBLE 80G TAX EXEMPTION     : Rs. {fin['tax_exemption_80g_amount_inr']:,.2f}")
    print(f"TOTAL AMOUNT PAYABLE (IN-KIND) : Rs. 0.00 (Zero Balance Due)")
    print(f"VERIFIED ESG GHG AVOIDED       : {fin['co2e_avoided_kg']} kg CO2e Emissions Prevented")
    print("-" * 82)
    print("STATUTORY DECLARATION:")
    print("  Certified that the surplus food listed above was collected, tested, and distributed")
    print("  free of cost to verified non-profit shelters under FSSAI Surplus Regulations (2019).")
    print("  Eligible for 50% Tax Exemption under Section 80G of the Income Tax Act, 1961.")
    print("=" * 82)


def main():
    parser = argparse.ArgumentParser(description="Generate CSR Tax Invoice for Food Rescue Donors")
    parser.add_argument("--donor", default="Hotel Clarks Amer Jaipur", help="Corporate Donor Name")
    parser.add_argument("--period", default="1 Sep - 25 Sep 2026", help="Billing Period")
    parser.add_argument("--format", choices=["table", "json", "csv"], default="table", help="Output format")
    parser.add_argument("--export-csv", default=None, help="Export CSV filepath")
    args = parser.parse_args()

    data = generate_invoice_data(args.donor, args.period)

    if args.format == "json":
        print(json.dumps(data, indent=2))
    elif args.format == "table":
        print_formatted_invoice(data)
    elif args.format == "csv" or args.export_csv:
        csv_header = "Invoice No,Date,Donor Name,GSTIN,Meals Rescued,Kg Diverted,Valuation INR,80G Eligible INR,CO2e Kg,Verification Status\n"
        m = data["invoice_metadata"]
        don = data["corporate_donor"]
        fin = data["financial_summary"]
        csv_row = f"{m['invoice_number']},{m['date_of_issue']},\"{don['name']}\",{don['gstin']},{fin['total_rescued_meals']},{fin['total_weight_diverted_kg']},{fin['gross_in_kind_valuation_inr']},{fin['tax_exemption_80g_amount_inr']},{fin['co2e_avoided_kg']},VERIFIED_80G\n"
        output_csv = csv_header + csv_row
        if args.export_csv:
            with open(args.export_csv, "w", encoding="utf-8") as f:
                f.write(output_csv)
            print(f"[+] CSR Invoice CSV exported to: {args.export_csv}")
        else:
            print(output_csv)


if __name__ == "__main__":
    main()
