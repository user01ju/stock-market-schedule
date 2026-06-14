# 美股市場時間與行事曆

純前端單檔網頁，確認美股／台股的交易時間與行事曆。

## 功能

- **台美雙時鐘**：台北 ⇄ 紐約即時對照，EDT/EST 隨夏令時間自動切換（靠瀏覽器 `Intl`，每年自動更新）。
- **距美股開盤倒數**：自動跳過週末與假日，盤中改顯示距收盤。
- **交易時段調頻面板**：軸起點 09:00，上排台股（日盤／期貨夜盤）、下排美股（盤前／盤中／盤後，ET 換算），紅線標示現在並隨時間移動。
- **未來一週台美行事曆**：
  - 假日：`date.nager.at`（NYSE／TWSE）+ Good Friday 計算。
  - 規則性計算：三巫日、台指期結算、非農、初領失業金。
  - 官方排程：FOMC。
  - 來源：財報／IPO（Finnhub）、CPI／PPI／零售（BLS／Census iCal）。

## 直接用

瀏覽器開 `index.html` 即可。`file://` 若被 CORS 擋，改用 GitHub Pages 或本機伺服器（`python -m http.server`）。

## 隱藏 API key（建議公開 repo 時）

預設 `index.html` 內含裸 Finnhub key。要隱藏 + 自動抓 BLS：部署 `worker/`（見 `worker/DEPLOY.md`），把網址填進 `CONFIG.PROXY`，再把 `FINNHUB_KEY` 清空。
