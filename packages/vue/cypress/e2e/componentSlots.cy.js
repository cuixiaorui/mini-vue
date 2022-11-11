describe("componentSlots", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/componentSlots/");
    cy.contains("你好");
    cy.get("[data-test='child']").within(() => {
      cy.contains("child");
      cy.contains("我是通过 slot 渲染出来的第一个元素");
      cy.contains("我是通过 slot 渲染出来的第一个元素");
      cy.contains("我可以接收到");
      cy.contains("age: 16");
    });
  });
});



