# 經濟數據行事曆（BLS / Census iCal）

BLS、Census 網站在 Akamai 反爬牆後面，且不發 CORS header，
所以**網頁無法 live 抓**。改成手動下載 `.ics` 放這裡，網頁同源讀取（無 CORS / 無反爬）。

## 怎麼更新（一年一次即可）

用「你自己的瀏覽器」打開下列頁面，點 **Download iCalendar**，存成指定檔名放本資料夾：

| 檔名         | 來源頁面                                                  | 內容        |
| ------------ | --------------------------------------------------------- | ----------- |
| `cpi.ics`    | https://www.bls.gov/schedule/news_release/cpi.htm         | CPI         |
| `ppi.ics`    | https://www.bls.gov/schedule/news_release/ppi.htm         | PPI         |
| `retail.ics` | https://www.census.gov/economic-indicators/（Advance Retail Sales） | 零售銷售 |

想加別的（PCE、GDP、就業…）：下載對應 `.ics`，再到 `index.html` 的
`CONFIG.ICS_FILES` 陣列加一行路徑即可。

檔案不存在時網頁會自動略過，不會報錯。每個 `.ics` 含整年日期，網頁只顯示當週。
