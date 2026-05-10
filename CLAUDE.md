# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A text-to-speech CLI tool powered by the Fish Audio API. Converts text to speech using pre-configured speaker voices, verifies the output, and auto-plays with `ffplay`.

## Working Directory

The actual source code lives under `.agents/skills/tts/`. The root `package.json` and `node_modules` are unused leftovers. Always run commands and edit files from `.agents/skills/tts/`.

## Common Commands

All commands assume CWD is `.agents/skills/tts/`:

- **Single TTS**: `node scripts/cli.mjs tts --speaker <name> --text "<text>" --out <file.mp3>`
  - `--out` is optional; default is `./output/<speaker>-<first 2 chars of text>.mp3`
- **Batch TTS from JSON**: `node scripts/cli.mjs ttsByFile --file <path>`
  - Expected JSON format: `[{ "speaker1": "text1", "speaker2": "text2" }, ...]`
- **Verify audio file**: `node scripts/cli.mjs verify --file <path>`
- **Init environment**: `node scripts/cli.mjs init` (creates `.env` template and runs `npm install`)

## Architecture

- **CLI entry**: `scripts/cli.mjs` dispatches commands via `@autoclickpro/run`. Supported actions: `ttsBySpeaker`, `ttsByFile`, `verify`, `init`, `checkAPIKey`.
- **TTS pipeline**: `cli.mjs` → `tts.mjs` (validates speaker, ensures output dir) → `ttsByFishApi.mjs` (POST to `https://api.fish.audio/v1/tts` with `model: s2-pro`).
- **Speaker registry**: `scripts/speaker.mjs` maps lowercase speaker names to Fish Audio `reference_id` strings. New speakers must be added here.
- **Audio verification**: `scripts/verify.mjs` runs `ffmpeg -af volumedetect` to reject files that are too short (`< 4410` samples) or effectively silent (`mean_volume < -50 dB`).
- **Environment / auth**: `scripts/util.mjs` loads `.env` from the skill root (via `dotenv`) and exposes `checkAPIKey()`.
- **Standalone script**: `scripts/runtime.py` is an unrelated Aliyun DashScope voice-design experiment; it is not wired into the CLI.

## Environment Requirements

- `FISH_AUDIO_API_KEY` must be defined in `.agents/skills/tts/.env`
- `ffmpeg` and `ffplay` must be available on `$PATH`
