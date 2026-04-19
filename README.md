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
