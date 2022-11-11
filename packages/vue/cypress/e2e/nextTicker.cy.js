describe("nextTicker", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/nextTicker/");
    cy.contains("主页")
    cy.contains("child1")
    cy.contains("count:1")
    cy.contains("child2")
    cy.contains("count:1")
  });
});