# 美股市場時間與行事曆

純前端單檔網頁（`index.html`），確認美股／台股的交易時間與行事曆。扁平風、無框架、無 build。

🔗 線上：https://user01ju.github.io/stock-market-schedule/

## 功能

- **台美雙時鐘**：台北 ⇄ 紐約即時對照，EDT/EST 隨夏令時間自動切換（靠瀏覽器 `Intl`，每年自動更新，無寫死日期）。附 ☀️/🌙 日夜圖示。
- **即時開收盤狀態燈**：台、美各一顆會脈動的燈——
  - 台股：日盤開盤中／期貨夜盤（夜盤凌晨段正確歸前一交易日）／收盤／休市。
  - 美股：盤前／盤中／盤後／休市。
  - 連動各自實際假日（台股 `TW_CLOSED`、美股 `US_CLOSED`）。
- **距美股開盤倒數**：自動跳過週末與美股假日；盤中改顯示距收盤。
- **交易時段調頻面板**：軸起點 09:00，上排台股（日盤／期貨夜盤）、下排美股（盤前／盤中／盤後，ET 換算），紅線標示現在並隨時間移動。**週末/假日該市場色塊自動轉灰**（TW/US 各自連動假日）。
- **未來兩週台美行事曆**（14 天，2 列 × 7，同欄=同星期）：
  - 假日：美股 `date.nager.at` + Good Friday（Easter 計算）；台股 政府辦公日曆表（`ruyut/TaiwanCalendar`，含端午/春節等農曆假日）。
  - 規則性計算：三巫日（遇假日提前）、台指期/選擇權結算、非農（首週五）、初領失業金（每週四）。
  - 官方排程：FOMC（`index.html` 內 `FOMC` 表，每年補一次）。
  - 線上來源：財報／IPO（Finnhub，經 Worker 代理隱藏 key）、CPI／PPI（BLS iCal，放 `calendars/`，白名單 `ICS_KEEP` 只留大數據）。

## 資料源與已知限制

| 項目            | 來源                              | 備註                                            |
| --------------- | --------------------------------- | ----------------------------------------------- |
| 美股假日        | date.nager.at                     | + Good Friday 計算                              |
| 台股假日        | ruyut/TaiwanCalendar（jsDelivr）  | Nager **不支援台灣**，故改用此                  |
| 財報 / IPO      | Finnhub（免費）                   | 經 Worker 代理；watchlist 在 `EARNINGS_WATCH`  |
| 經濟日曆        | Finnhub                           | **免費方案不含**，回 403，自動略過             |
| CPI / PPI       | BLS iCal（本地 `calendars/`）     | BLS 在 Akamai 後、無 CORS，**Worker 也被擋**   |
| 三巫日/結算/非農/失業金 | 程式計算                    | 規則明確                                        |
| FOMC            | 官方排程表（手動）                | 無公式                                          |

> **BLS 經 Worker 實測被 Akamai 擋（403）**：CPI/PPI 走本地 `.ics`（見 `calendars/README.md`）。`CONFIG.PROXY` 仍照填，Finnhub 走 Worker、ics 走本地，前端兩條都試並去重。

## 設定（`index.html` 頂端 `CONFIG`）

- `PROXY`：Worker 網址。填了 → Finnhub 走後端、key 隱藏；留空 → 前端直連（需 `FINNHUB_KEY`）。
- `FINNHUB_KEY`：公開 repo 請留空，改用 Worker。
- `EARNINGS_WATCH`：要追的財報代號。
- `ICS_FILES`：本地 ics 路徑（含 `bls.ics`）。
- `ICS_KEEP`：ics 白名單（預設只留 `Consumer Price Index` / `Producer Price Index`）。
- `MANUAL_EVENTS`：無來源的事件手動補（如零售、PCE）。
- `FOMC`：每年公告後補一行。

## 直接用

瀏覽器開 `index.html` 即可。`file://` 若被 CORS 擋，改用 GitHub Pages 或本機伺服器（`python -m http.server`）。

## Worker proxy（隱藏 key + 代理 ics）

部署見 [`worker/DEPLOY.md`](worker/DEPLOY.md)。目前已部署：`market-proxy.slowdrive.workers.dev`（Finnhub 可用、BLS 仍被 Akamai 擋）。

## 維護週期

- **每年初**：到 BLS 重下 `calendars/bls.ics`；補當年 `FOMC` 排程。
- **不定期**：調整 `EARNINGS_WATCH`、`ICS_KEEP`、`MANUAL_EVENTS`。
- DST、台股假日（隔年資料）、三巫日/結算/非農 皆自動，免維護。
