import { isReactive, isReadonly, readonly, shallowReadonly } from "../src/reactive";

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReactive(props.n)).toBe(false);
  });
  test("should differentiate from normal readonly calls", async () => {
    const original = { foo: {} };
    const shallowProxy = shallowReadonly(original);
    const reactiveProxy = readonly(original);
    expect(shallowProxy).not.toBe(reactiveProxy);
    expect(isReadonly(shallowProxy.foo)).toBe(false);
    expect(isReadonly(reactiveProxy.foo)).toBe(true);
  });
});
