import { $ } from "zx";

export async function verify(file) {
  const proc = await $`ffmpeg -hide_banner -nostats -i ${file} -af volumedetect -f null -`.quiet().nothrow();
  const stderr = proc.stderr;
  const samples = +(stderr.match(/n_samples:\s*(\d+)/)?.[1] || 0);
  const mean = stderr.match(/mean_volume:\s*(-?inf|[-\d.]+)/)?.[1];
  if (samples < 4410) {
    throw new Error(`audio verify failed: too short (${samples} samples) — ${file}`);
  }
  if (mean === "-inf" || +mean < -50) {
    throw new Error(`audio verify failed: silent (mean_volume=${mean} dB) — ${file}`);
  }
}