import { describe, it, expect, beforeEach } from 'vitest';
import type { Cell } from '@/shared/store';
import { hasShipInCellExtended, ShipPlacementValidator } from './acceptable-cells';

function createEmptyBattlefield(rows: number, cols: number): Cell[][] {
  const battlefield: Cell[][] = [];

  for (let y = 0; y < rows; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < cols; x++) {
      row.push({
        x,
        y,
        hasShip: null,
        isMissed: false,
        isHit: false,
      });
    }
    battlefield.push(row);
  }

  return battlefield;
}

describe('ShipPlacementValidator', () => {
  let battlefield: Cell[][];
  const rows = 10;
  const cols = 10;

  beforeEach(() => {
    battlefield = createEmptyBattlefield(rows, cols);
  });

  describe('hasShipInCell', () => {
    it('возвращает null, если координаты вне диапазона', () => {
      const validator = new ShipPlacementValidator(battlefield, rows, cols);
      expect(validator.hasShipInCell(cols, 0)).toBe(null);
      expect(validator.hasShipInCell(0, rows)).toBe(null);
    });

    it('возвращает значение hasShip из battlefield', () => {
      battlefield[3][4].hasShip = 5;
      const validator = new ShipPlacementValidator(battlefield, rows, cols);
      expect(validator.hasShipInCell(3, 4)).toBe(5);
    });
  });

  describe('hasShipInLine', () => {
    it('возвращает true, если hoverCell или draggingShipLength отсутствуют', () => {
      const validator = new ShipPlacementValidator(battlefield, rows, cols);
      expect(validator.hasShipInLine(0, 0)).toBe(true);
    });

    it('возвращает true, если проверяемая линия выходит за границы поля', () => {
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 8, y: 8 },
        5,
        'horizontal'
      );
      expect(validator.hasShipInLine(8, 8)).toBe(true);
    });

    it('возвращает true, если в проверяемой линии или в окружении есть корабль', () => {
      // Поставим корабль рядом
      battlefield[5][5].hasShip = 1;
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 4, y: 5 },
        3,
        'horizontal'
      );
      expect(validator.hasShipInLine(4, 5)).toBe(true);
    });

    it('возвращает false, если в линии и вокруг нее нет кораблей и координаты в пределах', () => {
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 1, y: 1 },
        3,
        'vertical'
      );
      expect(validator.hasShipInLine(1, 1)).toBe(false);
    });
  });

  describe('isCurrentPlacementValid', () => {
    it('возвращает true, если hoverCell или draggingShipLength отсутствуют', () => {
      const validator = new ShipPlacementValidator(battlefield, rows, cols);
      expect(validator.isCurrentPlacementValid()).toBe(true);
    });
    
    it('возвращает false, если hasShipInLine возвращает true', () => {
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 0, y: 0 },
        3,
        'horizontal'
      );
      // Смоделируем наличие корабля в линии
      battlefield[0][0].hasShip = 1;
      expect(validator.isCurrentPlacementValid()).toBe(false);
    });

    it('возвращает false, если размещение выходит за границы при вертикальной ориентации', () => {
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 0, y: 8 },
        5,
        'vertical'
      );
      expect(validator.isCurrentPlacementValid()).toBe(false);
    });

    it('возвращает true, если размещение внутри границ при горизонтальной ориентации', () => {
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 5, y: 5 },
        4,
        'horizontal'
      );
      expect(validator.isCurrentPlacementValid()).toBe(true);
    });
  });

  describe('shouldHighlightCell', () => {
    it('возвращает false, если hoverCell или draggingShipLength отсутствуют', () => {
      const validator = new ShipPlacementValidator(battlefield, rows, cols);
      expect(validator.shouldHighlightCell(0, 0)).toBe(false);
    });

    it('для вертикального направления выделяет нужные клетки', () => {
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 2, y: 3 },
        3,
        'vertical'
      );
      expect(validator.shouldHighlightCell(2, 3)).toBe(true);
      expect(validator.shouldHighlightCell(2, 4)).toBe(true);
      expect(validator.shouldHighlightCell(2, 5)).toBe(true);
      expect(validator.shouldHighlightCell(2, 6)).toBe(false);
      expect(validator.shouldHighlightCell(3, 3)).toBe(false);
    });

    it('для горизонтального направления выделяет нужные клетки', () => {
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 4, y: 6 },
        2,
        'horizontal'
      );
      expect(validator.shouldHighlightCell(4, 6)).toBe(true);
      expect(validator.shouldHighlightCell(5, 6)).toBe(true);
      expect(validator.shouldHighlightCell(6, 6)).toBe(false);
      expect(validator.shouldHighlightCell(4, 7)).toBe(false);
    });
  });

  describe('getCellStatus', () => {
    it('возвращает корректный статус ячейки', () => {
      battlefield[1][1] = {x: 1, y: 1, hasShip: 2, isMissed: true, isHit: false };
      const validator = new ShipPlacementValidator(
        battlefield,
        rows,
        cols,
        { x: 1, y: 1 },
        1,
        'horizontal'
      );
      const status = validator.getCellStatus(1, 1);
      expect(status.hasShip).toBe(2);
      expect(status.isMissed).toBe(true);
      expect(status.isHit).toBe(false);
      expect(status.isHighlighted).toBe(true);
      expect(typeof status.isValid).toBe('boolean');
    });
  });
});

describe('hasShipInCellExtended', () => {
  const rows = 5;
  const cols = 5;
  let battlefield: Cell[][];

  beforeEach(() => {
    battlefield = createEmptyBattlefield(rows, cols);
  });

  it('возвращает false, если координаты выходят за пределы', () => {
    expect(hasShipInCellExtended(battlefield, 5, 0, rows, cols)).toBe(false);
    expect(hasShipInCellExtended(battlefield, 0, 5, rows, cols)).toBe(false);
  });

  it('возвращает true, если в ячейке есть корабль', () => {
    battlefield[2][2].hasShip = 1;
    expect(hasShipInCellExtended(battlefield, 2, 2, rows, cols)).toBe(true);
  });

  it('возвращает false, если в ячейке нет корабля', () => {
    expect(hasShipInCellExtended(battlefield, 1, 1, rows, cols)).toBe(false);
  });
});
