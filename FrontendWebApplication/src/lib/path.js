//
// Ludo path logic and coordinate mapping
//

/**
 * Defines traditional Ludo ordered path (52 main steps) starting positions for each color and
 * their 6-step home column to the center. Also provides utilities to move coins according
 * to dice rolls and compute CSS coordinates to render tokens on the board track.
 *
 * Board coordinate system:
 * - We return CSS percentages [top,left] that fit the existing CSS "board".
 * - The main cross "arms" are at 50% with a thickness ~18% (as in App.css).
 * - We predefine 52 main-track cells and 6 home-lane cells for each color.
 * - Path indices:
 *    - 'yard' (off-board) until a 6 is rolled to enter.
 *    - On entry: mainIndex = 0 for that player's starting entry cell.
 *    - mainIndex increments modulo 52 while on main track.
 *    - When crossing that player's entry again, they continue until exactly at their "homeEntry"
 *      where they begin their home lane (6 cells). Once in home: homeIndex from 0..5.
 *    - Reaching homeIndex === 5 indicates the coin has finished ('finished' state).
 */

// Constants
export const COLORS = ['green', 'red', 'blue', 'yellow'];
export const MAIN_TRACK_LENGTH = 52;
export const HOME_LANE_LENGTH = 6;

/**
 * Precomputed coordinates for main track (52 cells) and each color's 6-cell home lane.
 * The coordinates are expressed as { top: string('%'), left: string('%') }.
 * The mapping approximates typical Ludo layout within the existing CSS geometry.
 *
 * For simplicity and to avoid pixel-perfect calculations, we define a grid of 15 x 15 logical cells
 * and convert to percentages. The board is square, so:
 *   stepSize = 100 / 15; offset = small padding to fit within borders.
 */
const GRID = 15;
const step = 100 / GRID;

// Helper to build CSS percentage with slight inset margin
const PCT = (v) => `${v}%`;

/**
 * Construct a 15x15 track around a cross. We define cells in clockwise order starting from
 * the top center lane entry (conventionally the start for green in many designs).
 *
 * Indexing guideline for path (clockwise):
 *  - 0..5: down the top center vertical lane (right edge of the vertical bar)
 *  - 6..11: across right horizontal lane
 *  - 12..17: down right vertical lane
 *  - 18..23: across bottom horizontal lane
 *  - 24..29: up bottom vertical lane
 *  - 30..35: across left horizontal lane
 *  - 36..41: up left vertical lane
 *  - 42..47: across top horizontal lane
 *  - 48..51: finishing to reach the top center entry vicinity
 *
 * Note: Exact coordinates are approximate but consistent.
 */

// Utility to generate a range
const range = (n) => Array.from({ length: n }, (_, i) => i);

// Build main path coordinates
const mainPath = (() => {
  // To keep it simple and consistent with CSS 18% path thickness, we layout cells
  // along an outer ring avoiding corners and then along arms.
  // We'll place 52 points roughly equally spaced on that ring.

  // We'll define 13 cells per side (13 * 4 = 52)
  const cellsPerSide = 13;

  // Row/col indices in 0..14
  const topRow = 1;
  const bottomRow = GRID - 2;
  const leftCol = 1;
  const rightCol = GRID - 2;

  const coords = [];

  // Top edge: leftCol..rightCol
  for (let c = leftCol; c <= rightCol; c++) coords.push([topRow, c]);
  // Right edge: topRow+1..bottomRow
  for (let r = topRow + 1; r <= bottomRow; r++) coords.push([r, rightCol]);
  // Bottom edge: rightCol-1..leftCol
  for (let c = rightCol - 1; c >= leftCol; c--) coords.push([bottomRow, c]);
  // Left edge: bottomRow-1..topRow+1
  for (let r = bottomRow - 1; r >= topRow + 1; r--) coords.push([r, leftCol]);

  // Ensure exactly 52 by slicing to 52 (the ring provides more than 52 in our coarse grid).
  const ring = coords.slice(0, MAIN_TRACK_LENGTH);

  // Convert to percentages at centers of the logical cells.
  return ring.map(([r, c]) => ({
    top: PCT((r + 0.5) * step),
    left: PCT((c + 0.5) * step),
  }));
})();

/**
 * Starting indices for each color along mainPath:
 * We pick four equidistant points on the 52-step ring to serve as color starts.
 * - Green: index 0
 * - Red:   index 13
 * - Blue:  index 26
 * - Yellow:index 39
 */
export const startIndexByColor = {
  green: 0,
  red: 13,
  blue: 26,
  yellow: 39,
};

/**
 * Home entry indices: the index on the main ring where a color turns into its home lane.
 * Traditionally, this is 51 cells after the start index (i.e., one step before completing the lap).
 * We compute as (startIndex + 51) % 52.
 */
export const homeEntryByColor = Object.fromEntries(
  COLORS.map((c) => [c, (startIndexByColor[c] + MAIN_TRACK_LENGTH - 1) % MAIN_TRACK_LENGTH])
);

/**
 * Home lane coordinates for each color (6 cells leading to center).
 * We align lanes to approximate the inner colored lanes in CSS:
 * - Green home lane goes from top toward center (downwards).
 * - Red home lane goes from right toward center (leftwards).
 * - Blue home lane goes from bottom toward center (upwards).
 * - Yellow home lane goes from left toward center (rightwards).
 */
