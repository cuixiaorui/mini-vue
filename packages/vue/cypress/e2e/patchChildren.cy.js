describe("patchChildren", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/patchChildren/");

    cy.get("[data-cy='contain']").should("text", "ABCEFG");

    cy.get("button").click();
    
    cy.get("[data-cy='contain']").should("text", "ABECDFG");

    cy.get("button").click();

    cy.get("[data-cy='contain']").should("text", "ABCEFG");
  });
});
