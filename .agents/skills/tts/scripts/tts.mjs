import path from "path";
import fs from "fs";
import { speakerMap } from "./speaker.mjs";
import ttsByFishApi from "./ttsByFishApi.mjs";

export async function tts({ text, outfile, speaker }) {
  if (!speaker) {
    throw new Error("speaker is required");
  }
  const referenceId = speakerMap[speaker.toLowerCase()];
  if (!referenceId) {
    throw new Error(`speaker ${speaker} not found`);
  }
  fs.mkdirSync(path.dirname(outfile), { recursive: true });

  await ttsByFishApi({ text, outfile, referenceId });
}
export default tts;