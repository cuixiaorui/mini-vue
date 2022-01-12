import { NodeTypes } from "../ast";
import { CREATE_ELEMENT_VNODE } from "../runtimeHelpers";

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    // TODO 没有实现 block  所以这里直接创建 element
    context.helper(CREATE_ELEMENT_VNODE);
  }
}
