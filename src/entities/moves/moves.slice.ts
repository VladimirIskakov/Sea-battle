import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { moveStoreState } from '@/shared/store/types';

const initialState: moveStoreState = {
  moveNow: null,
};

export const movesStore = createSlice({
  name: 'movesStore',
  initialState,
  reducers: {
    setMoveNow: (state, action: PayloadAction<{ name: string | null}>) => {
      state.moveNow = action.payload.name;
    },
    toggleMove(state, action: PayloadAction<{ player1: string; player2: string }>) {
      if (!state.moveNow) {
        state.moveNow = action.payload.player1;
      } else if (state.moveNow === action.payload.player1) {
        state.moveNow = action.payload.player2;
      } else {
        state.moveNow = action.payload.player1;
      }
    },
  },
});

export const { setMoveNow, toggleMove } = movesStore.actions;


