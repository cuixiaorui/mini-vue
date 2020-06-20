import Main from "../src/main";

test("version is 1.0.1?", () => {
  const test = Main;
  expect(test()).toBe("this version is 1.0.1");
});