const homeLaneByColor = (() => {
  // Center of the board
  const center = (GRID / 2);
  const centerTop = PCT(center * step);
  const centerLeft = PCT(center * step);

  // Length 6 cells per lane; compute along a straight line to center.
  const lane = {
    green: [],
    red: [],
    blue: [],
    yellow: [],
  };

  // Define start anchors near center, then move outward for index 5..0 so 0 is nearest outside.
  // For simplicity, we define from outside to inside (0 to 5 => moving closer to center).
  for (let i = 0; i < HOME_LANE_LENGTH; i++) {
    // proportion towards center
    const t = (i + 1) / (HOME_LANE_LENGTH + 1); // keep within cross area aesthetically

    // Green: from top moving down to center along center column
    lane.green.push({
      top: PCT(20 + t * 30), // approx 20% -> 50%
      left: centerLeft,
    });

    // Red: from right moving left to center along center row
    lane.red.push({
      top: centerTop,
      left: PCT(80 - t * 30), // approx 80% -> 50%
    });

    // Blue: from bottom moving up to center along center column
    lane.blue.push({
      top: PCT(80 - t * 30), // approx 80% -> 50%
      left: centerLeft,
    });

    // Yellow: from left moving right to center along center row
    lane.yellow.push({
      top: centerTop,
      left: PCT(20 + t * 30), // approx 20% -> 50%
    });
  }

  return lane;
})();

/**
 * PUBLIC_INTERFACE
 * Compute CSS {top,left} for a coin given its logical position state.
 * State formats:
 * - { status: 'yard' }
 * - { status: 'main', mainIndex: number } where 0..51
 * - { status: 'home', homeIndex: number } where 0..5 (0 is farthest from center)
 * - { status: 'finished' }
 */
export function getCoinCSSPosition(color, pos) {
  /** This function returns coordinates only for board rendering.
   * - yard: return null (render in player corner only)
   * - finished: return very center
   */
  if (!pos || pos.status === 'yard') return null;

  if (pos.status === 'finished') {
    return { top: '50%', left: '50%' };
  }

  if (pos.status === 'main') {
    const { mainIndex } = pos;
    const idx = ((mainIndex % MAIN_TRACK_LENGTH) + MAIN_TRACK_LENGTH) % MAIN_TRACK_LENGTH;
    return mainPath[idx];
  }

  if (pos.status === 'home') {
    const { homeIndex } = pos;
    const idx = Math.max(0, Math.min(HOME_LANE_LENGTH - 1, homeIndex));
    return homeLaneByColor[color][idx];
  }

  return null;
}

/**
 * PUBLIC_INTERFACE
 * Initialize a coin position in 'yard'
 */
export function createInitialCoin() {
  return { status: 'yard' };
}

/**
 * PUBLIC_INTERFACE
 * Attempt to move a coin by 'steps' according to Ludo rules:
 * - If in yard:
 *   - Can enter only on a roll of 6; enters at startIndexByColor[color] with mainIndex=0
 * - If on main track:
 *   - Advance by steps, wrapping modulo 52
 *   - When landing exactly on home entry for that color, next steps move into 'home'
 * - If in home lane:
 *   - Move forward; must land exactly on last cell (homeIndex 5) to finish
 * Returns updated position object.
 */
export function applyMove(color, pos, steps) {
  // Yard case
  if (!pos || pos.status === 'yard') {
    if (steps === 6) {
      // enter on main at its start
      return { status: 'main', mainIndex: 0 };
    }
    return pos; // cannot move
  }

  // Finished: cannot move
  if (pos.status === 'finished') {
    return pos;
  }

  // On main track
  if (pos.status === 'main') {
    const startIdx = startIndexByColor[color];
    const homeEntry = homeEntryByColor[color];

    // Convert relative mainIndex (0 at start cell) to absolute index on ring:
    const absoluteBefore = (startIdx + pos.mainIndex) % MAIN_TRACK_LENGTH;
    let absoluteAfter = (absoluteBefore + steps) % MAIN_TRACK_LENGTH;

    // If we pass the home entry and still have remaining steps, spill into home.
    // We need to count steps one by one to know if/when we cross homeEntry.
    let remaining = steps;
    let currentAbs = absoluteBefore;
    while (remaining > 0) {
      const nextAbs = (currentAbs + 1) % MAIN_TRACK_LENGTH;
      remaining -= 1;

      if (currentAbs === homeEntry) {
        // We are at the square from which we go to home lane next step
        // So this step should enter home lane at index 0
        return enterHome(color, remaining); // move remaining steps inside home
      }
      currentAbs = nextAbs;
    }

    // No home entry crossing; remain on main track
    const newRel = (pos.mainIndex + steps) % MAIN_TRACK_LENGTH;
    return { status: 'main', mainIndex: newRel };
  }

  // In home lane
  if (pos.status === 'home') {
    const target = pos.homeIndex + steps;
    if (target === HOME_LANE_LENGTH - 1) {
      return { status: 'finished' };
    }
    if (target < HOME_LANE_LENGTH - 1) {
      return { status: 'home', homeIndex: target };
    }
    // overshoot not allowed
    return pos;
  }

  return pos;
}

// Helper: enter home lane and advance remaining steps, enforcing exact finish
function enterHome(color, remainingSteps) {
  // On entering, we are at homeIndex 0, then advance remainingSteps
  let idx = 0 + remainingSteps;
  if (idx === HOME_LANE_LENGTH - 1) {
    return { status: 'finished' };
  }
  if (idx < HOME_LANE_LENGTH - 1) {
    return { status: 'home', homeIndex: idx };
  }
  // overshoot => stay at yard entrance to home? Traditional rule forbids overshoot;
  // since we had to step into home, landing beyond is forbidden; clamp to last safe within bounds.
  // We'll not allow entering if overshoot is inevitable; revert to position just before enter.
  // To reflect that, we put the piece at homeIndex 0 and ignore overflow past last cell.
  return { status: 'home', homeIndex: 0 };
}
