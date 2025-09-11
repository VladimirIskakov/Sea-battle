import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Cell = {
  x: number,
  y: number,
  hasShip: number | null,
  isHit: boolean,
  isMissed: boolean
}

type Battlefield = Cell[][]

interface BattlefieldState {
  field: Battlefield,
  numberShips: number,
  ships: { length: ShipLength; count: number }[],
  readyForBattle: boolean,
}

const createInitialField = (): Battlefield => {
  const field: Battlefield = [];
  
  for (let y = 0; y < 10; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < 10; x++) {
      row.push({
        x,
        y,
        hasShip: null, 
        isHit: false,
        isMissed: false
      });
    }
    field.push(row);
  }
  
  return field;
};

type ShipLength = 1 | 2 | 3 | 4;

const createInitialShips = (): { length: ShipLength; count: number }[] => {
  return [
    { length: 1, count: 4 },
    { length: 2, count: 3 },
    { length: 3, count: 2 },
    { length: 4, count: 1 }
  ];
};

const initialState: BattlefieldState = {
  field: createInitialField(),
  numberShips: 0,
  ships: createInitialShips(),
  readyForBattle: false,
}

const myBattlefield = createSlice({
  name: 'myBattlefield',
  initialState,
  reducers: {
    placeShip: (state, action: PayloadAction<{ x: number; y: number; shipLength: number; direction: 'vertical' | 'horizontal' }>) => {
        const {x, y, shipLength, direction} = action.payload;
        if (state.ships[shipLength-1]['count'] !=0){
        for(let i = 0; i<shipLength; i++){
          if (direction == 'vertical') state.field[x][y+i].hasShip = shipLength
          else state.field[x+i][y].hasShip = shipLength
        }
        state.ships[shipLength-1]['count'] -= 1
        state.numberShips += 1
        }
    },
    resetGame: (state) => {
      state.field = createInitialField();
      state.numberShips = 0;
      state.ships = createInitialShips();
      state.readyForBattle = false
    },
  },
});

const enemyBattlefield = createSlice({
  name: 'enemyBattlefield',
  initialState,
  reducers: {
    placeShip: (state, action: PayloadAction<{ x: number; y: number; shipLength: number; direction: 'vertical' | 'horizontal' }>) => {
        const {x, y, shipLength, direction} = action.payload;
        console.log(state.ships[shipLength-1]['count'] )
        if (state.ships[shipLength-1]['count'] !=0){
        for(let i = 0; i<shipLength; i++){
          if (direction == 'vertical') state.field[x][y+i].hasShip = shipLength
          else state.field[x+i][y].hasShip = shipLength
        }
        state.ships[shipLength-1]['count'] -= 1
        state.numberShips += 1
        }
    },
    resetGame: (state) => {
      state.field = createInitialField();
      state.numberShips = 0;
      state.ships = createInitialShips();
      state.readyForBattle = false
    },
  },
});

export const { placeShip: placeMyShip, resetGame: resetMyGame } = myBattlefield.actions;
export const { placeShip: placeEnemyShip, resetGame: resetEnemyGame } = enemyBattlefield.actions;

export const store = configureStore({
  reducer: {
    myBattlefield: myBattlefield.reducer,
    enemyBattlefield: enemyBattlefield.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { Cell, Battlefield, BattlefieldState };