importScripts("detail.js");
const config = async () => chrome.storage.local.get(["baseUrl", "workerToken"]);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function api(path, body = {}) {
  const { baseUrl, workerToken } = await config();
  if (!baseUrl || !workerToken) return null;
  const response = await fetch(`${baseUrl}${path}`, { method: "POST", headers: { Authorization: `Bearer ${workerToken}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`서버 응답 ${response.status}`);
  return response.json();
}
async function handleJob(job) {
  let tab;
  try {
    tab = await chrome.tabs.create({ url: job.product_url, active: false });
    for (let n = 0; n < 40; n++) {
      const state = await chrome.tabs.get(tab.id);
      if (state.status === "complete") break;
      await pause(500);
    }
    const [injection] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: readDetailInPage });
    const result = injection?.result;
    if (!result?.ok) {
      const security = /보안|로그인|captcha|확인 화면/i.test(result?.error || "");
      await api(`/api/naver-jobs/${job.id}/result`, { lease: job.lease, error: security ? "security_check" : "collection_failed" });
      return;
    }
    await api(`/api/naver-jobs/${job.id}/result`, { lease: job.lease, url: result.url, items: result.items });
  } catch (error) {
    try { await api(`/api/naver-jobs/${job.id}/result`, { lease: job.lease, error: "collection_failed" }); } catch { /* lease expires */ }
    console.error("SmartStore job failed", error);
  } finally { if (tab?.id) await chrome.tabs.remove(tab.id).catch(() => {}); }
}
let running = false;
async function poll() {
  if (running) return;
  running = true;
  try {
    const result = await api("/api/naver-jobs/claim");
    if (result?.job) await handleJob(result.job);
  } catch (error) { console.error("SmartStore worker offline", error); }
  finally { running = false; }
}
chrome.runtime.onInstalled.addListener(() => chrome.alarms.create("naver-poll", { periodInMinutes: 1 }));
chrome.runtime.onStartup.addListener(() => chrome.alarms.create("naver-poll", { periodInMinutes: 1 }));
chrome.alarms.onAlarm.addListener((alarm) => { if (alarm.name === "naver-poll") poll(); });
chrome.storage.onChanged.addListener(() => poll());
poll();
