import type { AppDispatch, RootState } from "../types/store";
import { getRandomInt } from "../utils";
import { fireOnMyCellWithLog } from "./game-thunks";

export const botAttack = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const enemyBattlefield = state.enemyBattlefield;
    
    let attempts = 0;
    const maxAttempts = 100; 
    
    while (attempts < maxAttempts) {
      attempts++;
      
      const x = getRandomInt(0, 9);
      const y = getRandomInt(0, 9);
      
      dispatch(fireOnMyCellWithLog(enemyBattlefield.userName, x, y));
    }
    
    console.warn('Бот не смог найти клетку для атаки');
  }
};