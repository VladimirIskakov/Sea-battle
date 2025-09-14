import React, { useState, useCallback } from 'react';
import styles from './ship-field-placement.module.scss';
import type { BattlefieldState } from '@/entities';
import { ShipPlacementValidator } from '@/shared/utils';
import { GameGrid } from '@/shared/ui';

interface GameGridPlacementProps {
  battlefield: BattlefieldState,
  onCellDrop: (x: number, y: number, shipLength: number, direction: 'vertical' | 'horizontal', isCurrentPlacementValid: () => boolean) => void;
  draggingShipLength?: number | null;
  shipDirection: 'vertical' | 'horizontal';
  hidden?: boolean,
}

export function GameGridPlacement({battlefield, onCellDrop, draggingShipLength = null, shipDirection}: GameGridPlacementProps) {
  const rows = 10;
  const cols = 10;
  const [hoverCell, setHoverCell] = useState<{x: number, y: number} | null>(null);

  const validator = new ShipPlacementValidator(battlefield.field, rows, cols, hoverCell, draggingShipLength, shipDirection);

  // Обработчик для определения клетки под курсором
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();

  const cell = e.currentTarget;
  const x = Number(cell.getAttribute('data-x'));
  const y = Number(cell.getAttribute('data-y'));

  setHoverCell({ x, y });
}, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();

  const cell = e.currentTarget;
  const x = Number(cell.getAttribute('data-x'));
  const y = Number(cell.getAttribute('data-y'));
  const shipLength = parseInt(e.dataTransfer.getData('shipLength'));

  if (!shipLength) return;

  onCellDrop(x, y, shipLength, shipDirection, validator.isCurrentPlacementValid);
    setHoverCell(null);
  }, [onCellDrop, shipDirection, validator]);

  const onCellStatusGet = (x: number, y: number) => validator.getCellStatus(x, y);

  return (
    <div 
      className={styles.gameGridPlacement}
    >

      <GameGrid handleDragOver = {handleDragOver} handleDrop = {handleDrop} setHoverCell={setHoverCell} getCellStatus={onCellStatusGet}/>
      
      
    </div>
  );
}