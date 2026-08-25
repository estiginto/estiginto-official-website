# Motion Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個本機限定、可切換與重播三款電影感入場動畫的獨立實驗頁。

**Architecture:** `prototypes/motion-lab/index.html` 提供舞台與控制介面，`motion-lab.js` 管理單一播放生命週期、Canvas 與 Web Audio，`scenes.js` 提供三款具有相同介面的場景。`motion-lab.css` 負責共用品牌落地畫面、遮罩、轉場與響應式配置。

**Tech Stack:** 原生 HTML、CSS、JavaScript、Canvas 2D、Web Audio API、Node.js test runner、Vite 7。

**Spec:** `docs/superpowers/specs/2026-08-24-motion-lab-design.md`

## Global Constraints

- 實驗頁固定放在 `prototypes/motion-lab/`，不得加入 `vite.config.js` 的 Rollup input。
- 不修改首頁、導覽、既有頁面轉場或目前未提交的使用者變更。
- 不新增第三方套件，也不使用電影畫面、角色、Logo、配樂或其他受版權保護素材。
- 聲音預設關閉，只能由使用者手動開啟。
- 支援桌機、手機、鍵盤操作與 `prefers-reduced-motion`。

---

### Task 1: 建立本機展示頁契約

**Files:**
- Create: `tests/motion-lab.test.mjs`
- Create: `prototypes/motion-lab/index.html`
- Create: `prototypes/motion-lab/motion-lab.css`

**Interfaces:**
- Produces: `[data-motion-lab]` 根節點、`#motion-canvas`、`#motion-overlay`、`[data-scene]`、`[data-action="replay"]`、`[data-action="sound"]` 與狀態文字節點。

- [ ] **Step 1: 寫失敗的頁面契約測試**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const htmlPath = new URL("../prototypes/motion-lab/index.html", import.meta.url);
const vitePath = new URL("../vite.config.js", import.meta.url);

test("motion lab exposes three local-only scenes and controls", async () => {
  const html = await readFile(htmlPath, "utf8");
  assert.match(html, /data-motion-lab/);
  assert.equal((html.match(/data-scene=/g) ?? []).length, 3);
  assert.match(html, /data-action="replay"/);
  assert.match(html, /data-action="sound"/);
  assert.match(html, /aria-live="polite"/);
});

