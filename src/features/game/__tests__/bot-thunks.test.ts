import * as utils from '../../../shared/store/utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { botAttack } from '../model/bot-thunks';
import { fireOnMyCellWithLog } from '../model/game-thunks';

vi.mock('../model/game-thunks', () => ({
  fireOnMyCellWithLog: vi.fn((userName, x, y) => ({ type: 'MOCK_FIRE', payload: { userName, x, y } })),
}));

describe('botAttack thunk', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let getState: () => any;
  const fakeUserName = 'EnemyBot';

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn(() => ({
      enemyBattlefield: {
        userName: fakeUserName,
      },
    }));
    vi.clearAllMocks();

    let callCount = 0;
    vi.spyOn(utils, 'getRandomInt').mockImplementation(() => {
      const res = callCount % 10;
      callCount++;
      return res;
    });
  });

  it('вызывает fireOnMyCellWithLog 200 раз: 100 внутри while и 100 в for', () => {
    botAttack()(dispatch, getState);

    expect(fireOnMyCellWithLog).toHaveBeenCalledTimes(200);
  });

  it('проверяет правильные координаты для первых вызовов fireOnMyCellWithLog', () => {
    botAttack()(dispatch, getState);

    expect(fireOnMyCellWithLog).toHaveBeenNthCalledWith(1, fakeUserName, 0, 1);
    expect(fireOnMyCellWithLog).toHaveBeenNthCalledWith(2, fakeUserName, 2, 3);
    expect(fireOnMyCellWithLog).toHaveBeenNthCalledWith(3, fakeUserName, 4, 5);
  });
});
