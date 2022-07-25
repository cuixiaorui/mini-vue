import { nodeOps, render, h } from "@mini-vue/runtime-test";

describe("component: emits", () => {
  test("trigger handlers", () => {
    const Foo = {
      render() {
        return h("foo");
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

  test("trigger camelCase handler", () => {
    const Foo = {
      render() {
        return h("foo");
      },
      setup(props, { emit }) {
        emit("test-event");
      },
    };

    const fooSpy = jest.fn();
    const Comp = {
      render() {
        return h(Foo, { onTestEvent: fooSpy });
      },
    };
    render(h(Comp), nodeOps.createElement("div"));

    expect(fooSpy).toHaveBeenCalledTimes(1);
  });

  test("trigger kebab-case handler", () => {
    const Foo = {
      render() {
        return h("foo");
      },
      setup(props, { emit }) {
        emit("test-event");
      },
    };

    const fooSpy = jest.fn();

    const Comp = {
      render() {
        return h(Foo, { "onTest-event": fooSpy });
      },
    };
    render(h(Comp), nodeOps.createElement("div"));

    expect(fooSpy).toHaveBeenCalledTimes(1);
  });
});
