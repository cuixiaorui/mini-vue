describe("api: watch", () => {
  it.todo("effect", async () => {
    // 先实现个 watchEffect 玩一玩
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
