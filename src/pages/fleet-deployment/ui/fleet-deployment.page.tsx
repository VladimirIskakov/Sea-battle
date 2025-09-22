import { GameGridPlacement } from '@/features/fleet-deployment/ui/ship-field-placement';
import styles from './fleet-deployment.module.scss'
import { useState, useEffect } from 'react';
import { CustomButton } from '@/shared/ui';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { 
  selectEnemyBattlefield, 
  selectMyBattlefield, 
  useAppDispatch,
 } from '@/shared/store';
import { placeMyShip, randomMyField, resetMyGame } from '@/entities';
import { prepareGame, ShipDnd } from '@/features/fleet-deployment';
import { useTranslation } from 'react-i18next';

export function FleetDeployment() {
  const { t } = useTranslation();
  const [draggingShipLength, setDraggingShipLength] = useState<number | null>(null);
  const [shipDirection, setShipDirection] = useState<'vertical' | 'horizontal'>('horizontal');

  const dispatch = useAppDispatch();
  const myBattlefield = useSelector(selectMyBattlefield);
  const enemyBattlefield = useSelector(selectEnemyBattlefield);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
    console.log(t("logs.shipPlaced", {
      length: shipLength,
      cell: `${colLetter}${y + 1}`,
      direction,
      valid: isCurrentPlacementValid()
    }));

    if (isCurrentPlacementValid()) {
      dispatch(placeMyShip({
        x,
        y,
        shipLength,
        direction
      }));
    }
  };

  const handleDragStart = (length: number) => setDraggingShipLength(length);
  const handleDragEnd = () => setDraggingShipLength(null);

  const handleReset = () => dispatch(resetMyGame());
  const handleRandom = () => dispatch(randomMyField());

  useEffect(() => {
    if (myBattlefield.readyForBattle && enemyBattlefield.readyForBattle) {
      navigate('/game');
    }
  }, [myBattlefield.readyForBattle, enemyBattlefield.readyForBattle, navigate]);

  const handlerStart = () => dispatch(prepareGame());
  
  return (
    <div className={styles.fleetDeployment}>
      <div className={styles.fleetDeployment__container}>
        <div className={styles.fleetDeployment__extended}>
          <CustomButton 
            className={styles.fleetDeployment__button} 
            onClick={handleReset}
          >
            {t("throwOff")}
          </CustomButton>
          <CustomButton 
            className={styles.fleetDeployment__button} 
            onClick={handleRandom}
          >
            {t("randomLocation")}
          </CustomButton>
        </div>
        
        <GameGridPlacement
          battlefield={myBattlefield}
          onCellDrop={handleCellDrop} 
          draggingShipLength={draggingShipLength}
          shipDirection={shipDirection}
        />
          
        <div className={styles.fleetDeployment__ships}>
          {myBattlefield.ships.map((ship, shipIndex) => (
            <div key={`group-${ship.length}-${shipIndex}`} className={styles.fleetDeployment__group}>
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
          ))}      
        </div>
      </div>
      
      <CustomButton 
        disabled={myBattlefield.numberShips !== 10} 
        className={styles.fleetDeployment__start}
        onClick={handlerStart}
      >
        {t("startGame")}
      </CustomButton>
    </div>
  );
}
