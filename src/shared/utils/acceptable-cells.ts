import type { Cell } from "@/entities";

export class ShipPlacementValidator {
  private battlefield: Cell[][];
  private rows: number;
  private cols: number;
  private hoverCell?: {x: number, y: number} | null;
  private draggingShipLength?: number | null;
  private direction?: 'vertical' | 'horizontal';

  constructor(battlefield: Cell[][], rows: number, cols: number, hoverCell: {x: number, y: number} | null = null,  draggingShipLength: number | null = null, direction: 'vertical' | 'horizontal' = 'horizontal') {
    this.battlefield = battlefield;
    this.rows = rows;
    this.cols = cols;
    this.hoverCell = hoverCell;
    this.draggingShipLength = draggingShipLength;
    this.direction = direction;
  }

  hasShipInCell(x: number, y: number): number | null {
    if (y >= this.rows || x >= this.cols) return null;
    return this.battlefield[x][y].hasShip;
  }

  hasShipInLine(x: number, y: number): boolean {
    if (!this.hoverCell || !this.draggingShipLength) return true;

    const checkSurroundingArea = (checkX: number, checkY: number) => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = checkX + dx;
          const ny = checkY + dy;
          
          if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows) continue;
          
          if (this.hasShipInCell(nx, ny) != null) {
            return true;
          }
        }
      }
      return false;
    };

    for (let i = 0; i < this.draggingShipLength; i++) {
      let checkX = this.direction === 'horizontal' ? x + i : x;
      let checkY = this.direction === 'vertical' ? y + i : y;

      if (checkX >= this.cols || checkY >= this.rows) return true;
      if (this.hasShipInCell(checkX, checkY)) return true;
      if (checkSurroundingArea(checkX, checkY)) return true;
    }
    return false;
  }

  isCurrentPlacementValid = (): boolean => {
    if (!this.hoverCell || !this.draggingShipLength) return true;

    if (this.hasShipInLine(this.hoverCell.x, this.hoverCell.y)) return false;
    
    if (this.direction === 'vertical') {
      return this.hoverCell.y + this.draggingShipLength <= this.rows;
    } else {
      return this.hoverCell.x + this.draggingShipLength <= this.cols;
    }
  }

  shouldHighlightCell = (x: number, y: number): boolean => {
    if (!this.hoverCell || !this.draggingShipLength) return false;
    
    if (this.direction === 'vertical') {
        return x === this.hoverCell.x && 
            y >= this.hoverCell.y && 
            y < this.hoverCell.y + this.draggingShipLength;
    } else {
        return y === this.hoverCell.y && 
            x >= this.hoverCell.x && 
            x < this.hoverCell.x + this.draggingShipLength;
    }
    };

    getCellStatus = (x: number, y: number) => {
      const hasShip = this.hasShipInCell(x, y);
      const isHighlighted = this.shouldHighlightCell(x, y);
      const isValid = this.isCurrentPlacementValid();
      const isMissed = this.battlefield[x][y].isMissed 
      const isHit = this.battlefield[x][y].isHit

      return {hasShip, isHighlighted, isValid, isMissed, isHit};
  }

}

export const hasShipInCellExtended = (battlefield: Cell[][], x: number, y: number, rows: number, cols: number) =>{
    if (y >= rows || x >= cols) return false;
    return battlefield[x][y].hasShip !== null;
  }
