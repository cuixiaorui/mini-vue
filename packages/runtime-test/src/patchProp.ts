export function patchProp(el, key, prevValue, nextValue) {
  el[key] = nextValue;
}