test("motion lab is excluded from production rollup inputs", async () => {
  const vite = await readFile(vitePath, "utf8");
  assert.doesNotMatch(vite, /motion-lab/);
});
```

- [ ] **Step 2: 執行測試並確認因頁面不存在而失敗**

Run: `node --test tests/motion-lab.test.mjs`

Expected: FAIL with `ENOENT` for `prototypes/motion-lab/index.html`.

- [ ] **Step 3: 建立可存取的頁面骨架與響應式控制區**

HTML 必須包含三個 `button[data-scene]`，值依序為 `dune`、`vortex`、`hybrid`；Canvas 與 overlay 放在同一個 `.motion-stage`；控制列提供 replay、sound、previous、next。CSS 建立深色全螢幕頁、16:9 舞台、手機直式自適應、清楚的 focus-visible 樣式，並先讓 overlay 顯示靜態 ESTIGINTO 落地畫面。

- [ ] **Step 4: 執行契約測試**

Run: `node --test tests/motion-lab.test.mjs`

Expected: 2 tests PASS.

- [ ] **Step 5: 提交頁面骨架**

```bash
git add tests/motion-lab.test.mjs prototypes/motion-lab/index.html prototypes/motion-lab/motion-lab.css
git commit -m "feat: scaffold local motion lab"
```

### Task 2: 建立可重播的生命週期與程序音效

**Files:**
- Modify: `tests/motion-lab.test.mjs`
- Create: `prototypes/motion-lab/motion-lab.js`
- Create: `prototypes/motion-lab/audio.js`

**Interfaces:**
- Consumes: Task 1 的控制器 DOM 契約。
- Produces: `createAudioEngine()`，回傳 `{ enabled, setEnabled(next), playCue(kind), stop() }`；`createMotionLab({ root, scenes, audio })`，回傳 `{ play(id), replay(), selectRelative(delta), destroy() }`。

- [ ] **Step 1: 增加靜態生命週期測試**

```js
test("motion controller cancels prior playback before starting a scene", async () => {
  const source = await readFile(new URL("../prototypes/motion-lab/motion-lab.js", import.meta.url), "utf8");
  assert.match(source, /activeScene\?\.stop\(\)/);
  assert.match(source, /cancelAnimationFrame/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
});

test("audio is opt-in and exposes explicit cleanup", async () => {
  const source = await readFile(new URL("../prototypes/motion-lab/audio.js", import.meta.url), "utf8");
  assert.match(source, /enabled:\s*false/);
  assert.match(source, /setEnabled/);
  assert.match(source, /playCue/);
  assert.match(source, /stop/);
});
```

- [ ] **Step 2: 執行測試並確認缺少控制器檔案**

Run: `node --test tests/motion-lab.test.mjs`

Expected: FAIL with `ENOENT` for `motion-lab.js` or `audio.js`.

- [ ] **Step 3: 實作共用控制器**

`play(id)` 必須先呼叫目前場景的 `stop()`、取消共用 RAF、停止音效，再設定按鈕狀態與狀態文字，最後呼叫 `scenes[id].start(context)`。`context` 精確包含 `{ canvas, overlay, reducedMotion, audio, requestFrame, setStageState }`。`visibilitychange` 在 hidden 時停止 RAF，visible 時由當前場景續播；`destroy()` 移除所有事件監聽並清理場景與音訊。

- [ ] **Step 4: 實作 Web Audio 程序音效**

`playCue("dune")` 產生低頻 oscillator 與濾波 noise；`playCue("vortex")` 產生上升頻率脈衝與短 delay；`playCue("hybrid")` 先播放低頻，再在中段加入上升脈衝。所有 GainNode 以短 attack/release 避免爆音，節點存進集合並由 `stop()` 逐一停止與斷線。首次 `setEnabled(true)` 才建立或 resume AudioContext。

- [ ] **Step 5: 執行測試並提交**

Run: `node --test tests/motion-lab.test.mjs`

Expected: 4 tests PASS.

```bash
git add tests/motion-lab.test.mjs prototypes/motion-lab/motion-lab.js prototypes/motion-lab/audio.js
git commit -m "feat: add motion playback and audio engine"
```

### Task 3: 實作三款 Canvas 場景

**Files:**
- Modify: `tests/motion-lab.test.mjs`
- Create: `prototypes/motion-lab/scenes.js`
- Modify: `prototypes/motion-lab/motion-lab.css`
- Modify: `prototypes/motion-lab/index.html`

**Interfaces:**
- Consumes: `context` 為 `{ canvas, overlay, reducedMotion, audio, requestFrame, setStageState }`。
- Produces: `scenes` 物件，鍵為 `dune | vortex | hybrid`；每個值實作 `{ duration: number, start(context): void, stop(): void }`。

- [ ] **Step 1: 增加三場景出口契約測試**

```js
test("three scenes share the same lifecycle contract", async () => {
  const source = await readFile(new URL("../prototypes/motion-lab/scenes.js", import.meta.url), "utf8");
  for (const id of ["dune", "vortex", "hybrid"]) {
    assert.match(source, new RegExp(`${id}:\\s*createScene`));
  }
  assert.match(source, /start\(context\)/);
  assert.match(source, /stop\(\)/);
});
```

- [ ] **Step 2: 執行測試並確認缺少 scenes.js**

Run: `node --test tests/motion-lab.test.mjs`

Expected: FAIL with `ENOENT` for `scenes.js`.

- [ ] **Step 3: 實作共用 Canvas 基礎與沙丘場景**

建立限制 DPR 最大為 2 的 resize helper、seeded pseudo-random 粒子、時間正規化與 eased phase helper。`dune` 時長 5600ms：0–15% 黑場，15–48% 地平線與沙塵浮現，48–78% 巨型字標與低頻光脈衝，78–100% 中央光縫打開並揭露 overlay。

- [ ] **Step 4: 實作時間漩渦場景**

`vortex` 時長 4600ms：用極座標環、旋轉節點、向外星線及青／琥珀色差製造前進感；0–58% 加速，58–72% 失重反轉，72–100% 環收斂到中央並鎖定品牌畫面。文字重影由 CSS 的 stage state class 控制。

- [ ] **Step 5: 實作混合場景與 reduced-motion 版本**

`hybrid` 時長 6200ms：0–42% 重用地平線與沙塵語言，42–74% 加入中央折疊線和旋轉時間刻度，74–100% 將所有粒子坍縮成門並揭露 overlay。當 `reducedMotion` 為 true，三款都跳過高速粒子更新，只畫各自靜態構圖並在 500ms 內淡入 overlay。

- [ ] **Step 6: 執行測試並提交**

Run: `node --test tests/motion-lab.test.mjs`

Expected: 5 tests PASS.

```bash
git add tests/motion-lab.test.mjs prototypes/motion-lab/index.html prototypes/motion-lab/motion-lab.css prototypes/motion-lab/scenes.js
git commit -m "feat: create three cinematic motion scenes"
```

### Task 4: 整體驗證與本機預覽

**Files:**
- Modify only if verification finds defects: `prototypes/motion-lab/*`, `tests/motion-lab.test.mjs`

**Interfaces:**
- Consumes: 完整 motion lab。
- Produces: 可由 Vite 本機開啟、正式 build 不含該入口的已驗證原型。

- [ ] **Step 1: 執行原型與全站測試**

Run: `node --test tests/motion-lab.test.mjs`

Expected: 5 tests PASS.

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 2: 驗證正式建置排除原型入口**

Run: `npm run build`

Expected: PASS，輸出清單中沒有 `motion-lab.html` 或 `prototypes/motion-lab/index.html`。

- [ ] **Step 3: 啟動本機 Vite 並進行瀏覽器檢查**

Run: `npm run dev`

Open: `http://127.0.0.1:4302/prototypes/motion-lab/`

逐項確認三款可播放、重播、前後切換；聲音預設關閉且開啟後有對應聲響；手機寬度沒有溢位；鍵盤可操作；切換十次後沒有疊加聲音或明顯加速。

- [ ] **Step 4: 檢查差異與提交修正**

Run: `git diff --check`

Expected: no output.

若 Step 1–3 產生修正：

```bash
git add tests/motion-lab.test.mjs prototypes/motion-lab
git commit -m "fix: polish motion lab playback"
```
