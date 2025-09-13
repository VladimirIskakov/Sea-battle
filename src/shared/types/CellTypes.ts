export interface CellOptions {
  hasShip: boolean;
  isHighlighted: boolean;
  isValid: boolean;
}

export type CellOptionsGrid = CellOptions[][]