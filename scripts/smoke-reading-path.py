"""Optional Playwright smoke test. Use a fresh disposable staging learner and published starter edition."""

import argparse
import asyncio
import os
from playwright.async_api import async_playwright, expect


async def run(base, chromium):
    email = os.environ["ENDOORA_SMOKE_EMAIL"]
    password = os.environ["ENDOORA_SMOKE_PASSWORD"]
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=chromium or None)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844}, service_workers="block"
        )
        page = await context.new_page()
        await page.goto(base + "/ielts/reading/false-not-given/")
        await expect(page.locator("fieldset")).to_have_count(3)
        for field in await page.locator("fieldset").all():
            await field.get_by_role("radio").first.check()
        await context.set_offline(True)
        await page.locator("button[type=submit]").click()
        await expect(page.locator("[data-reading-status]")).to_contain_text("انتخاب‌ها")
        await expect(page.locator("input:checked")).to_have_count(3)
        await context.set_offline(False)
        await page.locator("button[type=submit]").click()
        await expect(page.get_by_role("heading", level=1)).to_contain_text("نتیجه")
        await page.locator('a[href="/auth/login?reading=1"]').click()
        await page.locator("input[type=email]").fill(email)
        await page.locator("input[type=password]").fill(password)
        await context.set_offline(True)
        await page.locator("button[type=submit]").click()
        await expect(page.locator("button[type=submit]")).to_be_enabled()
        await expect(page.locator("input[type=email]")).to_have_value(email)
        await context.set_offline(False)
        await page.locator("button[type=submit]").click()
        await page.wait_for_url("**/ielts/reading/", timeout=20000)
        await page.locator('a[href="/ielts/reading/diagnostic/"]').click()
        await expect(page.locator("fieldset")).to_have_count(6)
        for field in await page.locator("fieldset").all():
            await field.get_by_role("radio").first.check()
        await page.locator("button[type=submit]").click()
        await expect(page.get_by_role("heading", level=1)).to_contain_text("نتیجه")
        await page.locator('a.button[href="/ielts/reading/"]').click()
        await expect(
            page.get_by_role("heading", name="پیشنهاد بعدی شما")
        ).to_be_visible()
        await page.locator('a.button[href*="/lesson/"]').click()
        await expect(page.locator("fieldset")).to_have_count(2)
        for field in await page.locator("fieldset").all():
            await field.get_by_role("radio").first.check()
        await page.locator("button[type=submit]").click()
        await expect(page.get_by_role("heading", level=1)).to_contain_text("نتیجه")
        await page.goto(base + "/ielts/reading/notebook/")
        await expect(page.locator("section").first).to_be_visible()
        await browser.close()
        print(
            "390px guest exercise, interrupted save, interrupted login, guest handoff, diagnostic, lesson and notebook passed."
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base", help="Staging site origin")
    parser.add_argument("--chromium", help="Optional absolute Chromium executable path")
    options = parser.parse_args()
    asyncio.run(run(options.base.rstrip("/"), options.chromium))
