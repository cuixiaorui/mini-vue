describe("componentEmit", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/componentEmit/");
    cy.contains("你好")
    cy.contains("child")
  });
});
