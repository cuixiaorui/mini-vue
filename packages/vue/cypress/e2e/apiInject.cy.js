describe("apiInject", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/apiInject/");
    cy.contains("apiInject")
    cy.contains("fooOverride-bar-baz")
  });
});