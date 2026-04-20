# LearnQuest ⚔️

Eine gamifizierte Lern-App für Schüler, gebaut mit Expo (React Native + TypeScript).

## Konzept

LearnQuest soll Schüler dazu bringen, **regelmäßig und effizient zu lernen**, indem Lernen sich wie ein Spiel anfühlt. Motivation entsteht durch:

- **Fortschritt** — XP, Level-System, sichtbare Fortschrittsbalken, tägliches Ziel
- **Wettbewerb** — Live-Bestenliste mit anderen Lernenden
- **Belohnung** — Abzeichen (Achievements), Streaks, XP-Boni bei perfekten Quizzes

## Features (MVP)

- 🎮 **Onboarding** mit Avatar-Auswahl
- 📊 **Home-Dashboard** mit XP, Level, Streak und Tagesziel
- 🎯 **Tägliche Challenge** mit 2× XP Bonus
- 📚 **5 Fächer**: Mathematik, Englisch, Biologie, Geschichte, Geografie
- ❓ **Quiz-Modus** mit Multiple-Choice-Fragen, sofortigem Feedback und Erklärungen
- 🎲 **Gemischtes Zufalls-Quiz** über alle Fächer
- 🔥 **Streak-System** (Tage in Folge)
- 🏆 **Bestenliste** (Leaderboard) mit deiner Platzierung
- 🎖️ **12 Abzeichen** (Achievements) zum Freischalten
- 👤 **Profilseite** mit Statistiken und allen Abzeichen
- 💾 **Lokale Persistence** via AsyncStorage

## Start

```bash
npm install
npm run web      # Im Browser testen
npm run android  # Auf Android Emulator
npm run ios      # Auf iOS Simulator (macOS)
```

Oder mit der **Expo Go** App auf deinem Handy scannen, um direkt zu testen.

## Projektstruktur

```
src/
├── components/    # Wiederverwendbare UI-Komponenten (Card, Button, ProgressBar, Screen)
├── data/          # Quiz-Inhalte, Abzeichen-Definitionen, Fake-Leaderboard
├── navigation/    # React Navigation Setup
├── screens/       # Onboarding, Home, Quiz, Result, Leaderboard, Profile
├── store/         # Zustand Store (Zustand + AsyncStorage Persistence)
├── utils/         # Helper-Funktionen (Level-Berechnung, Datum)
└── theme.ts       # Farb- und Spacing-Tokens
```

## Tech-Stack

- **Expo** (SDK 54) — Mobile-App-Framework
- **React Native** + TypeScript
- **React Navigation** (Stack + Bottom Tabs)
- **Zustand** — Minimales State-Management mit Persistence
- **AsyncStorage** — Lokale Datenspeicherung

## Nächste Schritte (Ideen)

- Mehr Fächer & Fragen (z.B. aus einem Backend)
- Echte Freunde-Bestenliste (Firebase / Supabase)
- Push-Notifications für tägliche Lernerinnerungen
- Lehrer-Dashboard zum Erstellen eigener Quizzes
- Duell-Modus (1-vs-1 Live-Quiz)
- Spaced Repetition für langfristiges Lernen
