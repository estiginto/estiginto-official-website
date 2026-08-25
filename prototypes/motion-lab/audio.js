const cueProfiles = {
  dune: [
    { from: 38, to: 48, gain: 0.1, delay: 0, duration: 4.9, type: "sine" },
    { from: 61, to: 43, gain: 0.045, delay: 0.8, duration: 3.7, type: "triangle" },
  ],
  vortex: [
    { from: 74, to: 610, gain: 0.055, delay: 0, duration: 4.1, type: "sine" },
    { from: 131, to: 880, gain: 0.025, delay: 0.45, duration: 3.5, type: "sawtooth" },
    { from: 210, to: 96, gain: 0.035, delay: 2.7, duration: 1.5, type: "triangle" },
  ],
  hybrid: [
    { from: 34, to: 44, gain: 0.09, delay: 0, duration: 5.5, type: "sine" },
    { from: 84, to: 520, gain: 0.04, delay: 2.4, duration: 3.1, type: "triangle" },
    { from: 185, to: 72, gain: 0.028, delay: 3.3, duration: 2.1, type: "sawtooth" },
  ],
};

export function createAudioEngine({
  contextFactory = () => new (window.AudioContext || window.webkitAudioContext)(),
} = {}) {
  let isEnabled = false;
  let audioContext = null;
  const activeSources = new Set();
  const activeNodes = new Set();

  const disconnect = (node) => {
    try { node.disconnect(); } catch { /* node already disconnected */ }
  };

  const stop = () => {
    activeSources.forEach((source) => {
      try { source.stop(); } catch { /* source already stopped */ }
      disconnect(source);
    });
    activeNodes.forEach(disconnect);
    activeSources.clear();
    activeNodes.clear();
  };

  const setEnabled = async (next) => {
    isEnabled = Boolean(next);
    if (!isEnabled) {
      stop();
      return false;
    }

    if (!audioContext) audioContext = contextFactory();
    if (audioContext.state === "suspended") await audioContext.resume();
    return true;
  };

  const playCue = (kind) => {
    if (!isEnabled || !audioContext) return;
    stop();

    const profile = cueProfiles[kind] ?? cueProfiles.hybrid;
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(kind === "vortex" ? 1800 : 680, audioContext.currentTime);
    filter.Q.setValueAtTime(0.7, audioContext.currentTime);
    filter.connect(audioContext.destination);
    activeNodes.add(filter);

    profile.forEach(({ from, to, gain, delay, duration, type }) => {
      const startAt = audioContext.currentTime + delay;
      const endAt = startAt + duration;
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(from, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(to, endAt);
      oscillator.detune.setValueAtTime((delay * 19) % 13, startAt);
      envelope.gain.setValueAtTime(0.0001, startAt);
      envelope.gain.exponentialRampToValueAtTime(gain, startAt + Math.min(0.75, duration * 0.25));
      envelope.gain.setTargetAtTime(0.0001, endAt - Math.min(0.8, duration * 0.2), 0.24);
      oscillator.connect(envelope);
      envelope.connect(filter);
      oscillator.start(startAt);
      oscillator.stop(endAt + 0.35);
      oscillator.onended = () => {
        activeSources.delete(oscillator);
        activeNodes.delete(envelope);
        disconnect(oscillator);
        disconnect(envelope);
      };
      activeSources.add(oscillator);
      activeNodes.add(envelope);
    });
  };

  return {
    get enabled() { return isEnabled; },
    setEnabled,
    playCue,
    stop,
  };
}
