function tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.25) {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
    setTimeout(() => void ctx.close().catch(() => {}), dur * 1000 + 200);
  } catch {
    /* audio unavailable */
  }
}
export const playCorrect = () => tone(880, 0.3);
export const playTick = () => tone(1200, 0.04, "square", 0.08);
export const playLose = () => tone(200, 0.4, "sawtooth");
export const playWin = () => {
  tone(660, 0.2);
  setTimeout(() => tone(880, 0.2), 150);
  setTimeout(() => tone(1320, 0.4), 300);
};
