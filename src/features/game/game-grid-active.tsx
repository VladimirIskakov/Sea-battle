import styles from './game-grid-active.module.scss';
import type { BattlefieldState, Cell } from '@/entities';
import { GameGrid } from '@/shared/ui';
import { ShipPlacementValidator } from '@/shared/utils';



interface GameGridProps {
  title?: string,
  battlefield: BattlefieldState,
  hidden?: boolean,
  enemy?: boolean
}

export function GameGridActive({title, battlefield, hidden = false, enemy = false}: GameGridProps) {
  const rows = 10;
  const cols = 10;
  const validator = new ShipPlacementValidator(battlefield.field, rows, cols);

const renderCell = (x: number, y: number) => {
  const hasShip = validator.hasShipInCell(x, y);
  const cellClasses = `${!hasShip ?  '' : styles[`grid__cell_ship${battlefield.field[x][y].hasShip}`]}`
  return cellClasses;
}

const onCellStatusGet = (x: number, y: number) => validator.getCellStatus(x, y);

  return (
    <div 
      className={styles.gameGridActive}
    >
      <h2>{title}</h2>
      <GameGrid getCellStatus={onCellStatusGet} hidden={hidden}/>
    </div>
  );
}