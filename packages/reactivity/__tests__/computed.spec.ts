import { computed } from "../src/computed";
import { reactive } from "../src/reactive";
import {vi} from 'vitest'

describe("computed", () => {
  it("happy path", () => {
    const value = reactive({
      foo: 1,
    });

    const getter = computed(() => {
      return value.foo;
    });

    value.foo = 2;
    expect(getter.value).toBe(2);
  });

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = vi.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
