import { run } from "@autoclickpro/run";
import { tts } from "./tts.mjs";
import { $ } from "zx";
import { verify } from "./verify.mjs";
import path from "node:path";
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import assert from "assert";
import { checkAPIKey } from "./util.mjs";

run({
  async ttsBySpeaker({ text, speaker, out }) {
    assert(speaker, "speaker is required");
    assert(text, "text is required");
    const cwd = process.cwd();
    const outfile = path.resolve(
      out || `${cwd}/output/${speaker}-${text.slice(0, 2)}.mp3`,
    );
    await tts({
      text,
      outfile,
      speaker,
    });
    await verify(outfile);
    console.log(`tts done. output file is ${outfile}`);
    // await $`ffplay ${outfile} -autoexit`;
  },
  async ttsByFile({ file }) {
    assert(file, "file is required");
    const filePath = path.resolve(file);
    const lines = JSON.parse(await readFile(filePath, "utf8"));
    for (const item of lines) {
      for (const speaker of Object.keys(item)) {
        const text = item[speaker];
        await this.ttsBySpeaker({
          text,
          speaker,
          out: `${path.dirname(filePath)}/${speaker}-${text.slice(0, 2)}.mp3`,
        });
      }
    }
  },
  async verify({ file }) {
    await verify(file);
    console.log(`verify passed: ${file}`);
  },
  async checkAPIKey() {
    checkAPIKey();
  },
  async init() {
    await $`npm install`;
    if (!fs.existsSync(".env")) {
      await $`touch .env && echo "FISH_AUDIO_API_KEY=" > .env`;
    }
  },
});
