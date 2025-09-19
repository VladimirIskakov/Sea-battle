import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  canFireAtCell,
  findShipCells,
  getCellsToMarkAroundShip,
  createLogEntry,
  fireOnCellWithLog,
  declareVictory,
  toggleMovePlayer,
} from '../model/game-thunks';

import type { Cell } from '@/shared/store';
import { createInitialState } from '@/shared/store/utils';

describe('Game logic utils and thunks', () => {
  // --- Моки ---
  let dispatch: any;
  let getState: any;
  let state: any;

  beforeEach(() => {
    dispatch = vi.fn();
    state = {
      myBattlefield: { userName: 'player1', numberShips: 2, field: [] },
      enemyBattlefield: { userName: 'bot1', numberShips: 3, field: [] },
      movesStore: { moveNow: 'player1' }
    };
    getState = vi.fn(() => state);
  });

  // =========== canFireAtCell ===========
  describe('canFireAtCell', () => {
    it('возвращает false, если ячейка уже обработана или пропущена', () => {
      let cell: Cell = { isHit: true, hasShip: 4, isMissed: false,  x: 4, y: 6 };
      expect(canFireAtCell(cell, 'player1', 'player1')).toBe(false);

      cell = { isHit: false, hasShip: null, isMissed: true, x: 1, y: 1 };
      expect(canFireAtCell(cell, 'player1', 'player1')).toBe(false);
    });

    it('возвращает false, если moveNow имеет значение null или не равно name', () => {
      const cell = { isHit: false, hasShip: null, isMissed: false, x: 0, y: 0 };
      expect(canFireAtCell(cell, null, 'player1')).toBe(false);
      expect(canFireAtCell(cell, 'bot1', 'player1')).toBe(false);
    });

    it('возвращает true, если ячейка не была затронута и moveNow равно name', () => {
      const cell = { isHit: false, hasShip: null, isMissed: false, x: 0, y: 0 };
      expect(canFireAtCell(cell, 'player1', 'player1')).toBe(true);
    });
  });

  // =========== findShipCells ===========
  describe('findShipCells', () => {
    it('возвращает пустой массив, если длина корабля равна нулю', () => {
      const battlefield = { field: [] };
      expect(findShipCells(battlefield as any, 0, 0, null)).toEqual([]);
    });

    it('находит корабельные клетки в четырёх направлениях', () => {
      const battlefield = createInitialState();
      battlefield.field[0][0].hasShip = 2
      battlefield.field[1][0].hasShip = 2

      const result = findShipCells(battlefield as any, 0, 0, 2);
      expect(result).toEqual([
        battlefield.field[0][0],
        battlefield.field[1][0]
      ]);
    });
  });

  // =========== getCellsToMarkAroundShip ===========
  describe('getCellsToMarkAroundShip', () => {
    it('возвращает все ячейки вокруг ячеек с кораблями, которые пусты и не пропущены', () => {
      const battlefield = createInitialState();
      const shipCells = [battlefield.field[1][1]];

      const result = getCellsToMarkAroundShip(shipCells, battlefield as any);

      expect(result).toEqual(expect.arrayContaining([{ x: 0, y: 0 }, { x: 1, y: 0 }]));
    });
  });

  // =========== createLogEntry ===========
  describe('createLogEntry', () => {
    const battlefield = { userName: 'player1' } as any;
    it('возвращает ship log', () => {
      const cell = { isHit: false, hasShip: 3, isMissed: false,  x: 1, y: 1 };
      const log = createLogEntry(true, true, 'player2', battlefield, cell, 0, 0);
      expect(log.log).toContain('Уничтожил корабль длиной 3 в клетке A1!');
      expect(log.type).toBe('_myAction');
    });

    it('возвращает hit log', () => {
      const cell = { isHit: false, hasShip: 2, isMissed: false,  x: 1, y: 1 };
      const log = createLogEntry(false, true, 'player2', battlefield, cell, 0, 0);
      expect(log.log).toContain('Попал в клетку');
      expect(log.type).toBe('_myAction');
    });

    it('возвращает miss log', () => {
      const cell = { isHit: false, hasShip: null, isMissed: false,  x: 1, y: 1 };
      const log = createLogEntry(false, false, 'player2', battlefield, cell, 0, 0);
      expect(log.log).toContain('мимо');
      expect(log.type).toBe('_myAction');
    });

    it('logType равен «_enemy», если имя пользователя на поле боя совпадает с myName', () => {
      const log = createLogEntry(false, false, 'player1', battlefield, { isHit: false, hasShip: null, isMissed: false,  x: 1, y: 1 }, 0, 0);
      expect(log.type).toBe('_enemy');
    });
  });

  // =========== fireOnCellWithLog ===========
  describe('fireOnCellWithLog', () => {
  it('ничего не делает, если не может выстрелить в цель', () => {
    const name = 'player1';

    state = {
      ...state,
      movesStore: { moveNow: name },
      enemyBattlefield: {
        userName: 'bot1',
        field: [
          [{ isHit: true, isMissed: false, hasShip: 1, x: 0, y: 0 }]
        ],
        numberShips: 1,
        ships: [{ length: 1, count: 1 }]
      } as any,
    };
    getState = vi.fn(() => state);

    const mockFireAction = vi.fn();
    const mockMarkCellsAction = vi.fn();
    const mockDestroyShipAction = vi.fn();

    const thunk = fireOnCellWithLog(
      name,
      0, 0,
      (state) => state.enemyBattlefield,
      mockFireAction,
      mockMarkCellsAction,
      mockDestroyShipAction
    );

    thunk(dispatch, getState);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('fires и dispatches коректно попадания и уничтожения', () => {
    const name = 'player1';

    const cell = { isHit: false, isMissed: false, hasShip: 1, x: 0, y: 0 };
    const battlefield = {
      userName: 'bot1',
      field: [
        [cell]
      ],
      numberShips: 1,
      ships: [{ length: 1, count: 1 }],
      readyForBattle: true
    };

    state = {
      ...state,
      movesStore: { moveNow: name },
      enemyBattlefield: battlefield
    };

    const battlefieldAfterFire = {
      ...battlefield,
      field: [
        [{ ...cell, isHit: true }]
      ],
      numberShips: 0, 
    };

    getState = vi.fn()
      .mockReturnValueOnce(state) 
      .mockReturnValueOnce({
        ...state,
        enemyBattlefield: battlefieldAfterFire, 
      })
      .mockReturnValueOnce({
        ...state,
        enemyBattlefield: battlefieldAfterFire, 
      });

    const mockFireAction = vi.fn(() => ({ type: 'fire' }));
    const mockMarkCellsAction = vi.fn(() => ({ type: 'markMissed' }));
    const mockDestroyShipAction = vi.fn(() => ({ type: 'destroy' }));

    const thunk = fireOnCellWithLog(
      name,
      0, 0,
      (state) => state.enemyBattlefield,
      mockFireAction,
      mockMarkCellsAction,
      mockDestroyShipAction
    );

    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({ type: 'fire' });
    expect(mockDestroyShipAction).toHaveBeenCalled();
    expect(mockMarkCellsAction).toHaveBeenCalled();

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'destroy' }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'markMissed' }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: expect.stringContaining('addLog') }));
  });
});

  // =========== declareVictory ===========

  describe('declareVictory', () => {
    it('сообщает о победе, если мои корабли уничтожены', () => {
      state.myBattlefield.numberShips = 0;
      state.enemyBattlefield.numberShips = 1;
      getState = vi.fn(() => state);

      const thunk = declareVictory();
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('addLog')
      }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('setMoveNow')
      }));
    });

    it('сообщает о победе, если вражеские корабли уничтожены', () => {
      state.myBattlefield.numberShips = 1;
      state.enemyBattlefield.numberShips = 0;
      getState = vi.fn(() => state);

      const thunk = declareVictory();
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: expect.stringContaining('addLog')
      }));
    });
  });

 // =========== toggleMovePlayer ===========
  describe('toggleMovePlayer', () => {
    it('отправляет команду toggleMove с player1 и enemy', () => {
      getState = vi.fn(() => state);

      const thunk = toggleMovePlayer();
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('toggleMove'),
        }),
      );
    });
  })})