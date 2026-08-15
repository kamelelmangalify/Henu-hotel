"""
03_reporting_tags.py — إنشاء وسوم مراكز التكلفة (Reporting Tags)
==================================================================
يُنشئ Tag رئيسي: Department
  مع الخيارات: Rooms | Cafe & Restaurant | General & Admin

تشغيل: python 03_reporting_tags.py
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

REPORTING_TAG = {
    "tag_name": "Department",
    "options": [
        {"value": "Rooms"},
        {"value": "Cafe & Restaurant"},
        {"value": "General & Admin"},
    ],
}


def get_existing_tags() -> list[str]:
    url = f"{BASE_URL}/settings/reportingtags"
    resp = requests.get(url, headers=get_headers(), params={"organization_id": ORG_ID})
    if resp.status_code == 200:
        return [t["tag_name"] for t in resp.json().get("reporting_tags", [])]
    return []


def run(dry_run: bool = False):
    print("\n" + "═" * 55)
    print("  03_reporting_tags.py — مراكز التكلفة")
    print("═" * 55)

    if dry_run:
        print(f"  🔍 [DRY RUN] سيتم إنشاء: {REPORTING_TAG['tag_name']}")
        for opt in REPORTING_TAG["options"]:
            print(f"     → {opt['value']}")
        return

    existing = get_existing_tags()
    tag_name = REPORTING_TAG["tag_name"]

    if tag_name in existing:
        print(f"  ⏭️  الـ Tag '{tag_name}' موجود بالفعل — لا حاجة للإنشاء")
        return

    url = f"{BASE_URL}/settings/reportingtags"
    resp = requests.post(
        url,
        headers=get_headers(),
        params={"organization_id": ORG_ID},
        json=REPORTING_TAG,
    )

    if resp.status_code in (200, 201):
        result = resp.json().get("reporting_tag", {})
        print(f"  ✅ تم إنشاء Tag: {tag_name} (ID: {result.get('tag_id', 'N/A')})")
        for opt in REPORTING_TAG["options"]:
            print(f"     ✓ {opt['value']}")
    else:
        print(f"  ❌ خطأ: {resp.status_code} — {resp.text}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
