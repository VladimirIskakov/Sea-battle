import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { GameGridActive } from "@/features";
import { GameLogs} from "./game-logs"; 
import styles from './game.page.module.scss';
import { botAttack, fireOnEnemyCellWithLog, selectEnemyBattlefield, selectMyBattlefield, useAppDispatch } from '@/shared/store';
import { selectMovesStore } from '@/shared/store/types/store';

export function Game() {
  const myBattlefield = useSelector(selectMyBattlefield);
  const enemyBattlefield = useSelector(selectEnemyBattlefield);
  const moveStage = useSelector(selectMovesStore)

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkReadiness = () => {
      if (!myBattlefield.readyForBattle || !enemyBattlefield.readyForBattle) {
        navigate('/');
      } 
    };

    checkReadiness();
  }, [myBattlefield.readyForBattle, enemyBattlefield.readyForBattle, navigate, dispatch, moveStage]);

  useEffect(() => {
    if (enemyBattlefield.userName && moveStage.moveNow === enemyBattlefield.userName) {
      dispatch(botAttack());
    }
  }, [moveStage, enemyBattlefield.userName, dispatch]);

  const attackEnemy = (x: number, y: number) => {
    dispatch(fireOnEnemyCellWithLog(myBattlefield.userName , x, y));
    
  };

  return (
    <div className={styles.gamePage}>
      <h1>Морской бой</h1>
      <div className={styles.gamePage__gameGrid}>
        <GameGridActive battlefield={myBattlefield} title={`Поле ${myBattlefield.userName}`}/>
        <GameGridActive onCellClick={attackEnemy} battlefield={enemyBattlefield} hidden={true} title={`Поле ${enemyBattlefield.userName}`}/>
      </div>
      <GameLogs />
    </div>
  );
}
