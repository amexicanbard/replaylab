# Melodic Grove

A Catholic virtue-tracking RPG for mobile. Built with Expo + React Native.

**Objective:** grow in holiness by completing daily and monthly quests tied to
real-life virtuous actions. Level up the four Cardinal and three Theological
virtues (plus the seven Heavenly virtues), resist the seven Deadly Sins, unlock
saints as companions, and use the sacraments as active abilities.

## Getting started

```bash
npm install
npx expo start
```

Then scan the QR code with **Expo Go** on your phone, or press `w` to preview
in a web browser.

### Run in Docker

No local Node install required:

```bash
docker build -t melodic-grove .
docker run --rm -p 8081:8081 melodic-grove
```

Then open http://localhost:8081. The first build takes a few minutes (npm
install inside the image); subsequent builds are cached. For live code
changes during development, add a bind mount:

```bash
docker run --rm -p 8081:8081 -v "$PWD":/app -v /app/node_modules melodic-grove
```

## Project layout

```
app/                 # expo-router screens (file-based routing)
  (tabs)/            # main tab navigator
  onboarding.tsx     # first-run "Baptism"
src/
  data/              # static game data (virtues, sins, saints, quests, sacraments)
  store/             # Zustand store with AsyncStorage persistence
  game/              # pure game logic (progression, quest engine, sin decay, saint unlocks)
  components/        # reusable UI pieces
```

## Status

Mechanics-only prototype. No custom art, sound, or animations yet.

## TCG presentation

This repo also hosts an unrelated standalone deck under
[`presentation/tcg/`](presentation/tcg/README.md) — an 11-slide HTML
executive presentation for TCG Talent & Teams.
