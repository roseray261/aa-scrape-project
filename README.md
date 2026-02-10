# AI Leaderboard Tracker

A tool that collects daily snapshots of AI leaderboards and lets you view how rankings change over time.

## What this project does

1. **Scrape** — Calls the Artificial Analysis API once per day to fetch leaderboard rankings.
2. **Store** — Saves each day's snapshot as a JSON file in `data/` (e.g. `text-to-image_2026-02-10.json`).
3. **Display** — (Coming soon) Show historical trends so you can see how models rise and fall.

## Leaderboards tracked

| Slug | What it tracks |
|------|---------------|
| `text-to-image` | Text-to-image model rankings (ELO) |
| `image-editing` | Image editing model rankings (ELO) |
| `text-to-video` | Text-to-video model rankings (ELO) |
| `image-to-video` | Image-to-video model rankings (ELO) |
| `text-to-speech` | Text-to-speech model rankings (ELO) |

To add a new leaderboard, add an entry to the `LEADERBOARDS` array in `scrapers/run.js`.

## Project structure

```
AA Scraping Project/
  .github/workflows/   — GitHub Actions daily schedule
  scrapers/run.js      — Single script that fetches all leaderboards
  data/                — Saved snapshots (one file per leaderboard per day)
  .env                 — Your API key (local only, never committed)
  package.json         — Project config and dependencies
```

## Running locally

```
cd scrapers
node run.js
```

## Daily schedule (GitHub Actions)

The scraper runs automatically every day at **15:00 UTC** via GitHub Actions.

**DST note:** 15:00 UTC = 10:00am Eastern in winter (EST) and 11:00am Eastern in summer (EDT). GitHub Actions cron does not support time zones, so we use a fixed UTC time. The one-hour shift during daylight saving time is a known tradeoff.

## Setup

1. Clone this repo.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the project root with your API key: `AA_API_KEY=your-key-here`
4. For GitHub Actions: add `AA_API_KEY` as a repository secret (Settings → Secrets → Actions).
