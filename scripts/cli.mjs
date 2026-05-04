import { run } from "../src/run.mjs";
import { tts } from "../src/tts.mjs";

run({
  async tts({ text = "你好，我是汤姆", speaker = "tom" }) {
    await tts({
      text,
      outfile: `output/${text.slice(0, 2) + ".wav"}`,
      speaker,
    });
  },
});
