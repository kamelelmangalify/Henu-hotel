"""
02_taxes.py — إنشاء الضرائب والرسوم المصرية في Zoho Books
===========================================================
الضرائب المُنشأة:
  1. VAT 14%           — ضريبة القيمة المضافة
  2. Service Charge 12% — رسم الخدمة
  3. WHT Purchase 1%   — خصم ضريبي على المشتريات
  4. WHT Services 3%   — خصم ضريبي على الخدمات والصيانة

تشغيل: python 02_taxes.py
"""

import os
import sys
import requests
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(__file__))
from auth import get_headers  # noqa: E402

load_dotenv("config.env")
BASE_URL = os.getenv("ZOHO_BASE_URL", "https://www.zohoapis.com/books/v3")
ORG_ID   = os.getenv("ZOHO_ORG_ID")

# ═══════════════════════════════════════════════════════════════
#  تعريف الضرائب
# ═══════════════════════════════════════════════════════════════
TAXES = [
    {
        "tax_name":       "VAT 14%",
        "tax_percentage":  14.0,
        "tax_type":       "tax",
        "is_value_added":  True,
        "description":    "ضريبة القيمة المضافة المصرية 14%",
    },
    {
        "tax_name":       "Service Charge 12%",
        "tax_percentage":  12.0,
        "tax_type":       "tax",
        "is_value_added":  False,
        "description":    "رسم الخدمة 12% - يُوزَّع على الموظفين",
    },
    {
        "tax_name":       "WHT Purchase 1%",
        "tax_percentage":  1.0,
        "tax_type":       "tax",
        "is_value_added":  False,
        "description":    "ضريبة الخصم والتحصيل 1% على المشتريات",
    },
    {
        "tax_name":       "WHT Services 3%",
        "tax_percentage":  3.0,
        "tax_type":       "tax",
        "is_value_added":  False,
        "description":    "ضريبة الخصم والتحصيل 3% على الخدمات والصيانة",
    },
]


def get_existing_taxes() -> list[str]:
    """يجلب أسماء الضرائب الموجودة لتجنب التكرار."""
    url = f"{BASE_URL}/taxes"
    resp = requests.get(url, headers=get_headers(), params={"organization_id": ORG_ID})
    if resp.status_code == 200:
        return [t["tax_name"] for t in resp.json().get("taxes", [])]
    return []


def create_tax(tax: dict, existing: list[str]) -> dict:
    """ينشئ ضريبة واحدة أو يتجاهلها إن كانت موجودة."""
    name = tax["tax_name"]
    if name in existing:
        print(f"  ⏭️  موجودة بالفعل: {name}")
        return {"skipped": True, "tax_name": name}

    url = f"{BASE_URL}/taxes"
    resp = requests.post(
        url,
        headers=get_headers(),
        params={"organization_id": ORG_ID},
        json=tax,
    )

    if resp.status_code in (200, 201):
        result = resp.json().get("tax", {})
        print(f"  ✅ تم إنشاء: {name} (ID: {result.get('tax_id', 'N/A')})")
        return result
    else:
        print(f"  ❌ خطأ في إنشاء {name}: {resp.status_code} — {resp.text}")
        return {"error": resp.text, "tax_name": name}


def run(dry_run: bool = False):
    print("\n" + "═" * 55)
    print("  02_taxes.py — إنشاء الضرائب المصرية في Zoho Books")
    print("═" * 55)

    if dry_run:
        print("  🔍 [DRY RUN] — لن يُنفَّذ أي تغيير فعلي")
        for t in TAXES:
            print(f"  → سيتم إنشاء: {t['tax_name']} ({t['tax_percentage']}%)")
        return

    existing = get_existing_taxes()
    print(f"  📋 ضرائب موجودة: {len(existing)}\n")

    results = []
    for tax in TAXES:
        results.append(create_tax(tax, existing))

    created = sum(1 for r in results if "tax_id" in r)
    skipped = sum(1 for r in results if r.get("skipped"))
    errors  = sum(1 for r in results if "error" in r)

    print(f"\n{'─'*55}")
    print(f"  ✅ منشأة: {created}  |  ⏭️ موجودة: {skipped}  |  ❌ أخطاء: {errors}")
    return results


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
