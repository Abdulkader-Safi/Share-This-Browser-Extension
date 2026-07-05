<p align="center">
  <img src="icon.png" alt="Share This icon" width="128" height="128">
</p>

# Share This

A minimal Chrome extension (Manifest V3). Open the popup on any page and click a
social icon to share it, or copy the page as a Markdown snippet for your blog.

## What it does

- Share the current page to LinkedIn, X, Facebook, WhatsApp, Reddit, Telegram,
  Pinterest, Bluesky, Threads, or email. Each opens that platform's prefilled
  share page in a new tab.
- **Copy link** puts the page URL on your clipboard.
- **Copy as Markdown** builds a blog-ready snippet from the page's `og:image`,
  title, and description:

  ```markdown
  ## [Page Title](https://url)

  ![Page Title](https://og-image.jpg)

  Meta description text.
  ```

  The image line is skipped if the page has no `og:image`.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.
4. Pin **Share This** and click the icon on any page.

## How it works

The popup reads the active tab's URL and title, and reads the page's OG/meta
tags with a one-off `chrome.scripting.executeScript`. The only permissions are
`activeTab` and `scripting`, both granted on the click, so there is no broad host
access and nothing runs in the background.

## Files

- `manifest.json` — extension config and permissions.
- `index.html` — the popup UI (inline styles, inline SVG icons).
- `script.js` — reads page info and builds the share URLs and Markdown.

## Support

If this plugin is useful, you can support the work at
[ko-fi.com/abdulkadersafi](https://ko-fi.com/abdulkadersafi).

## License

MIT. See [LICENSE](LICENSE).
