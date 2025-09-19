import { describe, it, expect, vi } from 'vitest';

import * as entities from '@/entities';
import type { RootState } from '@/shared/store/types/store';
import { prepareGame } from '@/features/fleet-deployment';

describe('prepareGame thunk', () => {
  it('dispatches expected actions and uses getState correctly', () => {
    const dispatch = vi.fn();
    const userNameMy = 'player1';
    const userNameEnemy = 'bot1';

    const getState = vi.fn(() => ({
      myBattlefield: { userName: userNameMy },
      enemyBattlefield: { userName: userNameEnemy },
    } as RootState));

    prepareGame()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(entities.randomEnemyField());
    expect(dispatch).toHaveBeenCalledWith(entities.changeMyReadyMode());
    expect(dispatch).toHaveBeenCalledWith(entities.changeEnemyReadyMode());
    expect(dispatch).toHaveBeenCalledWith(entities.changeMyName({ name: 'player' }));
    expect(dispatch).toHaveBeenCalledWith(entities.changeEnemyName({ name: 'bot' }));

    expect(dispatch).toHaveBeenCalledWith(entities.setMoveNow({ name: userNameMy }));

    expect(dispatch).toHaveBeenCalledWith(entities.addLog({
      log: `${userNameMy} готов`,
      type: '_common',
    }));

    expect(dispatch).toHaveBeenCalledWith(entities.addLog({
      log: `${userNameEnemy} готов`,
      type: '_common',
    }));
  });
});
