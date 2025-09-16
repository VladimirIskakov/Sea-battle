export {store} from './types/store'
export { useAppDispatch } from "./types/store";

export type {Cell, Battlefield, ShipLength, BattlefieldState, LogsType, LogsStoreState} from './types/index'

export {botAttack} from './thunks/bot-thunks'
export { fireOnEnemyCellWithLog } from './thunks/game-thunks';
export { prepareGame } from './thunks/placement-thunk'

export {selectEnemyBattlefield, selectLogsStore, selectMyBattlefield} from './types/store'


