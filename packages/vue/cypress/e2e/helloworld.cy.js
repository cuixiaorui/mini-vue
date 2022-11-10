describe("helloworld", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/helloWorld/");
    cy.contains("主页");
    cy.contains("hello world:");
    cy.contains("count: 0");
  });
});
