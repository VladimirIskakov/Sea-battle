import React, { useState, useRef, useCallback } from 'react';
import styles from './ship-field-placement.module.scss';
import type { BattlefieldState } from '@/entities';
import { ShipPlacementValidator } from '@/shared/utils';

interface GameGridPlacementProps {
  battlefield: BattlefieldState,
  onCellDrop: (x: number, y: number, shipLength: number, direction: 'vertical' | 'horizontal', isCurrentPlacementValid: () => boolean) => void;
  draggingShipLength?: number | null;
  shipDirection: 'vertical' | 'horizontal';
  hidden?: boolean,
}

export function GameGridPlacement({battlefield, onCellDrop, draggingShipLength = null, shipDirection, hidden = false}: GameGridPlacementProps) {
  const rows = 10;
  const cols = 10;
  const [hoverCell, setHoverCell] = useState<{x: number, y: number} | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const validator = new ShipPlacementValidator(battlefield.field, rows, cols, hoverCell, draggingShipLength, shipDirection);

  // Обработчик для определения клетки под курсором
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!gridRef.current) return;
    
    // Получаем все клетки
    const cells = gridRef.current.querySelectorAll(`.${styles.grid__cell}`);
    
    // Находим клетку, над которой находится курсор
    let targetCell = null;
    for (const cell of cells) {
      const rect = cell.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const x = parseInt(cell.getAttribute('data-x') || '0');
        const y = parseInt(cell.getAttribute('data-y') || '0');
        targetCell = { x, y };
        break;
      }
    }
    
    setHoverCell(targetCell);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!hoverCell) return;
    
    const shipLength = parseInt(e.dataTransfer.getData('shipLength'));
    onCellDrop(hoverCell.x, hoverCell.y, shipLength, shipDirection, validator.isCurrentPlacementValid);
    setHoverCell(null)
    
  }, [hoverCell, shipDirection, onCellDrop]);

  

  return (
    <div 
      className={styles.grid}
      ref={gridRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={() => setHoverCell(null)}
    >

      {/* Индикатор направления */}
      <div className={styles.directionIndicator}>
        Направление: {shipDirection === 'vertical' ? 'Вертикальное' : 'Горизонтальное'} (R для смены)
      </div>
      
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
            const hasShip = validator.hasShipInCell(colIndex, rowIndex);
            const isHighlighted = validator.shouldHighlightCell(colIndex, rowIndex);
            const isValid = validator.isCurrentPlacementValid();
            const cellClasses = `${styles.grid__cell} ${!hasShip ? (isHighlighted ? (isValid ? styles.grid__cell_highlight : styles.grid__cell_invalid) : '') : ( !hidden ? styles[`grid__cell_ship${battlefield.field[colIndex][rowIndex].hasShip}`] : '')}`;
            
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