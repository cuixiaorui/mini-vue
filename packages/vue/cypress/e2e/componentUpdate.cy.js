describe("componentUpdate", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/componentUpdate/");
    cy.contains("child123")
    cy.get("button").click()
    cy.contains("child456")
  });
});