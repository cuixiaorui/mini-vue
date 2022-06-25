import { NodeTypes } from "../ast";
import { isText } from "../utils";

export function transformText(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    // 在 exit 的时期执行
    // 下面的逻辑会改变 ast 树
    // 有些逻辑是需要在改变之前做处理的
    return () => {
      // hi,{{msg}}
      // 上面的模块会生成2个节点，一个是 text 一个是 interpolation 的话
      // 生成的 render 函数应该为 "hi," + _toDisplayString(_ctx.msg)
      // 这里面就会涉及到添加一个 “+” 操作符
      // 那这里的逻辑就是处理它

      // 检测下一个节点是不是 text 类型，如果是的话， 那么会创建一个 COMPOUND 类型
      // COMPOUND 类型把 2个 text || interpolation 包裹（相当于是父级容器）

      const children = node.children;
      let currentContainer;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (isText(child)) {
          // 看看下一个节点是不是 text 类
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              // currentContainer 的目的是把相邻的节点都放到一个 容器内
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  loc: child.loc,
                  children: [child],
                };
              }

              currentContainer.children.push(` + `, next);
              // 把当前的节点放到容器内, 然后删除掉j
              children.splice(j, 1);
              // 因为把 j 删除了，所以这里就少了一个元素，那么 j 需要 --
              j--;
            } else {
              currentContainer = undefined;
              break;
            }
          }
        }
      }
    };
  }
}
