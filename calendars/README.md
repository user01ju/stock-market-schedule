# 經濟數據行事曆（BLS / Census iCal）

BLS、Census 網站在 Akamai 反爬牆後面，且不發 CORS header，
所以**網頁無法 live 抓（連 Worker 代理也被 403）**。
改成手動下載 `.ics` 放這裡，網頁同源讀取（無 CORS / 無反爬）。

## 目前用的檔

- **`bls.ics`**（已放）：BLS 的綜合行事曆，一個檔涵蓋 CPI / PPI / 就業 / JOLTS… 全部 release。
  前端用 `CONFIG.ICS_KEEP` 白名單過濾，預設**只留 CPI / PPI**（非農走程式計算，不重複）。

## 怎麼更新（一年一次即可）

用「你自己的瀏覽器」打開 BLS 排程頁，點 **Download iCalendar**，覆蓋 `bls.ics`：

- 綜合（建議）：https://www.bls.gov/schedule/news_release/ → 整體 iCal
- 或單項：CPI https://www.bls.gov/schedule/news_release/cpi.htm
  、PPI https://www.bls.gov/schedule/news_release/ppi.htm

零售銷售（Census，不在 BLS）：https://www.census.gov/economic-indicators/ 下 `retail.ics`。

## 想顯示更多 / 更少

- **更多數據**：把該 release 名稱（ics 的 `SUMMARY`，如 `Personal Income and Outlays`）
  加進 `index.html` 的 `CONFIG.ICS_KEEP`；或下別的 `.ics` 並加進 `CONFIG.ICS_FILES`。
- **全部顯示**：把 `CONFIG.ICS_KEEP` 清成 `[]`（注意 `bls.ics` 很雜會洗版）。
- 無對應 ics 的（如零售、PCE 想手填）：寫進 `index.html` 的 `MANUAL_EVENTS`。

`CONFIG.ICS_FILES` 目前：`bls.ics`、`cpi.ics`、`ppi.ics`、`retail.ics`（缺檔自動略過，不報錯）。
每個 `.ics` 含整年日期，網頁只顯示行事曆涵蓋的兩週。
