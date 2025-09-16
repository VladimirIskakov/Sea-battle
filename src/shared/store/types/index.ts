export type Cell = {
  x: number;
  y: number;
  hasShip: number | null;
  isHit: boolean;
  isMissed: boolean;
};

export type Battlefield = Cell[][];

export type ShipLength = 1 | 2 | 3 | 4;

export interface BattlefieldState {
  userName: string,
  field: Battlefield;
  numberShips: number;
  ships: { length: ShipLength; count: number }[];
  readyForBattle: boolean;
}

export type LogsType = '_common' | '_enemy' | '_myAction' | '_win';

export interface LogsStoreState {
  logs: { log: string; type: LogsType }[];
}

export interface moveStoreState {
  moveNow: string | null
}