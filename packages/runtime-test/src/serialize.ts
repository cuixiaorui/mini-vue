// 把 node 给序列化
// 测试的时候好对比
// 序列化： 把一个对象给处理成 string （进行流化）
export function serialize(node) {
  return serializeElement(node);
}

function serializeElement(node) {
  return `<${node.tag}></${node.tag}>`;
}
