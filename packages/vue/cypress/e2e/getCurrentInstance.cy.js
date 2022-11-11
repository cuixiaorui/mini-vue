describe("currentInstance", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/getCurrentInstance/");
    cy.contains("getCurrentInstance")
  });
});