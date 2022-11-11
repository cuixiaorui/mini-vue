describe("customRenderer", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/customRenderer/");
    cy.get("canvas").should("exist")
  });
});