import styles from './game-grid.module.scss';

interface GameGridProps {
  getCellStatus: (x: number, y: number) => {hasShip: number | null, isHighlighted: boolean, isValid: boolean};
  shipDirection?: 'vertical' | 'horizontal' ;
  hidden?: boolean;
  handleDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  setHoverCell?: (value: { x: number; y: number } | null) => void;
}

export function GameGrid({getCellStatus, hidden = false, handleDragOver, handleDrop, setHoverCell}: GameGridProps) {
  const rows = 10;
  const cols = 10;

  const renderCell = (x: number, y: number) => {
    const cellStatus = getCellStatus(x, y)

    const cellClasses = `${!(cellStatus.hasShip != null) ? (cellStatus.isHighlighted ? (cellStatus.isValid ? styles.grid__cell_highlight : styles.grid__cell_invalid) : '') : styles[`grid__cell_ship${cellStatus.hasShip}`]}`
    return cellClasses;
  }

  return (
    <div 
      className={styles.grid}
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
            const cellClasses = `${styles.grid__cell} ${ !hidden ? renderCell(colIndex, rowIndex) : ''}`;
            
            return (
              <div
                key={colIndex}
                className={cellClasses}
                data-x={colIndex}
                data-y={rowIndex}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={setHoverCell ? () => setHoverCell(null) : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}