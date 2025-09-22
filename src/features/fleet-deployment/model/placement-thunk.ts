import { addLog, setMoveNow } from "@/entities";
import { changeEnemyName, randomEnemyField } from "@/entities";
import { changeMyName, changeMyReadyMode, changeEnemyReadyMode } from "@/entities";
import type { AppDispatch, RootState } from "../../../shared/store/types/store";
import i18n from "@/app/providers/i18n/config";

export const prepareGame = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(randomEnemyField());
    dispatch(changeMyReadyMode());
    dispatch(changeEnemyReadyMode());
    dispatch(changeMyName({ name: 'player' }));
    dispatch(changeEnemyName({ name: 'bot' }));

    const state = getState();
    
    dispatch(setMoveNow({ name: state.myBattlefield.userName }));

    // Логи через i18n
    dispatch(addLog({ 
      log: i18n.t("logs.ready", { player: state.myBattlefield.userName }),
      type: '_common' 
    }));
    dispatch(addLog({ 
      log: i18n.t("logs.ready", { player: state.enemyBattlefield.userName }),
      type: '_common' 
    }));
  };
};
