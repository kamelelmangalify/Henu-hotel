"""
01_auth.py — Zoho Books OAuth2 Token Manager
==============================================
يدير الـ Access Token تلقائياً:
- أول تشغيل: python 01_auth.py --init --code=YOUR_AUTH_CODE
- تجديد: python 01_auth.py --refresh
- اختبار: python 01_auth.py --test
"""

import os
import json
import argparse
import requests
from pathlib import Path
from datetime import datetime, timedelta
from dotenv import load_dotenv

# تحميل الإعدادات
load_dotenv("config.env")

BASE_URL    = os.getenv("ZOHO_BASE_URL",    "https://www.zohoapis.com/books/v3")
TOKEN_URL   = os.getenv("ZOHO_TOKEN_URL",   "https://accounts.zoho.com/oauth/v2/token")
CLIENT_ID   = os.getenv("ZOHO_CLIENT_ID")
CLIENT_SEC  = os.getenv("ZOHO_CLIENT_SECRET")
REFRESH_TOK = os.getenv("ZOHO_REFRESH_TOKEN")
ORG_ID      = os.getenv("ZOHO_ORG_ID")

TOKEN_CACHE = Path(__file__).parent / ".token_cache.json"


def save_token(access_token: str, expires_in: int = 3600):
    """يحفظ التوكن مع وقت انتهائه."""
    data = {
        "access_token": access_token,
        "expires_at": (datetime.utcnow() + timedelta(seconds=expires_in - 60)).isoformat()
    }
    TOKEN_CACHE.write_text(json.dumps(data))
    print(f"  ✅ Token saved (expires in ~{expires_in//60} min)")


def load_cached_token() -> str | None:
    """يحمّل التوكن المخزن إذا لم ينته صلاحيته."""
    if not TOKEN_CACHE.exists():
        return None
    data = json.loads(TOKEN_CACHE.read_text())
    expires_at = datetime.fromisoformat(data["expires_at"])
    if datetime.utcnow() < expires_at:
        return data["access_token"]
    return None


def get_access_token() -> str:
    """
    يرجع توكن صالح — من الكاش أو يجدده تلقائياً.
    استخدم هذه الدالة في باقي السكربتات.
    """
    token = load_cached_token()
    if token:
        return token
    return refresh_token()


def refresh_token() -> str:
    """يجدد الـ Access Token باستخدام الـ Refresh Token."""
    if not all([CLIENT_ID, CLIENT_SEC, REFRESH_TOK]):
        raise EnvironmentError("❌ يرجى تعبئة ZOHO_CLIENT_ID و ZOHO_CLIENT_SECRET و ZOHO_REFRESH_TOKEN في config.env")

    print("🔄 Refreshing access token...")
    resp = requests.post(TOKEN_URL, data={
        "grant_type":    "refresh_token",
        "client_id":     CLIENT_ID,
        "client_secret": CLIENT_SEC,
        "refresh_token": REFRESH_TOK,
    })
    resp.raise_for_status()
    data = resp.json()

    if "access_token" not in data:
        raise ValueError(f"❌ خطأ في تجديد التوكن: {data}")

    save_token(data["access_token"], data.get("expires_in", 3600))
    return data["access_token"]


def init_from_code(auth_code: str):
    """تبادل الـ Authorization Code بـ Refresh Token (مرة واحدة فقط)."""
    print("🔑 Initializing tokens from auth code...")
    resp = requests.post(TOKEN_URL, data={
        "grant_type":   "authorization_code",
        "client_id":    CLIENT_ID,
        "client_secret": CLIENT_SEC,
        "code":         auth_code,
    })
    resp.raise_for_status()
    data = resp.json()

    if "refresh_token" not in data:
        raise ValueError(f"❌ لم يُرجع الـ API refresh_token: {data}")

    print(f"\n{'='*60}")
    print("✅ تم الحصول على Refresh Token بنجاح!")
    print(f"   Refresh Token: {data['refresh_token']}")
    print(f"\n📝 أضف هذه القيمة في config.env:")
    print(f"   ZOHO_REFRESH_TOKEN={data['refresh_token']}")
    print(f"{'='*60}\n")
    save_token(data["access_token"], data.get("expires_in", 3600))


def test_connection():
    """يختبر الاتصال بـ Zoho Books API."""
    print("\n🔍 Testing Zoho Books connection...")
    token = get_access_token()
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    url = f"{BASE_URL}/organizations?organization_id={ORG_ID}"
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        orgs = resp.json().get("organizations", [])
        print(f"  ✅ Connected! Organizations found: {len(orgs)}")
        for org in orgs:
            print(f"     → [{org.get('organization_id')}] {org.get('name')} ({org.get('currency_code')})")
    else:
        print(f"  ❌ Connection failed: {resp.status_code} — {resp.text}")


def get_headers() -> dict:
    """مساعد: يرجع headers جاهزة للاستخدام في الطلبات."""
    return {
        "Authorization": f"Zoho-oauthtoken {get_access_token()}",
        "Content-Type": "application/json"
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Zoho Books Auth Manager")
    parser.add_argument("--init",    action="store_true", help="تهيئة التوكن من Authorization Code")
    parser.add_argument("--refresh", action="store_true", help="تجديد Access Token")
    parser.add_argument("--test",    action="store_true", help="اختبار الاتصال")
    parser.add_argument("--code",    type=str,            help="Authorization Code (مع --init فقط)")
    args = parser.parse_args()

    if args.init:
        if not args.code:
            print("❌ يرجى تمرير --code=YOUR_AUTH_CODE")
        else:
            init_from_code(args.code)
    elif args.refresh:
        refresh_token()
    elif args.test:
        test_connection()
    else:
        parser.print_help()
