import { addLog, setMoveNow } from "@/entities";
import { changeEnemyName, randomEnemyField } from "@/entities";
import { changeMyName, changeMyReadyMode, changeEnemyReadyMode } from "@/entities";
import type { AppDispatch, RootState } from "../../../shared/store/types/store";

export const prepareGame = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(randomEnemyField());
    dispatch(changeMyReadyMode());
    dispatch(changeEnemyReadyMode());
    dispatch(changeMyName({ name: 'player' }));
    dispatch(changeEnemyName({ name: 'bot' }));

    const state = getState();
    
    dispatch(setMoveNow({name: state.myBattlefield.userName}))

    dispatch(addLog({ 
      log: `${state.myBattlefield.userName} готов`, 
      type: '_common' 
    }));
    dispatch(addLog({ 
      log: `${state.enemyBattlefield.userName} готов`, 
      type: '_common' 
    }));
  };
};