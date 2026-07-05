// Page info for the active tab, filled on load.
let page = { url: "", title: "", ogImage: "", description: "" };

const toast = document.getElementById("toast");

function showToast(msg, ok = true) {
  toast.textContent = msg;
  toast.style.color = ok ? "#16a34a" : "#dc2626";
  setTimeout(() => { toast.textContent = ""; }, 2000);
}

// Read OG/meta tags from the page. Runs in the tab via chrome.scripting.
function readMeta() {
  const pick = (sel) => document.querySelector(sel)?.content || "";
  return {
    ogImage: pick('meta[property="og:image"]'),
    ogTitle: pick('meta[property="og:title"]'),
    description:
      pick('meta[property="og:description"]') || pick('meta[name="description"]'),
  };
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  page.url = tab.url || "";
  page.title = tab.title || "";

  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: readMeta,
    });
    const meta = res?.result || {};
    page.ogImage = meta.ogImage || "";
    page.description = meta.description || "";
    if (meta.ogTitle) page.title = meta.ogTitle;
  } catch (e) {
    // Restricted page (chrome://, web store, etc.) — share still works with tab url/title.
  }

  document.getElementById("title").textContent = page.title || page.url;
}

function buildMarkdown() {
  const t = page.title || page.url;
  let md = `## [${t}](${page.url})\n`;
  if (page.ogImage) md += `\n![${t}](${page.ogImage})\n`;
  if (page.description) md += `\n${page.description}\n`;
  return md;
}

function shareUrl(key) {
  const url = encodeURIComponent(page.url);
  const title = encodeURIComponent(page.title || page.url);
  const img = encodeURIComponent(page.ogImage);
  const titleUrl = encodeURIComponent(`${page.title || page.url} ${page.url}`);
  switch (key) {
    case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case "x": return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "whatsapp": return `https://wa.me/?text=${titleUrl}`;
    case "reddit": return `https://www.reddit.com/submit?url=${url}&title=${title}`;
    case "telegram": return `https://t.me/share/url?url=${url}&text=${title}`;
    case "pinterest": return `https://pinterest.com/pin/create/button/?url=${url}&media=${img}&description=${title}`;
    case "bluesky": return `https://bsky.app/intent/compose?text=${titleUrl}`;
    case "threads": return `https://www.threads.net/intent/post?text=${titleUrl}`;
    case "email": return `mailto:?subject=${title}&body=${url}`;
    default: return "";
  }
}

async function copy(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
  } catch (e) {
    showToast("Copy failed", false);
  }
}

document.querySelector(".grid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-share]");
  if (!btn) return;
  const key = btn.dataset.share;
  if (key === "copy-link") return void copy(page.url, "Link");
  if (key === "copy-md") return void copy(buildMarkdown(), "Markdown");
  const url = shareUrl(key);
  if (url) chrome.tabs.create({ url });
});

init();
