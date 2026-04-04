# Wisdom App – Mobile companion

React Native + TypeScript (Expo) mobile app (iOS/Android): config, pairing, device dashboard, routines, profiles, transparency, backup/restore. Bottom tab bar with per-tab stacks (F9.T1.S1).

- **Plan and tickets:** Wisdom monorepo root (Plan.md, GettingStarted.md); **versioned backlog:** [docs/Tickets.md](docs/Tickets.md) (kept in sync with root Tickets.md when working in this repo).
- **API contract:** See [contracts](https://github.com/Wisdom-PA/contracts) repo (cube ↔ app). App uses `src/api/cubeApi.types` and `mockCubeApi` for dev and tests.

**Run:** `npm start` (Expo). Then `npm run ios` or `npm run android`.  
**Test:** `npm run test` / `npm run test:coverage` (Jest, 85% thresholds).  
**Storybook:** `npm run storybook` (see .storybook and `*.stories.tsx`).

Phase 2: scaffold ✓, Jest + Storybook config ✓, mock cube API ✓, base screens (Dashboard, Devices, Routines, Profiles, Settings, Logs) + ListItem/Toggle components with stories ✓.
