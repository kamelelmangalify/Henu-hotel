"""
04_chart_of_accounts.py — بناء شجرة الحسابات في Zoho Books
==============================================================
الحسابات المُنشأة:
  الأصول     : Guest Ledger, City Ledger, Main Cash, POS Cash, F&B Inventory, Operating Supplies
  الالتزامات : Guest Deposits, Output VAT 14%, WHT Payable, Service Charge Pool
  الإيرادات  : Room Revenue, Cafe & Restaurant Sales, Laundry & Services
  التكاليف   : F&B COGS
  المصروفات  : Guest Amenities, OTA Commission, Utilities, Maintenance

تشغيل: python 04_chart_of_accounts.py
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
#  شجرة الحسابات الكاملة
#  account_type يجب أن يطابق القيم المقبولة في Zoho Books بالضبط
# ═══════════════════════════════════════════════════════════════
ACCOUNTS = [
    # ── الأصول (Assets) ──────────────────────────────────────
    {
        "account_name": "Guest Ledger",
        "account_type": "accounts_receivable",
        "account_code": "1100",
        "description":  "حساب النزلاء الحاليين — مديونيات المقيمين",
    },
    {
        "account_name": "City Ledger",
        "account_type": "accounts_receivable",
        "account_code": "1110",
        "description":  "حساب النزلاء الشركات والوكالات — مديونيات آجلة",
    },
    {
        "account_name": "Main Cash",
        "account_type": "cash",
        "account_code": "1200",
        "description":  "صندوق النقدية الرئيسي — الاستقبال والعمليات العامة",
    },
    {
        "account_name": "POS Cash",
        "account_type": "cash",
        "account_code": "1210",
        "description":  "صندوق نقطة البيع — الكافيه والمطعم",
    },
    {
        "account_name": "F&B Inventory",
        "account_type": "inventory",
        "account_code": "1300",
        "description":  "مخزون المواد الغذائية والمشروبات",
    },
    {
        "account_name": "Operating Supplies",
        "account_type": "other_current_asset",
        "account_code": "1310",
        "description":  "مستلزمات التشغيل — أدوات نظافة ومستهلكات الغرف",
    },

    # ── الالتزامات (Liabilities) ─────────────────────────────
    {
        "account_name": "Guest Deposits",
        "account_type": "other_current_liability",
        "account_code": "2100",
        "description":  "أمانات النزلاء — مبالغ مقدمة قبل الإقامة",
    },
    {
        "account_name": "Output VAT 14%",
        "account_type": "other_current_liability",
        "account_code": "2200",
        "description":  "ضريبة القيمة المضافة المستحقة للسلطة الضريبية 14%",
    },
    {
        "account_name": "WHT Payable",
        "account_type": "other_current_liability",
        "account_code": "2210",
        "description":  "ضريبة الخصم والتحصيل المستحقة — 1% مشتريات / 3% خدمات",
    },
    {
        "account_name": "Service Charge Pool",
        "account_type": "other_current_liability",
        "account_code": "2220",
        "description":  "رسم الخدمة 12% المحتجز لتوزيعه على الموظفين",
    },

    # ── الإيرادات (Income) ───────────────────────────────────
    {
        "account_name": "Room Revenue",
        "account_type": "income",
        "account_code": "4100",
        "description":  "إيراد إيجار الغرف والإقامة",
    },
    {
        "account_name": "Cafe & Restaurant Sales",
        "account_type": "income",
        "account_code": "4200",
        "description":  "إيراد مبيعات الكافيه والمطعم",
    },
    {
        "account_name": "Laundry & Services",
        "account_type": "income",
        "account_code": "4300",
        "description":  "إيراد خدمات الغسيل والخدمات الإضافية",
    },

    # ── تكلفة البضاعة المباعة (COGS) ────────────────────────
    {
        "account_name": "F&B COGS",
        "account_type": "cost_of_goods_sold",
        "account_code": "5100",
        "description":  "تكلفة البضاعة المباعة — المواد الغذائية والمشروبات",
    },

    # ── المصروفات (Expenses) ─────────────────────────────────
    {
        "account_name": "Guest Amenities",
        "account_type": "expense",
        "account_code": "5200",
        "description":  "مصروفات مستلزمات النزلاء — مستهلكات الغرف والاستقبال",
    },
    {
        "account_name": "OTA Commission",
        "account_type": "expense",
        "account_code": "5300",
        "description":  "عمولات منصات الحجز الإلكتروني — Booking.com / Airbnb",
    },
    {
        "account_name": "Utilities",
        "account_type": "expense",
        "account_code": "5400",
        "description":  "مصروفات المرافق — كهرباء وماء وغاز وانترنت",
    },
    {
        "account_name": "Maintenance",
        "account_type": "expense",
        "account_code": "5500",
        "description":  "مصروفات الصيانة والإصلاحات الدورية والطارئة",
    },
]


def get_existing_accounts() -> list[str]:
    url = f"{BASE_URL}/chartofaccounts"
    resp = requests.get(url, headers=get_headers(), params={"organization_id": ORG_ID})
    if resp.status_code == 200:
        return [a["account_name"] for a in resp.json().get("chartofaccounts", [])]
    return []


def create_account(account: dict, existing: list[str]) -> dict:
    name = account["account_name"]
    if name in existing:
        print(f"  ⏭️  موجود بالفعل: [{account['account_code']}] {name}")
        return {"skipped": True, "account_name": name}

    url = f"{BASE_URL}/chartofaccounts"
    resp = requests.post(
        url,
        headers=get_headers(),
        params={"organization_id": ORG_ID},
        json=account,
    )

    if resp.status_code in (200, 201):
        result = resp.json().get("chartofaccount", {})
        print(f"  ✅ [{account['account_code']}] {name}  →  ID: {result.get('account_id', 'N/A')}")
        return result
    else:
        print(f"  ❌ خطأ [{account['account_code']}] {name}: {resp.status_code} — {resp.text}")
        return {"error": resp.text, "account_name": name}


def run(dry_run: bool = False):
    print("\n" + "═" * 60)
    print("  04_chart_of_accounts.py — شجرة الحسابات")
    print("═" * 60)

    if dry_run:
        print(f"  🔍 [DRY RUN] — {len(ACCOUNTS)} حساب سيُنشأ:\n")
        for acc in ACCOUNTS:
            print(f"  [{acc['account_code']}] {acc['account_name']:35s} ({acc['account_type']})")
        return

    existing = get_existing_accounts()
    print(f"  📋 حسابات موجودة: {len(existing)}\n")

    # ترتيب حسب نوع الحساب للوضوح
    categories = {
        "assets":       ["accounts_receivable", "cash", "inventory", "other_current_asset"],
        "liabilities":  ["other_current_liability"],
        "income":       ["income"],
        "cogs":         ["cost_of_goods_sold"],
        "expenses":     ["expense"],
    }
    labels = {
        "assets": "── الأصول", "liabilities": "── الالتزامات",
        "income": "── الإيرادات", "cogs": "── تكلفة البضاعة", "expenses": "── المصروفات"
    }

    results = []
    for cat, types in categories.items():
        cat_accounts = [a for a in ACCOUNTS if a["account_type"] in types]
        if cat_accounts:
            print(f"\n  {labels[cat]}")
        for acc in cat_accounts:
            results.append(create_account(acc, existing))

    created = sum(1 for r in results if "account_id" in r)
    skipped = sum(1 for r in results if r.get("skipped"))
    errors  = sum(1 for r in results if "error" in r)

    print(f"\n{'─'*60}")
    print(f"  ✅ منشأة: {created}  |  ⏭️ موجودة: {skipped}  |  ❌ أخطاء: {errors}")
    return results


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
