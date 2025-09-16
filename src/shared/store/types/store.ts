import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { logsStore, movesStore, myBattlefield } from '@/entities';
import { enemyBattlefield } from '@/entities';

export const store = configureStore({
  reducer: {
    myBattlefield: myBattlefield.reducer,
    enemyBattlefield: enemyBattlefield.reducer,
    logsStore: logsStore.reducer,
    movesStore: movesStore.reducer,
  },
});

export const selectEnemyBattlefield = (state: RootState) => state.enemyBattlefield;
export const selectMyBattlefield = (state: RootState) => state.myBattlefield;
export const selectLogsStore = (state: RootState) => state.logsStore;
export const selectMovesStore = (state: RootState) => state.movesStore;

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;