export {GameGridActive} from './ui/game-grid-active'

export { 
    canFireAtCell, 
    findShipCells, 
    getCellsToMarkAroundShip, 
    createLogEntry,
    fireOnCellWithLog,
    fireOnEnemyCellWithLog,
    fireOnMyCellWithLog,
    declareVictory,
    toggleMovePlayer
} from './model/game-thunks'

export {
    botAttack
} from './model/bot-thunks'