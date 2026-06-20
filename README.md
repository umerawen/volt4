# VOLT // DRAFT

A real-time Valorant community auction draft web app — a dark, cinematic esports
command center for running a live player auction. Captains claim password-gated
seats, a "fate wheel" nominates players, teams bid against each other in real time,
and rosters fill out under a salary-cap budget. Built as a single-file React app
with a unified blue HUD theme, Tungsten display type, notched clip-path components,
a fully synthesized Web Audio sound system, and a private War Room mock-draft
sandbox for each captain.

## Screens

- **Lobby** — full-bleed hero, live ticker, rules.
- **Scout Hub** — searchable operator database with performance radars.
- **Auction Block** — the fate-wheel draw, live bidding, budget bars.
- **Locker Room** — every team's roster and remaining budget.
- **War Room** — each captain's private, passcode-gated mock-draft planner.

Roles: **Commissioner** (runs the auction), **Captain** (claims a password-gated
seat and bids), and **Player** (read-only spectator).

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Build

```bash
npm run build
npm run preview
```

## A note on real-time sync

This app was originally built inside Anthropic's Claude artifact environment, where
`window.storage` is provided by Anthropic and **syncs live across every connected
client** — that's what makes the auction genuinely multiplayer in real time.

Outside that environment there is no shared backend, so `src/storage-shim.js` backs
the same API with `localStorage`. The app runs and persists in a single browser, but
separate people/tabs will not see each other's auction update live. To restore true
multi-client sync, point the `get`/`set` methods in the shim at your own backend
(for example a small key-value store with websockets or polling).

## Tech

React 18 · Vite · Tailwind CSS · Web Audio API (all sound is synthesized, no audio files).
