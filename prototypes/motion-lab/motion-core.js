export function createPlaybackController({
  scenes,
  sceneOrder,
  audio,
  now = () => performance.now(),
  requestFrame = (callback) => requestAnimationFrame(callback),
  cancelFrame = (id) => cancelAnimationFrame(id),
  onSceneChange = () => {},
  onProgress = () => {},
  onComplete = () => {},
  context = {},
}) {
  let activeId = null;
  let activeScene = null;
  let frameId = null;
  let startedAt = 0;

  const stopActive = () => {
    if (frameId !== null) cancelFrame(frameId);
    frameId = null;
    activeScene?.stop();
    audio.stop();
  };

  const tick = (timestamp) => {
    if (!activeScene) return;
    const elapsed = Math.max(0, timestamp - startedAt);
    const progress = Math.min(1, elapsed / activeScene.duration);
    activeScene.render(progress, elapsed);
    onProgress(progress, elapsed, activeId);

    if (progress < 1) {
      frameId = requestFrame(tick);
      return;
    }

    frameId = null;
    onComplete(activeId);
  };

  const play = (id) => {
    const nextScene = scenes[id];
    if (!nextScene) throw new RangeError(`Unknown motion scene: ${id}`);

    stopActive();
    activeId = id;
    activeScene = nextScene;
    startedAt = now();
    activeScene.start(context);
    audio.playCue(id);
    onSceneChange(id, activeScene.duration);

    if (context.reducedMotion) {
      activeScene.render(1, activeScene.duration);
      onProgress(1, activeScene.duration, activeId);
      onComplete(activeId);
      return;
    }

    frameId = requestFrame(tick);
  };

  return {
    get currentId() { return activeId; },
    play,
    replay() {
      if (activeId) play(activeId);
    },
    selectRelative(delta) {
      const index = Math.max(0, sceneOrder.indexOf(activeId));
      const nextIndex = (index + delta + sceneOrder.length) % sceneOrder.length;
      play(sceneOrder[nextIndex]);
    },
    stop: stopActive,
    destroy() {
      stopActive();
      activeId = null;
      activeScene = null;
    },
  };
}
