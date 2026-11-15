# Estiginto Hero 粒子實作紀錄 v01

日期：2026-11-15（台北時間）

使用者要求將貸解上岸的弧線粒子與滑鼠互動融入 Estiginto Hero，並交由助手評估持續滾動背景。採首頁主弧帶、下捲逐漸淡化為邊緣餘流；保留文字、導覽與 v08 進場動畫。此輪授權實作與本機驗證，尚未發布。

正式基準為 9f546c1（origin/master，進場 v08）。目前成品入口為 `C:/Users/arhsp/.codex/worktrees/hero-particle-current/estiginto-official-website`，分支 `codex/hero-particle-current`。已附加至本對話，尚未 commit／push／部署。原 checkout 尚未提交的其他修改不納入。

| 需求 | 成果位置 | 完成條件 | 狀態 |
|---|---|---|---|
| 弧線流動粒子與品牌調整 | 首頁 Hero | 白底、深藍與品牌藍、文字清楚 | 已驗證 |
| 滑鼠互動 | Hero 精細游標 | 局部排斥、平滑歸位、不擋操作 | 已驗證 |
| 捲動背景 | 首頁後續區段 | 淡化、邊緣分布、中央內容避讓 | 已驗證 |
| 手機與減少動態 | 同一元件 | 手機低密度、不劫持觸控；靜態模式無持續繪製 | 已驗證 |

## 驗證與資源範圍

本輪僅新增少量來源與測試。沿用既有 61 MiB 工作副本；既有 dist 約 24.89 MiB，核對無程序使用與連結後原地重建，不新增另一份來源或依賴。依賴鎖檔雜湊一致才借用原 checkout node_modules；不安裝、更新或寫入共享依賴，Vite 快取指定至本輪暫存。

工作副本與建置合計上限 120 MiB（不重複計入共享依賴），本輪快取／QA 上限 20 MiB，流程上限 140 MiB。超限、來源身分不明或回收失敗時停止新增大型產物。僅保留修改來源、必要畫面、測試結果與重現命令；預覽成功／失敗均停止本輪自有程序、確認 port 釋放、移除本輪依賴連結與可重建快取／建置。強制中斷後依此紀錄核對精確路徑與程序才恢復。

QA 路徑：`C:/Users/arhsp/.codex/visualizations/2026/11/15/01a1de84-fb29-7de1-a893-7c1bb7ad00df/estiginto-particles-v01`。
預覽 port：4318；本輪 node PID 74960 已停止，確認程序退出與 port 釋放。預覽連結目前不可用。

收尾發現原 linked worktree 仍由另一個已完成發布對話持有，不能附加至本對話；已移轉至本對話專用工作副本，保留完全相同基準與修改指紋。移轉期間來源合計上限 140 MiB、QA 上限 20 MiB、流程暫時上限 160 MiB；未安裝依賴或重複建置。六個移轉檔案 SHA256 逐一相同，原工作副本的本次新增檔與 App.jsx 差異已移除，恢復 codex/brand-entry-v08，git status 乾淨。

驗收：首頁桌機／手機、入場、游標去返、下捲至正文與頁尾、返回頂端、縮放、減少動態、隱藏恢復及受影響測試／建置。內頁標題保持原 renderer。

## 完成證據

- 新增 HomeParticleField.jsx、homeParticleCurrent.js、homeParticleField.css 與七項行為測試；App.jsx 僅替換首頁背景並掛載單一固定畫布。PageTitle／聯絡頁仍使用原 HeroSoulRibbon。
- 桌機 800 顆、手機 260 顆，右上較密、左下淡入；粒子柔邊避讓實際文字範圍。游標半徑 130px、最大排斥 32px。頁面下捲後只留下左右邊緣餘流，頁尾前淡出。
- Edge 實播驗證桌機 1440×900、原生約 1900×900、手機 390×844 與 320×720。中文／英文／日文桌機標題可讀，無橫向溢出。Astra 檢視桌機、手機及互動畫面後通過本次視覺驗收。
- 實際執行游標移動、往下滾動、返回頁首、語言切換與縮放；粒子流動畫面 hash 變化，減少動態穩定後相隔多次操作的畫布 hash 同為 4152439084。偏好切換後須等媒體變更事件與重繪完成再取基準，第一幀不當作穩定證據。
- 背景層 pointer-events 為 none；正文時 data-flow 為 ambient；捲至頁尾 opacity 為 0；關於頁粒子層為 0、原緞帶為 1；最後 console error／warn 為空。真實背景分頁的效能未獨立量測；停止／續播與單一 RAF 生命週期由行為測試驗證。
- 原始 Windows checkout 完整測試為 238/241，三項 metadata 冪等測試因既有 CRLF／LF 差異失敗，與 v08 紀錄一致。每個 HTML 確認正規化後與 HEAD Git blob 相同，在 try/finally 中使用原始 LF 內容驗證後恢復逐位元組原檔，完整 241/241 通過，未改測試或提交 HTML 差異。
- npm run build 與 npm run verify:dist 通過，234 個檔案共 24.89 MiB；保留原本地圖大 bundle 提醒。build-check.ps1 的 finally 已移除本輪 dist，build-lifecycle.json 記錄完成；未重複建置移轉後相同來源。
- 重現資料保留於 QA 目錄：tests.log、tests-lf.log、build.log、verify-dist.log、source-fingerprints.json 與版本化畫面。verify.mjs／build-check.ps1 記錄當時驗證入口，移轉後執行須更新其中工作目錄。

## 資源收尾與待清理

本輪預覽程序已停止，4318 已釋放；測試分頁關閉、裝置與媒體模擬已清除。新工作副本保留作為尚未發布的成品來源，沒有新增 node_modules 或 dist。

自動核准審查拒絕刪除本輪 QA/cache 與原 brand-entry-v08/node_modules 暫用 junction（指向原 checkout 的既有依賴），只回覆 blocked by policy，未提供詳細理由。改採固定絕對路徑且確認無程序與連結風險的較小清理仍被拒絕，未繞過限制。這些項目及已停止的 preview.pid 標記保留，回收未完成；不得將 junction 視為另一份依賴副本，也不得宣稱已釋出快取容量。下一輪需處理此紀錄後才新增同流程大型環境。
