# 客戶 Logo 官方高解析來源盤點

查核日期：2026-08-29

範圍：`src/clientLogoMarquee.js` 的 tier 1／2，優先處理 Lotus 美時化學製藥與容易看出底圖、留白或舊稿痕跡的項目。

來源原則：只採品牌官網、官方媒體資料、官方報告及官方下載檔；不採 Logo 彙整站、百科、社群轉貼或搜尋結果縮圖。

## 結論摘要

現有檔案名義上都是 960×480 WebP，但 `img/client-logos/manifest.json` 顯示多數 Logo 本體只占畫布的一小部分，例如 Lotus 的內容區為 816×278、TWSE 為 816×151、臺北市建築師公會為 816×134。視覺上「太小」主要是來源圖已含底色／留白，再被放進固定畫布，而不只是輸出像素不足。

重製時應從官方 SVG 或高解析透明 PNG 開始，裁成透明、緊邊界畫布，再套一致的安全留白。不要直接放大現有 WebP。

## 最優先可下載清單

| 優先 | client id | 官方直接資產 | 格式／尺寸 | 可替換性 | 說明 |
|---|---|---|---|---|---|
| 1 | `lotus` | [現行淺底版完整字標](https://api.lotuspharm.com/storage/site/01KAWVEEKRNFET78H88CGM3J4H.png) | 透明 PNG，300×124 | 高 | 官方現行頁首淺底版，可取代附圖中的自製黃底舊稿。雖非向量，但邊緣乾淨、無底圖。 |
| 2 | `marketech` | [官方頁首 Logo](https://www.micb2b.com/www/theme/default/images/header.logo.svg) | SVG，150.739×47.107 viewBox | 高 | 第一方 SVG，最適合重新輸出。 |
| 3 | `yang-ming` | [官方網站完整 Logo](https://www.yangming.com/_next/static/media/ymfulllogo.3fdzku7itpe7i.png) | 透明 PNG，1438×192 | 高 | 官方網站部署資產，解析度高；網址含 build hash，應下載保存，不宜長期 hotlink。 |
| 4 | `taiwan-mainstream-coop` | [官方頁首 Logo](https://www.hucc-coop.tw/images/logo.png) | 透明 PNG，2579×1029 | 高 | 高解析第一方資產，可移除現有青綠底條並重新做透明版。 |
| 5 | `trade-negotiations` | [官方頁首 Logo](https://www.ey.gov.tw/Template/OTN/images/logo.png) | 透明 PNG，398×79 | 高 | 行政院經貿談判辦公室官網 CSS 實際引用的 Logo，比例也適合跑馬燈。 |
| 6 | `ey` | [官方黑色 Logo 高解析檔](https://www.ey.com/content/dam/ey-unified-site/ey-com/en-gl/generic/images/ey-logo-black.jpg) | URL 副檔名 JPG；實際回應為 PNG payload，3840×2560、白底 | 中高 | 第一方且高解析，但需裁大量白邊；全球版只有 EY，不含現有檔的「安永」中文，替換前需確認是否保留台灣中文 lockup。 |
| 7 | `jung-kwan-jang` | [KGC 官方新版 BI](https://www.kgc.co.kr/_resources/assets/img/brand/gate-logo-11.svg) | SVG，600×218 | 中 | 清晰且官方，但屬新版 JungKwanJang 英文字標，和現有舊版中文／商品章圖不同；需先確認能否更新歷史合作識別。 |

## Lotus 美時化學製藥

### 建議使用

- 來源頁：[Lotus 官方英文首頁](https://www.lotuspharm.com/en)。頁面初始設定明確標示 `logoHeaderBlackSrc`、`logoHeaderWhiteSrc` 與 `logoFooterSrc`，頁首 `<img>` 也直接使用同一官方 API 網域。
- 淺色背景首選：[彩色字標＋黑色副標](https://api.lotuspharm.com/storage/site/01KAWVEEKRNFET78H88CGM3J4H.png)，透明 PNG，300×124，6,924 bytes。
- 深色背景備用：[彩色字標＋白色副標](https://api.lotuspharm.com/storage/site/01KAWVCV72Q3H0K0K5DVEJJWQP.png)，透明 PNG，300×124，7,069 bytes。
- 單色備用：[全黑頁尾版](https://api.lotuspharm.com/storage/site/01KAWTPEGF65PPWEFRGS01DJXA.png)，透明 PNG，300×124。

### 不建議直接使用

- [官方 `lotus-logo.svg`](https://www.lotuspharm.com/icons/lotus-logo.svg) 雖是 SVG（236×512 viewBox），但只有細長品牌符號，不是完整 Lotus Pharmaceutical 字標。
- [2019 官方新聞稿](https://jp.lotuspharm.com/Media/consolidatedrevenuesept-19press-release.pdf) 仍可見與附圖相近的舊式黃色矩形識別，但它只是 PDF 內嵌舊視覺，並非官方獨立 Logo 下載包。

判斷：如果目標是採用品牌現行識別，淺底透明 PNG 可以可靠取代目前黃底自製稿；如果網站刻意展示合作當年的舊識別，應先向客戶確認是否允許改版。

## 其他 tier 1／2 查核結果

| client id | 品牌／機關 | 第一方直接資產 | 來源頁 | 格式／已驗證尺寸 | 是否可可靠替換 |
|---|---|---|---|---|---|
| `marketech` | Marketech／帆宣 | [header.logo.svg](https://www.micb2b.com/www/theme/default/images/header.logo.svg) | [官方首頁](https://www.micb2b.com/)、[官方商標說明](https://www.micb2b.com/legal-notice-and-trademark-information/) | SVG，150.739×47.107 | **是，高。** 官網頁首直接使用，且官方商標頁確認 MIC／Marketech 標誌權利。 |
| `ezoom` | eZoom 宜眾 | [cropped-ezoom-logoline.png](https://www.ezoominfo.com/wp-content/uploads/2021/04/cropped-ezoom-logoline.png) | [官方首頁](https://www.ezoominfo.com/) | 透明 PNG，270×45 | **可以但收益低。** 官方且比例乾淨，但解析度普通，未必明顯優於現有內容。 |
| `tradevan` | 關貿網路 | [官方 Logo JPG](https://www.trade-van.com/big-images/logo.jpg) | [官方首頁](https://www.trade-van.com/) | JPEG，192×55 | **不建議優先。** 第一方但解析度比現有重製需求低，適合做比對基準，不適合放大。 |
| `ey` | EY 安永 | [EY Logo black](https://www.ey.com/content/dam/ey-unified-site/ey-com/en-gl/generic/images/ey-logo-black.jpg)；[頁尾透明版](https://www.ey.com/content/dam/ey-unified-site/site-resources/ey-com/ey-logo-footer.png) | [EY Global 官方首頁](https://www.ey.com/en_gl) | 高解析檔 3840×2560、白底；頁尾 PNG 171×200、透明 | **有條件。** 官方全球識別無「安永」中文，需確認台灣中文 lockup 需求；高解析檔須裁白邊。 |
| `lotus` | Lotus 美時 | [淺底完整字標](https://api.lotuspharm.com/storage/site/01KAWVEEKRNFET78H88CGM3J4H.png) | [官方首頁](https://www.lotuspharm.com/en) | 透明 PNG，300×124 | **是，高。** 現行官網字標；是否從歷史黃色識別更新為現行版，仍建議取得客戶確認。 |
| `commonwealth` | 天下雜誌 | 無獨立 Logo 包；[官方 Media Kit PDF](https://storage.googleapis.com/event-cw-com-tw/MediaKit/MediaKit_CW_2023.pdf) | [官方廣告刊登頁](https://www.cw.com.tw/saleskit/) | PDF | **暫不自動換。** 官方 PDF 可作清晰比對／擷取來源，但不是官方獨立 Logo 下載包；現有紅底 lockup 可能是特定時期識別。 |
| `morinaga` | 台灣森永製菓 | [台灣官網 Logo](https://www.morinaga.com.tw/assets/img/logo.png)；另有[日本森永現行 SVG](https://www.morinaga.co.jp/assets/img/share/header_logo.svg) | [台灣森永官方首頁](https://www.morinaga.com.tw/)、[日本森永官方首頁](https://www.morinaga.co.jp/) | 台灣版透明 PNG 300×258；日本版 SVG 218.23×28.9 viewBox | **不建議直接跨版替換。** 台灣官方 PNG 與現有天使／中英文字樣接近但解析度普通；日本 SVG 是不同橫式企業字標。 |
| `jung-kwan-jang` | 正官庄 | [新版 BI SVG](https://www.kgc.co.kr/_resources/assets/img/brand/gate-logo-11.svg) | [KGC 官方品牌故事／BI 說明](https://www.kgc.co.kr/en/business-brand/jungkwanjang-brand-story.do) | SVG，600×218 | **有條件。** 官方且清晰，但新版 BI 與現有舊中文章圖差異大；需確認是否更新歷史識別。 |
| `yang-ming` | 陽明海運 | [ymfulllogo PNG](https://www.yangming.com/_next/static/media/ymfulllogo.3fdzku7itpe7i.png) | [官方首頁](https://www.yangming.com/en) | 透明 PNG，1438×192 | **是，高。** 官方網站程式直接載入並標為 YM Logo；下載後重新裁留白即可。 |
| `you-ming-huei` | 台詮科技 YMH | [官方 Logo PNG](https://www.ymhcogroup.com/images/YMH-Logo/logo.png) | [官方公司介紹](https://www.ymhcogroup.com/zh-TW/about) | 透明 PNG，300×65 | **有條件。** 第一方，但須先視覺核對現有合作主體及英文公司名是否完全一致。 |
| `taiwan-mainstream-coop` | 主婦聯盟合作社 | [官方 Logo PNG](https://www.hucc-coop.tw/images/logo.png) | [官方首頁](https://www.hucc-coop.tw/) | 透明 PNG，2579×1029 | **是，高。** 可用來重製無青綠底條的透明版本。 |
| `king-life` | 徠福文具 | [官方淺底 Logo PNG](https://www.kinglife.com.tw/uploads/setting/logo-dark.png) | [官方公司介紹](https://www.kinglife.com.tw/about) | 透明 PNG，207×90 | **是，中。** 第一方、比例合適；綠色 LIFE 方塊與藍色 KING LIFE 皇冠都是原始識別，沒有舊稿的整條青綠底。 |
| `bureau-foreign-trade` | 經濟部國際貿易局／現國際貿易署 | [官方 PNG 素材 ZIP](https://www.trade.gov.tw/App_Ashx/File.ashx?FileID=B86F317FBC33A692)；[官方 AI](https://www.trade.gov.tw/App_Ashx/File.ashx?FileID=96025219E7DA861C)；[官網頁首 PNG](https://www.trade.gov.tw/images/Logo.png) | [官方 Logo 設計與下載頁](https://www.trade.gov.tw/Pages/Detail.aspx?nodeID=1068&pid=775974) | ZIP 內 PNG；AI／PDF payload；頁首透明 PNG 460×62 | **資產品質最高，但不應直接換。** client 名稱是舊制「國際貿易局」，官方現為「國際貿易署」且識別已更新；替換會改寫歷史合作身份。 |
| `trade-negotiations` | 行政院經貿談判辦公室 | [官方 Logo PNG](https://www.ey.gov.tw/Template/OTN/images/logo.png) | [官方首頁](https://www.ey.gov.tw/otn/) | 透明 PNG，398×79 | **是，高。** 官網 `custom.css` 的 `.logo` 直接引用此檔。 |
| `taipei-architects` | 臺北市建築師公會 | [官方 Logo JPG](https://www.arch.org.tw/images/logo.jpg) | [官方首頁](https://www.arch.org.tw/) | JPEG，283×48 | **不建議優先。** 第一方但低解析，主要適合作樣式核對。 |
| `taiwan-stock-exchange` | 臺灣證券交易所 | 無獨立圖片；官網 Logo 由 [`icon.woff2`](https://www.twse.com.tw/res/fonts/icon.woff2) glyph 與 CSS 組成；另有[官方 2023 年報 PDF](https://www.twse.com.tw/downloads/zh/about/company/annual_112.pdf) | [官方首頁](https://www.twse.com.tw/zh/)、[官方年報頁](https://www.twse.com.tw/en/about/company/annuals.html) | WOFF2／PDF | **暫不自動換。** PDF 內有清晰向量 Logo，但「從報告擷取」不等同官方提供可重用 Logo 包；宜向 TWSE 索取正式 CI 檔。 |

## 尚未找到理想第一方下載資產

以下 tier 1 項目在本輪未找到具足夠證據、可直接下載且解析度更好的官方資產，因此不應用二手 Logo 網站補齊：

- `spg`：SPG 冠亞資產管理顧問
- `kyl-auction`：高雄永樂拍賣
- `kyce`：國裕建設

這三個品牌若要換圖，最可靠途徑是向原客戶窗口索取 SVG／AI／PDF 品牌檔，並確認 Logo 使用授權與合作年份版本。

## 建議實作順序

1. 先下載 Lotus 淺底透明 PNG、Marketech SVG、陽明 1438px PNG、主婦聯盟 2579px PNG、OTN 透明 PNG。
2. 以透明緊邊界重新輸出 WebP，再統一加相同百分比安全留白；不要沿用來源圖片原有的白底、紅底或青綠底條。
3. EY、正官庄、森永先確認要「現行全球識別」還是「合作當年台灣識別」。
4. 國際貿易局先確認是否可改成現制國際貿易署；若不可，保留歷史 Logo 並向機關索取舊版 CI 原檔。
5. TWSE、天下雜誌及解析度偏低的關貿網路／臺北市建築師公會，優先向品牌方索取正式 CI，不建議從第三方或搜尋圖替換。

## 技術與授權注意

- 以上「可可靠替換」表示來源真實性與畫質足夠，不等於品牌已授權本站任意修改。實際上線仍應依原合作關係或取得品牌方同意。
- 官方網站的 hash 資產網址（尤其陽明）可能隨部署改變；應下載到專案、保留本文件的來源頁與查核日期，不要 hotlink。
- AI 檔可能以 PDF 相容格式傳送；這是正常的 Adobe Illustrator 儲存方式，仍應使用 Illustrator／相容工具開啟並輸出。
