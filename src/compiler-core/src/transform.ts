import { NodeTypes } from "./ast";

export function transform(root, options = {}) {
  // 1. 创建 context

  const context = createTransformContext(root, options);

  // 2. 遍历 node
  traverseNode(root, context);
}

function traverseNode(node: any, context) {
  const type: NodeTypes = node.type;

  // 遍历调用所有的 nodeTransforms
  // 把 node 给到 transform
  // 用户可以对 node 做处理
  const nodeTransforms = context.nodeTransforms;

  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    // TODO transform 可以返回一个函数， 作为 exit 的时候调用
    transform(node, context);
  }

  switch (type) {
    //     case NodeTypes.INTERPOLATION:
    // 如果是插值的话
    // help ?

    //       break;

    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;

    default:
      break;
  }
}

function traverseChildren(parent: any, context: any) {
  // node.children
  parent.children.forEach((node) => {
    // TODO 需要设置 context 的值
    traverseNode(node, context);
  });
}

function createTransformContext(root, options): any {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };

  return context;
}
