import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { GameGridActive } from "@/features";
import { GameLogs} from "./game-logs"; 
import styles from './game.page.module.scss';
import { addLog, fireOnEnemyCell, selectEnemyBattlefield, selectMyBattlefield } from '@/entities/store/store';

export function Game() {
  const myBattlefield = useSelector(selectMyBattlefield);
  const enemyBattlefield = useSelector(selectEnemyBattlefield);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkReadiness = () => {
      if (!myBattlefield.readyForBattle || !enemyBattlefield.readyForBattle) {
        navigate('/');
      } 
    };
    checkReadiness();
  }, [myBattlefield.readyForBattle, enemyBattlefield.readyForBattle, navigate, dispatch]);

  const attackEnemy = (x: number, y: number) => {
    console.log(`атакую клетку ${x} ${y}`);

    const hit = enemyBattlefield.field[x][y].hasShip !== null;

    dispatch(fireOnEnemyCell({ x, y }));
    
    dispatch(addLog({
      log: `Атаковал клетку ${x} ${y} - ${hit ? 'попал' : 'мимо'}`,
      type: '_myAction'
    }));
  };

  return (
    <div className={styles.gamePage}>
      <h1>Морской бой</h1>
      <div className={styles.gamePage__gameGrid}>
        <GameGridActive battlefield={myBattlefield} title="Моё поле"/>
        <GameGridActive onCellClick={attackEnemy} battlefield={enemyBattlefield} hidden={true} title="Поле противника"/>
      </div>
      <GameLogs />
    </div>
  );
}
