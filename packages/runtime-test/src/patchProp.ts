export function patchProp(el, key, prevValue, nextValue) {
  el.props[key] = nextValue;
}
