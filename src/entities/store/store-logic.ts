import type { BattlefieldState, Cell } from "./store";

export const hasShipAt = (state: BattlefieldState, x: number, y: number): boolean => {
  if (x < 0 || x >= state.field.length) return false;
  if (y < 0 || y >= state.field[0].length) return false;
  return Boolean(state.field[x][y].hasShip !== null);
}

function markCellsAround(state: BattlefieldState, shipCells: Cell[]) {
  shipCells.forEach(cell => {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        if (
          nx >= 0 && nx < state.field.length &&
          ny >= 0 && ny < state.field[0].length
        ) {
          const neighbor = state.field[ny][nx];
          if (neighbor.hasShip === null && !neighbor.isMissed) {
            neighbor.isMissed = true;
          }
        }
      }
    }
  });
}

export const fireOnCellLogic = (state: BattlefieldState, x: number, y: number) => {
  const cell = state.field[x][y];

  if (cell.hasShip !== null) {
    cell.isHit = true; 

    const shipLength = cell.hasShip;
    const shipCells: Cell[] = [cell];

    const isHorizontal = hasShipAt(state, x + 1, y) || hasShipAt(state, x - 1, y);
    const isVertical = hasShipAt(state, x, y + 1) || hasShipAt(state, x, y - 1);

    if (isHorizontal) {
      let left = x;
      while (hasShipAt(state, left - 1, y) && state.field[left - 1][y].hasShip === shipLength) {
        left--;
      }
      for (let i = 0; i < shipLength!; i++) {
        shipCells.push(state.field[left + i][y]);
      }
    } else if (isVertical) {
      let top = y;
      while (hasShipAt(state, x, top - 1) && state.field[x][top - 1].hasShip === shipLength) {
        top--;
      }
      for (let i = 0; i < shipLength!; i++) {
        shipCells.push(state.field[x][top + i]);
      }
    } else {
    }

    const uniqueShipCells = Array.from(new Set(shipCells));

    const isDestroyed = uniqueShipCells.every(c => c.isHit);

    if (isDestroyed) {
      console.log('Корабль уничтожен! Отмечаем клетки вокруг.');

      markCellsAround(state, uniqueShipCells);
    } else {
      console.log('Корабль поврежден, но не уничтожен.');
    }
  } else {
    cell.isMissed = true;
    console.log('Мимо!');
  }
}