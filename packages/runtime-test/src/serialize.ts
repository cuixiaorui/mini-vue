// 把 node 给序列化
// 测试的时候好对比

import { NodeTypes } from "./nodeOps";

// 序列化： 把一个对象给处理成 string （进行流化）
export function serialize(node) {
  if (node.type === NodeTypes.ELEMENT) {
    return serializeElement(node);
  } else {
    return serializeText(node);
  }
}

function serializeText(node) {
  return node.text;
}

export function serializeInner(node) {
  // 把所有节点变成一个string
  return node.children.map((c) => serialize(c)).join(``);
}

function serializeElement(node) {
  // 把 props 处理成字符串
  // 规则：
  // 如果 value 是 null 的话 那么直接返回 ``
  // 如果 value 是 `` 的话，那么返回 key
  // 不然的话返回 key = value（这里的值需要字符串化）
  const props = Object.keys(node.props)
    .map((key) => {
      const value = node.props[key];
      return value == null
        ? ``
        : value === ``
        ? key
        : `${key}=${JSON.stringify(value)}`;
    })
    .filter(Boolean)
    .join(" ");

  console.log("node---------", node.children);
  return `<${node.tag}${props ? ` ${props}` : ``}>${serializeInner(node)}</${
    node.tag
  }>`;
}
