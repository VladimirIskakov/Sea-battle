import { GameGridPlacement } from '@/features/fleet-deployment/ship-field-placement';
import { ShipDnd } from '@/features';
import styles from './fleet-deployment.module.scss'
import { useState, useEffect } from 'react';
import { placeMyShip, resetMyGame, store } from '@/entities';
import { CustomButton } from '@/shared/ui';


export function FleetDeployment() {
  const [draggingShipLength, setDraggingShipLength] = useState<number | null>(null);
  const [shipDirection, setShipDirection] = useState<'vertical' | 'horizontal'>('horizontal');

  const [battlefield, setBattlefield] = useState(store.getState().myBattlefield);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setBattlefield(store.getState().myBattlefield);
    });

    return unsubscribe;
  }, []);


  // Обработчик нажатия клавиш
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
        console.log(e.key)
      if ((e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К')) {
        setShipDirection(prev => prev === 'vertical' ? 'horizontal' : 'vertical');
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [draggingShipLength]);

  const handleCellDrop = (x: number, y: number, shipLength: number, direction: 'vertical' | 'horizontal', isCurrentPlacementValid: () => boolean) => {
    const colLetter = String.fromCharCode(65 + x);
    console.log(`Корабль длиной ${shipLength} помещен в клетку ${colLetter}${y + 1} с направлением ${direction} ${isCurrentPlacementValid()}`);
    if (isCurrentPlacementValid()) store.dispatch(placeMyShip({
      x: x,
      y: y,
      shipLength: shipLength,
      direction: direction
    }))
  };

  const handleDragStart = (length: number) => {
    setDraggingShipLength(length);
  };

  const handleDragEnd = () => {
    setDraggingShipLength(null);
  };

  const handleReset = () => {
      store.dispatch(resetMyGame())
  }
  
  return (
    <div className={styles.fleetDeployment}>
      <div className={styles.fleetDeployment__container}>
        <div className={styles.fleetDeployment__extended}>
          <CustomButton 
            className={styles.fleetDeployment__button} 
            onClick={handleReset}
          >
            Сбросить
          </CustomButton>
          <CustomButton 
            className={styles.fleetDeployment__button} 
            onClick={handleReset}
          >
            Случайное расположение
          </CustomButton>
        </div>
        

          <GameGridPlacement
            battlefield={battlefield}
            onCellDrop={handleCellDrop} 
            draggingShipLength={draggingShipLength}
            shipDirection={shipDirection}
          />
          
          <div className={styles.fleetDeployment__ships}>
              {
              battlefield.ships.map((ship, shipIndex) => (
                <div 
                  key={`group-${ship.length}-${shipIndex}`} 
                  className={styles.fleetDeployment__group}
                >
                    {Array.from({ length: ship.count }, (_, i) => (
                      <ShipDnd 
                        key={`${ship.length}-${i}`}
                        shipDirection={shipDirection} 
                        length={ship.length} 
                        onDragStart={() => handleDragStart(ship.length)}
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                  </div>
                  ))
              }      
        </div>
      </div>
      
      <CustomButton 
        disabled={battlefield.numberShips === 10 ? false : true} 
        className={styles.fleetDeployment__start}
      >
        Начать
      </CustomButton>
    </div>
  );
}