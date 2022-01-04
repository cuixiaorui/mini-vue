export const enum NodeTypes {
  TEXT,
  ROOT,
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
}

export const enum ElementTypes {
  ELEMENT,
}

export function createSimpleExpression(content) {
  return {
    type: NodeTypes.SIMPLE_EXPRESSION,
    content,
  };
}

export function createInterpolation(content) {
  return {
    type: NodeTypes.INTERPOLATION,
    content: content,
  };
}
