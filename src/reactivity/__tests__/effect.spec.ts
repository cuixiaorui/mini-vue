import { reactive } from "../src/reactive";
import { effect } from "../src/effect";

describe("effect", () => {
  it("should call function", () => {
    const user = reactive({
      age: 1,
    });

    let nextAge = 0;
    const fn = () => {
      nextAge = user.age + 1;
    };

    effect(fn);

    expect(nextAge).toBe(2);
  });

  it("trigger", () => {
    const user = reactive({
      age: 1,
    });

    let nextAge = 0;
    const fn = () => {
      nextAge = user.age + 1;
    };

    effect(fn);
    // set -> trigger
    user.age = 2;
    expect(nextAge).toBe(3);
  });
});
