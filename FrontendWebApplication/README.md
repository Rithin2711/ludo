# LudoMaster – React Frontend

A modern, responsive, and accessible UI for a 2–4 player Ludo board. This step focuses purely on frontend structure, reusable components, and minimal demo logic for dice and coin interactions.

## Highlights
- Dynamic Ludo board for 2–4 players with a corner for each active player
- Dice component placed at each player's corner (click/Enter to roll on active turn)
- Four tokens per player with color-coding (Green, Red, Blue, Yellow)
- Responsive layout and theme toggle (light/dark, honors OS preference)
- Accessibility: focus states, labels, keyboard support, color contrast
- Clean component structure ready for future backend/socket integration

## Quick start
- `npm start` – dev server
- `npm test` – unit tests
- `npm run build` – production build

## Components
- `src/components/Board.js` – Board layout with corner areas
- `src/components/PlayerCorner.js` – Corner UI with player name, tokens, and dice
- `src/components/Token.js` – Token (coin) with keyboard activation
- `src/components/Dice.js` – Dice with value display and roll action
- `src/components/ControlsBar.js` – Player count and current turn controls
- `src/components/Header.js` and `src/components/Footer.js`

## Demo interactions
- Select 2–4 players with the dropdown.
- Click "Roll Dice" or press Enter on dice for the current player to roll & advance turn.
- Click a token (or press Enter) to cycle its position (demo only).

## Future integration
- Replace demo state in `App.js` with real game state from backend and WebSockets.
- Implement real movement and path rules, safe squares, and home lanes.
- Sync dice rolls and movements across players.

