---
name: tts
description: Convert text to speech with any speaker automatically . Trigger when the user asks to " "TTS", "generate voice/audio"
---

# TTS

Convert a piece of text to speech with any speaker and auto-play it. if error occurs, tell the error message and fix the problem at the same time.

## Usage

for the first time, you need to init the environment first:

```bash
 `node "<Base directory for this skill>/scripts/cli.mjs" init` to init the enviroment.
```

then you can run the following command to convert `speaker:content` to speech:

```bash
node "<Base directory for this skill>/scripts/cli.mjs" tts --speaker <speaker> --text "<text>" --out <xxx.mp3>
```

OR you tts from a file, the file should be a json file with content like this:

```json
[
  {
    "speaker1": "text1",
    "speaker2": "text2"
  },
  {
    "speaker2": "text2"
  }
]
```

then run the command:

```bash
node "<Base directory for this skill>/scripts/cli.mjs" ttsByFile --file <filePath>
```

**input options**:

- `--speaker` is required, specify the speaker's name.
- `--text` is required, specify the text to be converted to speech.
- `--out` is optional, if not provided, the output file will be `./output/<speaker>-<first two chars of text>.mp3`

**output**:
If successful, inform the user: "Output file: `${outfile}`, auto-played with `ffplay`."

## Prerequisites

1. Ask the user to apply for a FISH_AUDIO_API_KEY on the fish.audio website and give the `FISH_AUDIO_API_KEY` to you , then you write the value into the `.env` file in the skill root directory (same level as SKILL.md).
2. check whether System has `ffplay` installed (comes with ffmpeg)

## Verify

Need to check whether the generated mp3 file is valid and can be played.
