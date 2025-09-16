import { ShipPlacementValidator } from '@/shared/utils';
import type { BattlefieldState, Battlefield, Cell, ShipLength } from '../types';

export const createInitialField = (): Battlefield => {
  const field: Battlefield = [];
  
  for (let y = 0; y < 10; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < 10; x++) {
      row.push({
        x,
        y,
        hasShip: null, 
        isHit: false,
        isMissed: false
      });
    }
    field.push(row);
  }
  
  return field;
};

export const createInitialShips = (): { length: ShipLength; count: number }[] => {
  return [
    { length: 1, count: 4 },
    { length: 2, count: 3 },
    { length: 3, count: 2 },
    { length: 4, count: 1 }
  ];
};

export const createInitialState = (): BattlefieldState => ({
  userName: '',
  field: createInitialField(),  
  numberShips: 0,
  ships: createInitialShips(), 
  readyForBattle: false,
});

export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export const initialRandomState = (): BattlefieldState => {
  const state: BattlefieldState = createInitialState();

  

  state.ships.slice().reverse().forEach((ship, reversedIndex) => {
    const shipLength = 4 - reversedIndex; 
    
    let attempts = 0;
    const maxAttempts = 1000; 
    
    while (ship.count > 0 && attempts < maxAttempts) {
      attempts++;
      
      const x = getRandomInt(0, 9);
      const y = getRandomInt(0, 9);
      const direction = getRandomInt(0, 1) === 0 ? 'vertical' : 'horizontal';
      
      const validator = new ShipPlacementValidator(
        state.field,  
        10,          
        10,         
        { x, y },   
        shipLength,   
        direction    
      );
      
      if (validator.isCurrentPlacementValid()) {
        for (let i = 0; i < shipLength; i++) {
          const cellX = direction === 'horizontal' ? x + i : x;
          const cellY = direction === 'vertical' ? y + i : y;
          state.field[cellX][cellY].hasShip = shipLength;
        }
        
        ship.count -= 1;
        state.numberShips += 1;
        attempts = 0;  
      }
    }
    
    if (ship.count > 0) {
      console.warn(`Не удалось разместить ${ship.count} кораблей длиной ${shipLength} после ${maxAttempts} попыток.`);
    }
  });

  return state;
};