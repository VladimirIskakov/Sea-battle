import { ShipPlacementValidator } from '@/shared/utils';
import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fireOnCellLogic } from './store-logic';

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
  
  return field
};


const initialRandomState = (): BattlefieldState => {
  const state: BattlefieldState = createInitialState();

  function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  state.ships.slice().reverse().forEach((ship, reversedIndex) => {
    const shipLength = 4 - reversedIndex; 
    
    let attempts = 0;
    const maxAttempts = 1000; 
    
    while (ship.count > 0 && attempts < maxAttempts) {
      attempts++;
      
      const x = getRandomInt(0, 9);
      const y = getRandomInt(0, 9);
      const direction = getRandomInt(0, 1) === 0 ? 'vertical' : 'horizontal';
      
      const validator = new ShipPlacementValidator(
        state.field,  
        10,          
        10,         
        { x, y },   
        shipLength,   
        direction    
      );
      
      if (validator.isCurrentPlacementValid()) {
        console.log(x,y,shipLength, direction)
        for (let i = 0; i < shipLength; i++) {
          const cellX = direction === 'horizontal' ? x + i : x;
          const cellY = direction === 'vertical' ? y + i : y;
          state.field[cellX][cellY].hasShip = shipLength;
        }
        
        ship.count -= 1;
        state.numberShips += 1;
        attempts = 0;  
      }
    }
    
    if (ship.count > 0) {
      console.warn(`Не удалось разместить ${ship.count} кораблей длиной ${shipLength} после ${maxAttempts} попыток.`);
    }
  });

  return state;
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

const createInitialState = (): BattlefieldState => ({
  field: createInitialField(),  
  numberShips: 0,
  ships: createInitialShips(), 
  readyForBattle: false,
});

const myBattlefield = createSlice({
  name: 'myBattlefield',
  initialState: createInitialState(),
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

    randomField: (state) => {
      const newState = initialRandomState();
      
      state.field = newState.field;
      state.numberShips = newState.numberShips;
      state.ships = newState.ships;
      state.readyForBattle = newState.readyForBattle;
    },

    changeReadyMode: (state) => {
      state.readyForBattle = !state.readyForBattle
    }
  },
});

const enemyBattlefield = createSlice({
  name: 'enemyBattlefield',
  initialState: initialRandomState(),
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

    fireOnCell: (state, action: PayloadAction<{x: number, y: number}>) => {
      const {x, y} = action.payload;
      fireOnCellLogic(state, x, y)
    },

    resetGame: (state) => {
      state.field = createInitialField();
      state.numberShips = 0;
      state.ships = createInitialShips();
      state.readyForBattle = false
    },

    randomField: (state) => {
      const newState = initialRandomState();
      
      state.field = newState.field;
      state.numberShips = newState.numberShips;
      state.ships = newState.ships;
      state.readyForBattle = true;
    }
  },
});

type LogsType = '_common' | '_enemy' |  '_myAction' | '_win'

interface LogsStoreState {
  logs: {log: string, type: LogsType }[];
}

const initialState: LogsStoreState = {
  logs: [],
};

const logsStore = createSlice({
  name: 'logsStore',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<{log: string, type: LogsType }>) => {
      state.logs.push(action.payload);
    },
  },
});

export const { addLog } = logsStore.actions;
export const { placeShip: placeMyShip, resetGame: resetMyGame, randomField: randomMyField, changeReadyMode: changeMyReadyMode } = myBattlefield.actions;
export const { placeShip: placeEnemyShip,  fireOnCell: fireOnEnemyCell, resetGame: resetEnemyGame, randomField: randomEnemyField } = enemyBattlefield.actions;

export const store = configureStore({
  reducer: {
    myBattlefield: myBattlefield.reducer,
    enemyBattlefield: enemyBattlefield.reducer,
    logsStore: logsStore.reducer,
  },
});

export const selectMyBattlefield = (state: RootState) => state.myBattlefield;
export const selectEnemyBattlefield = (state: RootState) => state.enemyBattlefield;
export const selectLogsStore = (state: RootState) => state.logsStore;
;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { Cell, Battlefield, BattlefieldState };