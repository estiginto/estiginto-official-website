# Estiginto 進場動畫實作紀錄 v08

日期 2026-11-14（台北時間）

使用者要求發布已確認的圓環進場動畫，並補充英文字標再縮小、中文「造物者科技」改為粗體。英文字標寬度從 min(64vw, 680px, 75svh) 調整為 min(46vw, 480px, 54svh)，中文改為 700。圓環近鏡掠過及遮罩轉化沿用 v07。

發布以 origin/master 最新正式站來源為基礎，僅整合 PageTransition 元件及對應樣式，保留最新首頁三秒進場時長及其他頁面內容。原工作區含其他未提交修改，保持原狀。

本輪隔離工作目錄預定由 create_worktree 建立 brand-entry-v08。來源約 61 MiB，沿用鎖檔一致的原工作區依賴，禁止安裝或更新共享依賴。建置及本輪暫存上限 100 MiB，隔離目錄合計上限 180 MiB；既有動畫驗收證據上限 40 MiB，本輪新增證據上限 5 MiB，流程合計上限 225 MiB。超限即停止新增產物。完成或失敗時停止本輪預覽程序、移除本輪依賴連結，保留必要證據並以 archive_worktree 回收隔離來源與建置。中斷後須依本紀錄核對程序與目錄身分才繼續。

隔離根目錄為 `C:/Users/arhsp/.codex/worktrees/brand-entry-v08/estiginto-official-website`，分支 `codex/brand-entry-v08`。原目錄與正式來源的 package-lock.json SHA256 均為 D7A7493F221B183585670E7A55E1C0E299ECAEA9D44D42C0049676AF502C0E79，僅在建置期間以 junction 共用依賴，使用 configLoader runner 避免寫入共享 .vite-temp，finally 移除本輪 junction。

已完成本機驗收：234 項測試通過，Vite 建置成功，234 個輸出檔案共 24.89 MiB 通過靜態檢查。Windows checkout 的 CRLF 導致既有多語 HTML 冪等測試失敗，核對 HTML 與 Git blob 內容一致並恢復 LF 後全部通過，沒有提交 HTML 或修改測試。

Edge 實播 1280 × 900 與 320 × 720，英文字標實際寬度為 480 px 與 147.1875 px，中文 font-weight 為 700，標誌正常載入、文字完整顯示且沒有橫向溢出。圓環近鏡、遮罩轉化、首頁接續皆已觀察；減少動態模式在 1500 ms 等待上限內進入 idle 並移除動畫內容，未出現 console error。本輪來源與建置合計約 85.28 MiB，依賴 junction 已移除，未新增依賴副本。

狀態：本機驗證完成，準備發布。正式部署結果另記於原專案 output/vortex-entry-qa/Estiginto_進場動畫_發布紀錄_v08.json，避免為補記結果觸發第二次部署。
