import { useRef } from 'react';
import styles from './game-grid.module.scss';
import type { BattlefieldState } from '@/entities';
import { hasShipInCellExtended } from '@/shared/utils';

interface GameGridProps {
  battlefield: BattlefieldState,
  hidden?: boolean,
  enemy?: boolean
}

export function GameGrid({battlefield, hidden = false, enemy = false}: GameGridProps) {
  const rows = 10;
  const cols = 10;
  const gridRef = useRef<HTMLDivElement>(null);


  return (
    <div 
      className={styles.grid}
      ref={gridRef}
    >
      {/* Заголовок с буквами */}
      <div className={styles.grid__header}>
        <div className={styles.grid__corner}></div>
        {Array.from({ length: cols }, (_, i) => (
          <div key={i} className={styles.grid__colHeader}>
            {String.fromCharCode(65 + i)} 
          </div>
        ))}
      </div>
      
      {/* Тело сетки с рядами */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className={styles.grid__row}>
          {/* Заголовок ряда с цифрой */}
          <div className={styles.grid__rowHeader}>
            {rowIndex + 1}
          </div>
          
          {/* Клетки ряда */}
          {Array.from({ length: cols }, (_, colIndex) => {
            const hasShip = hasShipInCellExtended(battlefield.field, colIndex, rowIndex, rows, cols,);
            const cellClasses = `${styles.grid__cell} 
            ${
              !hasShip ?  '' : 
              ( !hidden ? styles[`grid__cell_ship${battlefield.field[colIndex][rowIndex].hasShip}`] 
                : 
              '')
            }`;
            
            return (
              <div
                key={colIndex}
                className={cellClasses}
                data-x={colIndex}
                data-y={rowIndex}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}