import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { writeFile } from "fs/promises";

const skillRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
config({ path: path.join(skillRoot, ".env") });

export function checkAPIKey() {
  if (!process.env.FISH_AUDIO_API_KEY) {
    throw new Error("FISH_AUDIO_API_KEY is not set in environment variables");
  }
}
