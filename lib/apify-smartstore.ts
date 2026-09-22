const IMAGE_URL = /^(?:https:)?\/\/[^/]*\.pstatic\.net\//i;
const URL_IN_HTML = /https?:\/\/[^\s"'<>]+/g;

export function smartStoreImageUrls(item: unknown) {
  const urls: string[] = [];
  const add = (value: string) => {
    const url = value.startsWith("//") ? `https:${value}` : value;
    if (IMAGE_URL.test(url) && !urls.includes(url)) urls.push(url);
  };
  const visit = (value: unknown, key = "") => {
    if (typeof value === "string") {
      if (/image|img/i.test(key)) add(value);
      if (/detail|content|description/i.test(key)) for (const url of value.match(URL_IN_HTML) ?? []) add(url);
      return;
    }
    if (Array.isArray(value)) return value.forEach((entry) => visit(entry, key));
    if (value && typeof value === "object") for (const [name, entry] of Object.entries(value)) visit(entry, name);
  };
  visit(item);
  return urls.slice(0, 10);
}
