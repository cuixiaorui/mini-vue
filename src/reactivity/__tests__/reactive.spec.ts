import { reactive, isReactive } from "../src/reactive";
describe("reactive", () => {
  test("Object", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    // get
    //     expect(observed.foo).toBe(1);
    //     // has
    //     expect("foo" in observed).toBe(true);
    //     // ownKeys
    //     expect(Object.keys(observed)).toEqual(["foo"]);
  });
});
