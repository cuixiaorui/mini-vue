import { reactive } from "@mini-vue/reactivity";
import { watchEffect } from "../src/apiWatch";
import { nextTick } from "../src/scheduler";

describe("api: watch", () => {
  it("effect", async () => {
    const state = reactive({ count: 0 });
    let dummy;
    watchEffect(() => {
      dummy = state.count;
    });
    expect(dummy).toBe(0);

    state.count++;
    await nextTick();
    expect(dummy).toBe(1);
  });
});
