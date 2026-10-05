/* global readDetailInPage */
const inspectButton = document.getElementById("inspect");
const status = document.getElementById("status");
const results = document.getElementById("results");


inspectButton.addEventListener("click", async () => {
  inspectButton.disabled = true;
  results.replaceChildren();
  status.textContent = "상세정보를 확인하고 있습니다…";
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("현재 탭을 찾지 못했습니다.");
    const injections = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: readDetailInPage });
    const result = injections?.[0]?.result;
    if (!result) throw new Error("페이지에서 결과가 돌아오지 않았습니다. 상품 페이지가 이동하거나 새로고침 중이면 다시 시도해 주세요.");
    if (!result.ok) throw new Error(result.error);
    const imageCount = result.items.filter((item) => item.type === "image").length;
    const textCount = result.items.length - imageCount;
    status.textContent = `${result.scope}에서 이미지 ${imageCount}개, 텍스트 ${textCount}개를 순서대로 찾았습니다. 판매자가 상세 본문에 넣은 다른 상품 배너도 포함될 수 있습니다.`;
    for (const [index, item] of result.items.entries()) {
      const row = document.createElement("div");
      row.className = `item item--${item.type}`;
      const label = document.createElement("span");
      if (item.type === "image") {
        const preview = document.createElement("img");
        preview.src = item.url;
        preview.alt = `상세 이미지 후보 ${index + 1}`;
        label.textContent = `${index + 1}. 이미지 · ${new URL(item.url).pathname.split("/").pop()}`;
        row.append(preview, label);
      } else {
        label.textContent = `${index + 1}. 텍스트 · ${item.text}`;
        row.append(label);
      }
      results.append(row);
    }
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "상세정보를 읽지 못했습니다.";
  } finally {
    inspectButton.disabled = false;
  }
});
