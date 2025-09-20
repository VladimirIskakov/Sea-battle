describe('Страница Размещения Флота', () => {
  beforeEach(() => {
    cy.visit('/fleetdep');
  });

  it('Кнопки Сбросить и Случайное расположение работают', () => {
    cy.contains('Сбросить').should('be.visible');
    cy.contains('Случайное расположение').should('be.visible').click();
  });

  it('Можно переключить направление корабля клавишей r', () => {
    cy.get('body').type('r');
  });

  it('Начинает игру при готовности', () => {
    cy.visit('/fleetdep');

    cy.contains('Случайное расположение').click();

    cy.contains('Начать').should('not.be.disabled');

    cy.contains('Начать').click();

    cy.url().should('include', '/game');
    });
});
