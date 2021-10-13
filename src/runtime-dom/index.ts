// 源码里面这些接口是由 runtime-dom 来实现
// 这里先简单实现

import { isOn } from "../shared";

// 后面也修改成和源码一样的实现
export function hostCreateElement(type) {
  console.log("hostCreateElement", type);
  const element = document.createElement(type);
  return element;
}

export function hostCreateText(text) {
  return document.createTextNode(text);
}

export function hostSetText(node, text) {
  node.nodeValue = text;
}

export function hostSetElementText(el, text) {
  console.log("hostSetElementText", el, text);
  el.textContent = text;
}

export function hostPatchProp(el, key, preValue, nextValue) {
  // preValue 之前的值
  // 为了之后 update 做准备的值
  // nextValue 当前的值
  console.log(`hostPatchProp 设置属性:${key} 值:${nextValue}`);
  console.log(`key: ${key} 之前的值是:${preValue}`);

  if (isOn(key)) {
    // 添加事件处理函数的时候需要注意一下
    // 1. 添加的和删除的必须是一个函数，不然的话 删除不掉
    //    那么就需要把之前 add 的函数给存起来，后面删除的时候需要用到
    // 2. nextValue 有可能是匿名函数，当对比发现不一样的时候也可以通过缓存的机制来避免注册多次
    // 存储所有的事件函数
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[key];
    if (nextValue && existingInvoker) {
      // patch
      // 直接修改函数的值即可
      existingInvoker.value = nextValue;
    } else {
      const eventName = key.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = (invokers[key] = nextValue);
        el.addEventListener(eventName, invoker);
      } else {
        el.removeEventListener(eventName, existingInvoker);
        invokers[key] = undefined;
      }
    }
  } else {
    if (nextValue === null || nextValue === "") {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}

export function hostInsert(child, parent, anchor = null) {
  console.log("hostInsert");
  if (anchor) {
    parent.insertBefore(child, anchor);
  } else {
    parent.appendChild(child);
  }
}

export function hostRemove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}
