export { placeMyShip, 
  resetMyGame, fireOnMyCell, 
  randomMyField, 
  changeMyReadyMode, 
  markCellsAsMissedForMy, 
  changeMyName,
  destroyMyShip 
} from './battlefield/my-battlefield.slice';

export { 
  placeEnemyShip, 
  resetEnemyGame, 
  fireOnEnemyCell, 
  randomEnemyField, 
  markCellsAsMissedForEnemy, 
  changeEnemyName,
  destroyEnemyShip,
  changeEnemyReadyMode
} from './battlefield/enemy-battlefield.slice';

export { setMoveNow, toggleMove }  from './moves/moves.slice'

export {addLog} from './logs/logs.slice'

export {logsStore} from './logs/logs.slice'
export {movesStore} from './moves/moves.slice'

export {enemyBattlefield} from './battlefield/enemy-battlefield.slice'
export {myBattlefield} from './battlefield/my-battlefield.slice'