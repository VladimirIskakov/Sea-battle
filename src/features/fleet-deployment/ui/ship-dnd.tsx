import { Ship } from '@/shared/ui';
import styles from './ship-dnd.module.scss';

interface ShipDndProps {
  length: 1 | 2 | 3 | 4;
  className?: string;
  onDragStart: (length: number) => void;
  onDragEnd: () => void;
  shipDirection: 'vertical' | 'horizontal';
}

export const ShipDnd: React.FC<ShipDndProps> = ({
  length, 
  className = '', 
  onDragStart, 
  onDragEnd,
}) => {
    
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('shipLength', length.toString());
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(length);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const shipDndClass = `
    ${styles.shipDnd}
    ${className}
  `.trim();

  return (
    <div 
      className={shipDndClass}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Ship length={length}/>
    </div>
  );
}