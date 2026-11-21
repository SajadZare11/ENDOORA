// Keep checked answers in the current tab on a failed request. No browser storage is used.
document.addEventListener("submit", async event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-reading-form")) return;
  event.preventDefault();
  const button = form.querySelector("button[type=submit]");
  if (button.disabled) return;
  const status = form.querySelector("[data-reading-status]");
  const body = new FormData(form);
  const controls = [...form.querySelectorAll("input[type=radio],button")];
  controls.forEach(control => { control.disabled = true; });
  status.textContent = "در حال ثبت…";
  try {
    const response = await fetch(location.href, {method:"POST", credentials:"same-origin", body, cache:"no-store"});
    if (!response.ok || !response.redirected) {
      status.textContent = response.status === 409 ? "حساب یا نسخه تغییر کرده است. برای خواندن پاسخ ثبت‌شده صفحه را دوباره باز کنید." : "ذخیره تأیید نشد. پاسخ‌ها در همین صفحه مانده‌اند؛ دوباره تلاش کنید.";
      return;
    }
    location.assign(response.url);
  } catch {
    status.textContent = "اتصال برقرار نشد. انتخاب‌ها حفظ شده‌اند. پس از اتصال دوباره ثبت کنید.";
  } finally {
    controls.forEach(control => { control.disabled = false; });
  }
});
