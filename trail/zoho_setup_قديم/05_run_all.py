"""
05_run_all.py — تشغيل الإعداد الكامل لـ Zoho Books
====================================================
ينفذ بالترتيب:
  1. اختبار الاتصال
  2. إنشاء الضرائب
  3. إنشاء مراكز التكلفة
  4. بناء شجرة الحسابات

تشغيل: python 05_run_all.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))

from auth             import test_connection  # noqa: E402
import taxes           as step2               # noqa: E402
import reporting_tags  as step3               # noqa: E402
import chart_of_accounts as step4            # noqa: E402


BANNER = """
╔══════════════════════════════════════════════════════════╗
║   🏨  هوستل الأهرامات — إعداد Zoho Books               ║
║   Hotel Accounting Automation Setup                     ║
╚══════════════════════════════════════════════════════════╝
"""


def separator(title: str = ""):
    line = "═" * 60
    if title:
        print(f"\n{line}")
        print(f"  {title}")
        print(line)
    else:
        print(f"\n{line}")


def main():
    print(BANNER)
    start = time.time()

    # ── الخطوة 0: اختبار الاتصال ────────────────────────────
    separator("الخطوة 1 / 4 — اختبار الاتصال بـ Zoho Books")
    try:
        test_connection()
    except Exception as e:
        print(f"\n❌ فشل الاتصال: {e}")
        print("تأكد من صحة القيم في config.env ثم أعد المحاولة.")
        sys.exit(1)

    time.sleep(1)  # تجنب rate limit

    # ── الخطوة 2: الضرائب ───────────────────────────────────
    separator("الخطوة 2 / 4 — إنشاء الضرائب المصرية")
    try:
        step2.run()
    except Exception as e:
        print(f"❌ خطأ في إنشاء الضرائب: {e}")

    time.sleep(1)

    # ── الخطوة 3: مراكز التكلفة ─────────────────────────────
    separator("الخطوة 3 / 4 — إنشاء مراكز التكلفة")
    try:
        step3.run()
    except Exception as e:
        print(f"❌ خطأ في إنشاء مراكز التكلفة: {e}")

    time.sleep(1)

    # ── الخطوة 4: شجرة الحسابات ─────────────────────────────
    separator("الخطوة 4 / 4 — بناء شجرة الحسابات")
    try:
        step4.run()
    except Exception as e:
        print(f"❌ خطأ في بناء شجرة الحسابات: {e}")

    # ── ملخص ─────────────────────────────────────────────────
    elapsed = round(time.time() - start, 1)
    separator()
    print(f"""
  🎉 اكتمل الإعداد في {elapsed} ثانية!

  الخطوات التالية:
  ──────────────────────────────────────────────────
  1. تحقق من Zoho Books → Accountant → Chart of Accounts
  2. تحقق من Settings → Taxes
  3. تحقق من Settings → Reporting Tags → Department
  4. انتقل لإعداد مسارات n8n (مجلد n8n_workflows/)
  ──────────────────────────────────────────────────
""")


if __name__ == "__main__":
    main()
