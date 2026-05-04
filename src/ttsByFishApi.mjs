import { config } from "dotenv";
config();
import { writeFile } from "fs/promises";
export async function ttsByFishApi({ text, outfile, referenceId }) {
  const key = process.env.FISH_AUDIO_API_KEY;
  if (!key) {
    throw new Error("FISH_AUDIO_API_KEY is not set");
  }
    const body = JSON.stringify({
    text,
    format: "wav",
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
    throw new Error(`Fish TTS failed: ${res.status} ${res.statusText} ${errText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(outfile, buf);  
  
}
export default ttsByFishApi;