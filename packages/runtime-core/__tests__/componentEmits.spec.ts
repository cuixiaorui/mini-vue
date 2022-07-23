import { nodeOps, render, h } from "@mini-vue/runtime-test";

describe("component: emits", () => {
  test("trigger handlers", () => {
    const Foo = {
      render() {
	return h("foo")
      },
      setup(props, { emit }) {
        // the `emit` function is bound on component instances
        emit("foo");
        emit("bar");
      },
    };

    const onfoo = jest.fn();
    const onBar = jest.fn();
    const Comp = {
      render() {
        return h(Foo, { onfoo, onBar });
      },
    };
    render(h(Comp), nodeOps.createElement("div"));

    expect(onfoo).not.toHaveBeenCalled();
    // only capitalized or special chars are considered event listeners
    expect(onBar).toHaveBeenCalled();
  });
});
