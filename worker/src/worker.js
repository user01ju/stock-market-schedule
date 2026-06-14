// 市場資料 proxy：
//   /finnhub/<path>?<query>  → 轉發 finnhub，token 由 Worker secret 補上（前端不見 key）
//   /ics?u=<官方ics網址>      → 伺服器端帶瀏覽器 headers 抓 BLS/Census .ics，補上 CORS
// 部署見 ../DEPLOY.md

const ALLOW_ICS_HOSTS = ["www.bls.gov", "bls.gov", "www.census.gov", "census.gov"];

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/calendar,text/html,application/xhtml+xml,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

    try {
      // ---- Finnhub 代理（隱藏 key）----
      if (url.pathname.startsWith("/finnhub/")) {
        const path = url.pathname.slice("/finnhub/".length);
        const qs = new URLSearchParams(url.search);
        qs.set("token", env.FINNHUB_KEY);
        const r = await fetch(`https://finnhub.io/api/v1/${path}?${qs}`);
        const body = await r.text();
        return new Response(body, {
          status: r.status,
          headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
        });
      }

      // ---- BLS/Census .ics 代理（穿 Akamai + 補 CORS）----
      if (url.pathname === "/ics") {
        const target = url.searchParams.get("u");
        if (!target) return new Response("missing ?u=", { status: 400, headers: CORS });
        let host;
        try {
          host = new URL(target).hostname;
        } catch {
          return new Response("bad url", { status: 400, headers: CORS });
        }
        if (!ALLOW_ICS_HOSTS.includes(host))
          return new Response("host not allowed", { status: 403, headers: CORS });
        const r = await fetch(target, { headers: BROWSER_HEADERS });
        const body = await r.text();
        return new Response(body, {
          status: r.status,
          headers: { ...CORS, "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "public, max-age=21600" },
        });
      }

      return new Response("market-proxy ok", { headers: CORS });
    } catch (e) {
      return new Response("proxy error: " + e.message, { status: 502, headers: CORS });
    }
  },
};
