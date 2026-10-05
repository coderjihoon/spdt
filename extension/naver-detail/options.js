const form = document.getElementById("form");
chrome.storage.local.get(["baseUrl", "workerToken"]).then((value) => { document.getElementById("baseUrl").value = value.baseUrl || ""; document.getElementById("workerToken").value = value.workerToken || ""; });
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = new URL(document.getElementById("baseUrl").value);
  if (url.protocol !== "https:") throw new Error("HTTPS 주소만 사용할 수 있습니다.");
  const origin = url.origin;
  const granted = await chrome.permissions.request({ origins: [`${origin}/*`] });
  if (!granted) throw new Error("서버 주소 접근 권한이 필요합니다.");
  await chrome.storage.local.set({ baseUrl: origin, workerToken: document.getElementById("workerToken").value });
  document.getElementById("status").textContent = "저장했습니다. Chrome이 켜져 있으면 1분마다 새 작업을 확인합니다.";
});
