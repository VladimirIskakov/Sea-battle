import { store } from "@/entities";
import { GameGrid} from "@/features";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './game.page.module.scss'

export function Game() {
  const [myBattlefield, setMyBattlefield] = useState(store.getState().myBattlefield);
  const [enemyBattlefield, setEnemyBattlefield] = useState(store.getState().enemyBattlefield);
  const navigate = useNavigate();

  useEffect(() => {
    const checkReadiness = () => {
      const myReady = store.getState().myBattlefield.readyForBattle;
      const enemyReady = store.getState().enemyBattlefield.readyForBattle;
      
      if (!myReady || !enemyReady) {
        navigate('/'); 
      }
    };
    checkReadiness();
    const unsubscribe = store.subscribe(checkReadiness);
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className={styles.gamePage}>
      <h1>Морской бой</h1>
      <div className={styles.gamePage__gameGrid}>
        <GameGrid battlefield={myBattlefield} />
        <GameGrid battlefield={enemyBattlefield} hidden={true}/>
      </div>
    </div>
  );
}