describe('Страница Игры', () => {
  type Cell = {
    x: number;
    y: number;
    hasShip: number | null;
    isHit: boolean;
    isMissed: boolean;
  };

  type Battlefield = Cell[][];

  const createInitialField = (): Battlefield => {
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

  const exampleMyBattlefield = {
    userName: 'player1',
    readyForBattle: true,
    numberShips: 1,
    ships: [
      { count: 0, length: 4 },
      { count: 1, length: 3 },
      { count: 2, length: 2 },
      { count: 3, length: 1 },
    ],
    field: createInitialField()
  };

  for(let i = 0; i < 4; i++) {
    exampleMyBattlefield.field[0][i].hasShip = 4;
  }

  const exampleEnemyBattlefield = {
    userName: 'bot',
    readyForBattle: true,
    numberShips: 1,
    ships: [
      { count: 0, length: 4 },
      { count: 1, length: 3 },
      { count: 2, length: 2 },
      { count: 3, length: 1 },
    ],
    field: createInitialField()
  };

  for(let i = 0; i < 3; i++) {
    exampleEnemyBattlefield.field[i][0].hasShip = 3;
  }

  beforeEach(() => {
    cy.clearLocalStorage();
    
    cy.window().then(win => {
      win.localStorage.setItem('myBattlefield', JSON.stringify(exampleMyBattlefield));
      win.localStorage.setItem('enemyBattlefield', JSON.stringify(exampleEnemyBattlefield));
      win.localStorage.setItem('movesStore', JSON.stringify({ moveNow: 'player1' }));
    });

    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake((message) => {
        throw new Error(message);
      });
    });

    cy.visit('/game');
    
    cy.get('body', { timeout: 20000 }).should('be.visible');
    
    cy.contains('Морской бой', { timeout: 20000 }).should('be.visible');
  });

  it('Показывает оба поля', () => {
    cy.window().then(win => {
      console.log('LocalStorage myBattlefield:', win.localStorage.getItem('myBattlefield'));
      console.log('LocalStorage enemyBattlefield:', win.localStorage.getItem('enemyBattlefield'));
      console.log('LocalStorage movesStore:', win.localStorage.getItem('movesStore'));
    });
    
    cy.window().its('store').should('exist');
    cy.window().its('store').invoke('getState').then(state => {
      console.log('Redux state:', state);
    });
    
    cy.get('*').then($els => {
      console.log('All elements on page:', $els.length);
      $els.each((i, el) => {
        if (el.hasAttribute('data-testid')) {
          console.log('Element with data-testid:', el.getAttribute('data-testid'));
        }
        if (el.className && el.className.includes('grid')) {
          console.log('Element with grid class:', el.className);
        }
      });
    });
    
    cy.contains('Поле player1', { timeout: 20000 }).should('be.visible');
    cy.contains('Поле bot', { timeout: 20000 }).should('be.visible');

    cy.get('[data-testid="game-grid-active"]', { timeout: 20000 }).should('have.length', 2);
    
    cy.get('[data-testid="game-grid-active"]').first()
      .find('[data-x="0"][data-y="0"]')
      .should('have.attr', 'class')
      .and('match', /grid__cell_ship4/);
  });

  it('Редиректит если поля не готовы', () => {
    cy.clearLocalStorage();
    
    cy.visit('/game');
    
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`, { timeout: 5000 });
  });
});