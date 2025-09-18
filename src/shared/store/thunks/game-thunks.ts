import { addLog, setMoveNow, toggleMove } from "@/entities/";
import { fireOnEnemyCell, markCellsAsMissedForEnemy, destroyEnemyShip } from "@/entities";
import { fireOnMyCell, markCellsAsMissedForMy, destroyMyShip } from "@/entities";
import type { BattlefieldState, Cell, LogsType } from "../types";
import { selectEnemyBattlefield, selectMovesStore, selectMyBattlefield, type AppDispatch, type RootState } from "../types/store";

// Вспомогательные функции для проверки условий
export const canFireAtCell = (cell: Cell, moveNow: string | null, name: string | null): boolean => {
  if (cell.isHit || cell.isMissed) {
    console.log('В клетку уже стреляли');
    return false;
  }

  if (moveNow === null || moveNow !== name) {
    return false;
  }

  return true;
};

export const findShipCells = (state: BattlefieldState, x: number, y: number, shipLength: number | null): Cell[] => {
  if (!shipLength) return [];
  
  const shipCells: Cell[] = [];
  const directions = [
    {dx: 1, dy: 0}, {dx: -1, dy: 0},
    {dx: 0, dy: 1}, {dx: 0, dy: -1}  
  ];
  
  for (const {dx, dy} of directions) {
    for (let i = 0; i < shipLength; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      
      if (nx >= 0 && nx < state.field.length && 
          ny >= 0 && ny < state.field[0].length) {
        const cell = state.field[nx][ny];
        if (cell.hasShip === shipLength) {
          shipCells.push(cell);
        }
      }
    }
  }
  return [...new Set(shipCells)]; 
};

export const getCellsToMarkAroundShip = (shipCells: Cell[], battlefield: BattlefieldState) => {
  const cellsToMark: {x: number, y: number}[] = [];

  shipCells.forEach(cell => {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        
        if (nx >= 0 && nx < battlefield.field.length && 
            ny >= 0 && ny < battlefield.field[0].length) {
          const neighbor = battlefield.field[ny][nx];
          
          if (neighbor.hasShip === null && !neighbor.isMissed) {
            cellsToMark.push({x: ny, y: nx});
          }
        }
      }
    }
  });

  return cellsToMark;
};

export const createLogEntry = (
  wasDestroyed: boolean,
  wasHit: boolean,
  myName: string,
  battlefield: BattlefieldState,
  cell: Cell,
  x: number,
  y: number
) => {
  const colLetter = String.fromCharCode(65 + x);
  const logType: LogsType = !(battlefield.userName === myName)  ? '_myAction' : '_enemy';

  if (wasDestroyed) {
    return {
      log: `Уничтожил корабль длиной ${cell.hasShip} в клетке ${colLetter}${y + 1}!`,
      type: logType
    };
  } else if (wasHit) {
    return {
      log: `Попал в клетку ${colLetter}${y + 1}`,
      type: logType
    };
  } else {
    return {
      log: `Выстрел в клетку ${colLetter}${y + 1} - мимо`,
      type: logType
    };
  }
};

// Основная логика выстрела
export const fireOnCellWithLog = (
  name: string | null,
  x: number, 
  y: number, 
  battlefieldSelector: (state: RootState) => BattlefieldState,
  fireAction: (payload: {x: number, y: number}) => any,
  markCellsAction: (payload: {x: number, y: number}[]) => any,
  destroyShipAction: () => any, 
) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const battlefield = battlefieldSelector(state);
    const cell = battlefield.field[x][y];
    const wasHit = cell.hasShip !== null;

    const moveState = selectMovesStore(state);

    if (!canFireAtCell(cell, moveState.moveNow, name)) {
      return;
    }
    
    dispatch(fireAction({x, y}));
    
    const updatedState = getState();
    const updatedBattlefield = battlefieldSelector(updatedState);
    
    let wasDestroyed = false;
    let shipCells: Cell[] = [];
    
    if (wasHit) {
      const shipLength = cell.hasShip;
      shipCells = findShipCells(updatedBattlefield, x, y, shipLength);
      wasDestroyed = shipCells.every(c => c.isHit);

      if (wasDestroyed) {
        const cellsToMark = getCellsToMarkAroundShip(shipCells, updatedBattlefield);
        
        dispatch(destroyShipAction());
        dispatch(markCellsAction(cellsToMark));
      }
    } else {
      dispatch(toggleMovePlayer());
    }
    
    const logEntry = createLogEntry(wasDestroyed, wasHit, state.myBattlefield.userName, battlefield, cell, x, y);
    console.log(`${battlefield.userName}: ${logEntry.log}`);
    dispatch(addLog(logEntry));
    
    console.log('My ships:', state.myBattlefield.numberShips, 'Enemy ships:', state.enemyBattlefield.numberShips);
    if (wasDestroyed){
      const stateAfterDestroy = getState();
      const battlefieldAfterDestroy = battlefieldSelector(stateAfterDestroy);
      console.log(battlefieldAfterDestroy.userName, battlefieldAfterDestroy.numberShips);
      if (battlefieldAfterDestroy.numberShips === 0) dispatch(declareVictory());
    } 
  };
};

// Вспомогательные функции для конкретных игроков
export const fireOnEnemyCellWithLog = (name: string | null, x: number, y: number) => 
  fireOnCellWithLog(
    name, x, y, 
    selectEnemyBattlefield, 
    fireOnEnemyCell, 
    markCellsAsMissedForEnemy,
    destroyEnemyShip, 
  );

export const fireOnMyCellWithLog = (name: string | null, x: number, y: number) => 
  fireOnCellWithLog(
    name, x, y, 
    selectMyBattlefield, 
    fireOnMyCell, 
    markCellsAsMissedForMy,
    destroyMyShip, 
  );

// Функции для управления ходами и победой
export const declareVictory = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    console.log('проверка условия победы')
    const state = getState();
    if (state.myBattlefield.numberShips === 0) {
      dispatch(addLog({
        log: `${state.enemyBattlefield.userName} победил`,
        type: '_win'
      }));
    } else if (state.enemyBattlefield.numberShips === 0) {
      dispatch(addLog({
        log: `${state.myBattlefield.userName} победил`,
        type: '_win'
      }));
    }
    dispatch(setMoveNow({name: null}));
  };
};

export const toggleMovePlayer = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    dispatch(toggleMove({player1: state.myBattlefield.userName, player2: state.enemyBattlefield.userName}));
  };
};