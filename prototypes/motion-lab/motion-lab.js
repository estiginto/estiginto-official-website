import { createAudioEngine } from "./audio.js";
import { createPlaybackController } from "./motion-core.js";
import { scenes } from "./scenes.js";

const sceneOrder = ["dune", "vortex", "hybrid"];
const sceneMeta = {
  dune: {
    code: "ARRIVAL / 01",
    name: "沙丘式降臨",
    kicker: "VAST / RITUAL / GRAVITY",
    description: "巨大尺度先於科技感。光線、沙塵與低頻脈衝讓品牌像一座遠古文明的結構，從黑暗中緩慢抵達。",
  },
  vortex: {
    code: "TRANSIT / 02",
    name: "時間漩渦",
    kicker: "FLUX / VELOCITY / PARADOX",
    description: "空間不再可靠。時間環、星線與色差殘影快速穿過觀看者，最後在一次短暫失重後鎖定現實座標。",
  },
  hybrid: {
    code: "CONVERGENCE / 03",
    name: "混合式時空降臨",
    kicker: "GRAVITY / FOLD / ARRIVAL",
    description: "先用沉默建立文明尺度，再讓中央地平線折成一道不可能的門。品牌不是被載入，而是從另一個時間座標抵達。",
  },
};

export function formatSequenceTime(milliseconds) {
  const safeTime = Math.max(0, Math.floor(milliseconds));
  const minutes = Math.floor(safeTime / 60000);
  const seconds = Math.floor((safeTime % 60000) / 1000);
  const remainder = safeTime % 1000;
  return [minutes, seconds, remainder]
    .map((value, index) => String(value).padStart(index === 2 ? 3 : 2, "0"))
    .join(":");
}

export function getSceneMeta(id) {
  const meta = sceneMeta[id];
  if (!meta) throw new RangeError(`Unknown motion scene: ${id}`);
  return meta;
}

export function createMotionLabApp(root, {
  audio = createAudioEngine(),
  motionScenes = scenes,
  mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)"),
  documentTarget = document,
} = {}) {
  const canvas = root.querySelector("#motion-canvas");
  const overlay = root.querySelector("#motion-overlay");
  const stage = root.querySelector(".motion-stage");
  const progressBar = root.querySelector("[data-progress]");
  const stageCode = root.querySelector("[data-stage-code]");
  const stageTime = root.querySelector("[data-stage-time]");
  const stageState = root.querySelector("[data-stage-state]");
  const kicker = root.querySelector("[data-scene-kicker]");
  const description = root.querySelector("[data-scene-description]");
  const liveStatus = root.querySelector("[data-live-status]");
  const soundButton = root.querySelector('[data-action="sound"]');
  const soundLabel = root.querySelector("[data-sound-label]");
  const sceneButtons = [...root.querySelectorAll("[data-scene]")];
  const cleanups = [];

  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  const setStageState = (value) => {
    stageState.textContent = value;
    stage.dataset.phase = value.toLowerCase();
  };

  const controller = createPlaybackController({
    scenes: motionScenes,
    sceneOrder,
    audio,
    context: {
      canvas,
      overlay,
      reducedMotion: mediaQuery.matches,
      setStageState,
    },
    onSceneChange(id) {
      const meta = getSceneMeta(id);
      root.dataset.currentScene = id;
      stage.classList.add("is-playing");
      stageCode.textContent = meta.code;
      kicker.textContent = meta.kicker;
      description.textContent = meta.description;
      progressBar.style.width = "0%";
      sceneButtons.forEach((button) => {
        const selected = button.dataset.scene === id;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      liveStatus.textContent = `${meta.name}開始播放`;
    },
    onProgress(progress, elapsed) {
      progressBar.style.width = `${(progress * 100).toFixed(2)}%`;
      stageTime.textContent = formatSequenceTime(elapsed);
    },
    onComplete(id) {
      stage.classList.remove("is-playing");
      setStageState("SYNC COMPLETE");
      liveStatus.textContent = `${getSceneMeta(id).name}播放完成`;
    },
  });

  sceneButtons.forEach((button) => {
    listen(button, "click", () => controller.play(button.dataset.scene));
  });
  listen(root.querySelector('[data-action="previous"]'), "click", () => controller.selectRelative(-1));
  listen(root.querySelector('[data-action="next"]'), "click", () => controller.selectRelative(1));
  listen(root.querySelector('[data-action="replay"]'), "click", () => controller.replay());
  listen(soundButton, "click", async () => {
    const enabled = await audio.setEnabled(!audio.enabled);
    soundButton.setAttribute("aria-pressed", String(enabled));
    soundLabel.textContent = enabled ? "SOUND ON" : "SOUND OFF";
    liveStatus.textContent = enabled ? "程序聲音已開啟" : "程序聲音已關閉";
    if (enabled) controller.replay();
  });
  listen(documentTarget, "visibilitychange", () => {
    if (documentTarget.hidden) controller.stop();
    else controller.replay();
  });
  listen(root, "keydown", (event) => {
    if (event.key === "ArrowLeft") controller.selectRelative(-1);
    if (event.key === "ArrowRight") controller.selectRelative(1);
    if (event.key.toLowerCase() === "r" && !event.ctrlKey && !event.metaKey) controller.replay();
  });

  controller.play(sceneOrder[0]);

  return {
    controller,
    destroy() {
      cleanups.forEach((cleanup) => cleanup());
      controller.destroy();
    },
  };
}

if (typeof document !== "undefined") {
  const root = document.querySelector("[data-motion-lab]");
  if (root) createMotionLabApp(root);
}
