describe('Страница Меню', () => {
  it('Отображается кнопка Одиночная игра и происходит навигация', () => {
    cy.visit('/');
    cy.contains('Одиночная игра').should('be.visible').click();
    cy.url().should('include', '/fleetdep');
  });
});
