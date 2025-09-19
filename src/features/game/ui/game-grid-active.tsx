import type { BattlefieldState } from '@/shared/store/types';
import styles from './game-grid-active.module.scss';
import { GameGrid } from '@/widgets';
import { useMemo } from 'react';


interface GameGridProps {
  onCellClick?: (x: number, y: number) => void;
  title?: string,
  battlefield: BattlefieldState,
  hidden?: boolean,
}

export function GameGridActive({onCellClick, title, battlefield, hidden = false}: GameGridProps) {

  const getCellStatus = useMemo(() => {
    return (x: number, y: number) => {
      const cell = battlefield.field[x][y];
      return {
        x: x,
        y: y,
        hasShip: cell.hasShip,
        isHighlighted: false,
        isValid: true,
        isMissed: cell.isMissed,
        isHit: cell.isHit
      };
    };
  }, [battlefield.field]);

  return (
    <div 
      className={styles.gameGridActive}
    >
      <h2>{title}</h2>
      <GameGrid onCellClick={onCellClick} getCellStatus={getCellStatus} hidden={hidden}/>
    </div>
  );
}