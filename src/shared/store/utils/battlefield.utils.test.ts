import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialField, createInitialShips, createInitialState, getRandomInt, initialRandomState } from './battlefield.utils';

describe('createInitialField', () => {
  it('создаёт поле размером 10x10 с правильными ячейками', () => {
    const field = createInitialField();
    expect(field).toHaveLength(10);
    field.forEach((row, y) => {
      expect(row).toHaveLength(10);
      row.forEach((cell, x) => {
        expect(cell).toEqual({
          x,
          y,
          hasShip: null,
          isHit: false,
          isMissed: false
        });
      });
    });
  });
});

describe('createInitialShips', () => {
  it('возвращает массив с правильным составом кораблей', () => {
    const ships = createInitialShips();
    expect(ships).toEqual([
      { length: 1, count: 4 },
      { length: 2, count: 3 },
      { length: 3, count: 2 },
      { length: 4, count: 1 },
    ]);
  });
});

describe('createInitialState', () => {
  it('создаёт начальное состояние с пустым userName и полем', () => {
    const state = createInitialState();
    expect(state.userName).toBe('');
    expect(state.numberShips).toBe(0);
    expect(state.readyForBattle).toBe(false);
    expect(state.ships).toEqual(createInitialShips());
    expect(state.field).toHaveLength(10);
    expect(state.field[0][0]).toEqual({
      x: 0,
      y: 0,
      hasShip: null,
      isHit: false,
      isMissed: false,
    });
  });
});

describe('getRandomInt', () => {
  it('возвращает целые числа в заданном диапазоне, включая границы', () => {
    for (let i = 0; i < 1000; i++) {
      const result = getRandomInt(5, 10);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it('корректно работает, если min == max', () => {
    expect(getRandomInt(7, 7)).toBe(7);
  });

  it('корректно округляет границы', () => {
    const min = 1.2;
    const max = 3.8;
    for (let i = 0; i < 100; i++) {
      const val = getRandomInt(min, max);
      expect(val).toBeGreaterThanOrEqual(2);
      expect(val).toBeLessThanOrEqual(3);
    }
  });
});

describe('initialRandomState', () => {

    class MockValidator {
    field: any;
    rows: number;
    cols: number;
    hoverCell: { x: number; y: number };
    draggingShipLength: number;
    draggingShipDirection: 'horizontal' | 'vertical';

    constructor(
        field: any,
        rows: number,
        cols: number,
        hoverCell: { x: number; y: number },
        draggingShipLength: number,
        draggingShipDirection: 'horizontal' | 'vertical'
    ) {
        this.field = field;
        this.rows = rows;
        this.cols = cols;
        this.hoverCell = hoverCell;
        this.draggingShipLength = draggingShipLength;
        this.draggingShipDirection = draggingShipDirection;
    }

    isCurrentPlacementValid() {
        return true;
    }
    }

  let originalValidator: any;

  beforeEach(() => {
    originalValidator = Reflect.get(globalThis, 'ShipPlacementValidator');
  });

  afterEach(() => {
    if (originalValidator) {
      Reflect.set(globalThis, 'ShipPlacementValidator', originalValidator);
    }
  });

  it('создаёт состояние с размещёнными кораблями', () => {
    Reflect.set(globalThis, 'ShipPlacementValidator', MockValidator);

    const state = initialRandomState();

    // Проверяем типы и значения
    expect(state).toHaveProperty('field');
    expect(state).toHaveProperty('ships');
    expect(state).toHaveProperty('userName', '');
    expect(state.numberShips).toBeGreaterThan(0); // Были добавлены корабли
    expect(state.readyForBattle).toBe(false);

    // Проверим, что на поле есть ячейки с кораблями (hasShip !== null)
    const hasShipsOnField = state.field.some(row =>
      row.some(cell => cell.hasShip !== null)
    );
    expect(hasShipsOnField).toBe(true);

    // Проверяем, что расположение кораблей не вышло за границы
    state.field.forEach((row, y) => {
      row.forEach((cell, x) => {
        expect(cell.x).toBe(x);
        expect(cell.y).toBe(y);
        if (cell.hasShip !== null) {
          expect(cell.hasShip).toBeGreaterThanOrEqual(1);
          expect(cell.hasShip).toBeLessThanOrEqual(4);
        }
      });
    });
  });
});
