const queue: any[] = [];

let isFlushPending = false;

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
    // 执行所有的 job
    queueFlush();
  }
}

function queueFlush() {
  // 如果同时触发了两个组件的更新的话
  // 这里就会触发两次 then （微任务逻辑）
  // 但是着是没有必要的
  // 我们只需要触发一次即可处理完所有的 job 调用
  // 所以需要
  if (isFlushPending) return;
  isFlushPending = true;
  Promise.resolve().then(() => {
    isFlushPending = false;
    console.log("???");
    let job;
    while ((job = queue.shift())) {
      if (job) {
        job();
      }
    }
  });
}
