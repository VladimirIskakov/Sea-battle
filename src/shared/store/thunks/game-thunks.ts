import { addLog, setMoveNow, toggleMove } from "@/entities/";
import { fireOnEnemyCell, markCellsAsMissedForEnemy } from "@/entities";
import { fireOnMyCell, markCellsAsMissedForMy } from "@/entities";
import type { BattlefieldState, Cell } from "../types";
import { selectEnemyBattlefield, selectMovesStore, selectMyBattlefield, type AppDispatch, type RootState } from "../types/store";
import {destroyEnemyShip, destroyMyShip} from '@/entities'

export const fireOnCellWithLog = (
  name: string | null,
  x: number, 
  y: number, 
  battlefieldSelector: (state: RootState) => BattlefieldState,
  fireAction: (payload: {x: number, y: number}) => any,
  markCellsAction: (payload: {x: number, y: number}[]) => any,
  dectroyShip: () => any,
) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const battlefield = battlefieldSelector(state);
    const cell = battlefield.field[x][y];
    const wasHit = cell.hasShip !== null;

    const moveState = selectMovesStore(state)

    if (cell.isHit || cell.isMissed) {
      console.log('В клетку уже стреляли')
      return ;
    }

    if (moveState.moveNow === null || moveState.moveNow !== name) {
      return; 
    }
    dispatch(fireAction({x, y}));
    
    const updatedBattlefield = battlefieldSelector(getState());
    
    let wasDestroyed = false;
    let shipCells: Cell[] = [];
    
    if (wasHit) {
      const shipLength = cell.hasShip;
      shipCells = findShipCells(updatedBattlefield, x, y, shipLength);
      wasDestroyed = shipCells.every(c => c.isHit);

      if (wasDestroyed) {
        const cellsToMark: {x: number, y: number}[] = [];

        if (battlefield.numberShips >0) dispatch(dectroyShip())
        
        shipCells.forEach(cell => {
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const nx = cell.x + dx;
              const ny = cell.y + dy;
              
              if (nx >= 0 && nx < updatedBattlefield.field.length && 
                  ny >= 0 && ny < updatedBattlefield.field[0].length) {
                const neighbor = updatedBattlefield.field[ny][nx];
                
                if (neighbor.hasShip === null && !neighbor.isMissed) {
                  cellsToMark.push({x: ny, y: nx});
                }
              }
            }
          }
        });
        
        // Диспатчим экшен для отметки клеток
        dispatch(markCellsAction(cellsToMark));
      }

      
    } else {
      dispatch(toggleMovePlayer())
    }
    
    const colLetter = String.fromCharCode(65 + x);
    const logType = battlefieldSelector === selectEnemyBattlefield ? '_myAction' : '_enemy';
    
    if (wasDestroyed) {
      console.log(`${battlefield.userName}: Уничтожил корабль длиной ${cell.hasShip} в клетке ${colLetter}${y + 1}!`);
      dispatch(addLog({
        log: `Уничтожил корабль длиной ${cell.hasShip} в клетке ${colLetter}${y + 1}!`,
        type: logType
      }));
    } else if (wasHit) {
      console.log(`${battlefield.userName}: Попал в клетку ${colLetter}${y + 1}`);
      dispatch(addLog({
        log: `Попал в клетку ${colLetter}${y + 1}`,
        type: logType
      }));
    } else {
      console.log(`${battlefield.userName}: Выстрел в клетку ${colLetter}${y + 1} - мимо`);
      dispatch(addLog({
        log: `Выстрел в клетку ${colLetter}${y + 1} - мимо`,
        type: logType
      }));
    }

    if(battlefield.numberShips==0) {
      dispatch(setMoveNow({name: null}))
      dispatch(declareVictory())
    }
  };
};

// Использование для вражеского поля
export const fireOnEnemyCellWithLog = (name: string | null, x: number, y: number) => 
  fireOnCellWithLog(
    name, x, y, 
    selectEnemyBattlefield, 
    fireOnEnemyCell, 
    markCellsAsMissedForEnemy,
    destroyEnemyShip,
  );

// Использование для своего поля (если нужно)
export const fireOnMyCellWithLog = (name: string | null, x: number, y: number) => 
  fireOnCellWithLog(
    name, x, y, 
    selectMyBattlefield, 
    fireOnMyCell, 
    markCellsAsMissedForMy,
    destroyEnemyShip,
  );

const findShipCells = (state: BattlefieldState, x: number, y: number, shipLength: number | null): Cell[] => {
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

export const declareVictory = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state.myBattlefield.numberShips==0) {
      dispatch(addLog({
        log: `${state.enemyBattlefield.userName} победил`,
        type: '_win'
      }))
    } 
    else if (state.enemyBattlefield.numberShips==0) {
      dispatch(addLog({
        log: `${state.myBattlefield.userName} победил`,
        type: '_win'
      }))
    }
    
  };
};

export const toggleMovePlayer = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    dispatch(toggleMove({player1: state.myBattlefield.userName, player2: state.enemyBattlefield.userName}))
    
  };
};