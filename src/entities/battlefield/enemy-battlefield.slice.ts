import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { initialRandomState, createInitialState } from '@/shared/store/utils';
import type { BattlefieldState } from '@/shared/store';

export const enemyBattlefield = createSlice({
  name: 'enemyBattlefield',
  initialState: initialRandomState(),
  reducers: {
    setBattlefield: (state, action: PayloadAction<BattlefieldState>) => {
      return action.payload;
    },
    changeName: (state, action: PayloadAction<{name: string}>) => {
        state.userName = action.payload.name
    },
    placeShip: (state, action: PayloadAction<{ x: number; y: number; shipLength: number; direction: 'vertical' | 'horizontal' }>) => {
      const { x, y, shipLength, direction } = action.payload;
      if (state.ships[shipLength - 1]['count'] !== 0) {
        for (let i = 0; i < shipLength; i++) {
          if (direction === 'vertical') state.field[x][y + i].hasShip = shipLength;
          else state.field[x + i][y].hasShip = shipLength;
        }
        state.ships[shipLength - 1]['count'] -= 1;
        state.numberShips += 1;
      }
    },
    fireOnCell: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;
      const cell = state.field[x][y];
      
      if (cell.hasShip !== null) {
        cell.isHit = true;
      } else {
        cell.isMissed = true;
      }
    },
    resetGame: (state) => {
      const newState = createInitialState();
      state.field = newState.field;
      state.numberShips = newState.numberShips;
      state.ships = newState.ships;
      state.readyForBattle = newState.readyForBattle;
    },
    randomField: (state) => {
      const newState = initialRandomState();
      state.field = newState.field;
      state.numberShips = newState.numberShips;
      state.ships = newState.ships;
    },
    markCellsAsMissed: (state, action: PayloadAction<{ x: number; y: number }[]>) => {
      action.payload.forEach(({ x, y }) => {
        if (state.field[x][y].hasShip === null) {
          state.field[x][y].isMissed = true;
        }
      });
    },
    destroyShip: (state) => {
      state.numberShips-=1
    },
    changeReadyMode: (state) => {
      state.readyForBattle = !state.readyForBattle;
    },
  },
});

export const { 
  setBattlefield: setEnemyBattlefield,
  placeShip: placeEnemyShip, 
  resetGame: resetEnemyGame, 
  randomField: randomEnemyField, 
  fireOnCell: fireOnEnemyCell, 
  markCellsAsMissed: markCellsAsMissedForEnemy, 
  changeName: changeEnemyName,
  changeReadyMode: changeEnemyReadyMode,
  destroyShip: destroyEnemyShip
} = enemyBattlefield.actions;

