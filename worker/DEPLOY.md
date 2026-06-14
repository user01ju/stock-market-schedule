# 部署 market-proxy（Cloudflare Worker）

免費方案 10 萬次/天，個人用綽綽有餘。需要一個 Cloudflare 帳號（免費）。

## 步驟

```bash
cd worker
npx wrangler login                      # 開瀏覽器授權
npx wrangler secret put FINNHUB_KEY     # 貼上你的 finnhub key（存成 secret，不進 git）
npx wrangler deploy                      # 部署
```

部署完會印出網址，例如：
`https://market-proxy.<你的子網域>.workers.dev`

## 接到前端

把該網址填進 `../index.html` 的 `CONFIG.PROXY`：

```js
PROXY: "https://market-proxy.你的子網域.workers.dev",
```

填了之後：

- 財報/IPO 走 `PROXY/finnhub/...`，key 留在 Worker，前端原始碼不再有 key。
- CPI/PPI/零售走 `PROXY/ics?u=...`，由 Worker 帶瀏覽器 headers 抓官方 .ics，自動補 CORS。
- `CONFIG.ICS_REMOTE` 列出要抓的官方 .ics 網址（只允許 bls.gov / census.gov）。

## 驗證

```bash
curl "https://market-proxy.你的子網域.workers.dev/finnhub/calendar/earnings?from=2026-06-15&to=2026-06-21"
curl "https://market-proxy.你的子網域.workers.dev/ics?u=https://www.bls.gov/schedule/news_release/cpi.ics"
```

第二行若回 403（Akamai 仍擋 Cloudflare 機房 IP），就退回「瀏覽器手動下載 .ics 放 calendars/」模式：把 `CONFIG.PROXY` 留空即可自動切換。

## 安全

填了 `PROXY` 後，把 `index.html` 裡的 `FINNHUB_KEY` 清空（""），key 就完全不曝光，repo 可放心公開。
