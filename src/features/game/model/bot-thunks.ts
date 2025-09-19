import type { AppDispatch, RootState } from "../../../shared/store/types/store";
import { getRandomInt } from "../../../shared/store/utils";
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
    
    for (let x = 0; x<10; x++){
      for (let y = 0; y<10; y++){
        dispatch(fireOnMyCellWithLog(enemyBattlefield.userName, x, y));
      }
    }
  }
};