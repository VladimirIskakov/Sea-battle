import styles from './game-grid-active.module.scss';
import type { BattlefieldState, Cell } from '@/entities';
import { GameGrid } from '@/shared/ui';
import { ShipPlacementValidator } from '@/shared/utils';



interface GameGridProps {
  onCellClick?: (x: number, y: number) => void;
  title?: string,
  battlefield: BattlefieldState,
  hidden?: boolean,
}

export function GameGridActive({onCellClick, title, battlefield, hidden = false}: GameGridProps) {
  const rows = 10;
  const cols = 10;
  const validator = new ShipPlacementValidator(battlefield.field, rows, cols);

  const onCellStatusGet = (x: number, y: number) => validator.getCellStatus(x, y);

  return (
    <div 
      className={styles.gameGridActive}
    >
      <h2>{title}</h2>
      <GameGrid onCellClick={onCellClick} getCellStatus={onCellStatusGet} hidden={hidden}/>
    </div>
  );
}