import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { writeFile } from "fs/promises";
import { checkAPIKey } from "./util.mjs";

const SUPPORTED_FORMATS = new Set(["mp3", "wav", "pcm", "opus"]);

export async function ttsByFishApi({ text, outfile, referenceId }) {
  checkAPIKey();
  const key = process.env.FISH_AUDIO_API_KEY;
  const format = path.extname(outfile).slice(1).toLowerCase();
  if (!SUPPORTED_FORMATS.has(format)) {
    throw new Error(
      `unsupported format: .${format} (must be mp3/wav/pcm/opus)`,
    );
  }
  const body = JSON.stringify({
    text,
    format: format,
    latency: "normal",
    ...(referenceId ? { reference_id: referenceId } : {}),
  });

  const res = await fetch("https://api.fish.audio/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      model: "s2-pro",
    },
    body,
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `Fish TTS failed: ${res.status} ${res.statusText} ${errText}`,
    );
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(outfile, buf);
}
export default ttsByFishApi;
