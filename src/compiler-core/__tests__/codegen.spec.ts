test.todo("interpolation", () => {
  const { code } = generate(
    createRoot({
      codegenNode: createInterpolation(`hello`, locStub),
    })
  );
  expect(code).toMatch(`return _${helperNameMap[TO_DISPLAY_STRING]}(hello)`);
  expect(code).toMatchSnapshot();
});
