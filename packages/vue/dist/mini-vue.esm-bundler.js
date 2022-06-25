var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

const toDisplayString = (val) => {
    return String(val);
};

const isObject = (val) => {
    return val !== null && typeof val === "object";
};
const isString = (val) => typeof val === "string";
const camelizeRE = /-(\w)/g;
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
};
const extend = Object.assign;
const isOn = (key) => /^on[A-Z]/.test(key);
function hasChanged(value, oldValue) {
    return !Object.is(value, oldValue);
}
function hasOwn(val, key) {
    return Object.prototype.hasOwnProperty.call(val, key);
}
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const toHandlerKey = (str) => str ? `on${capitalize(str)}` : ``;

const createVNode = function (type, props, children) {
    const vnode = {
        el: null,
        component: null,
        key: props === null || props === void 0 ? void 0 : props.key,
        type,
        props: props || {},
        children,
        shapeFlag: getShapeFlag(type),
    };
    if (Array.isArray(children)) {
        vnode.shapeFlag |= 16;
    }
    else if (typeof children === "string") {
        vnode.shapeFlag |= 8;
    }
    normalizeChildren(vnode, children);
    return vnode;
};
function normalizeChildren(vnode, children) {
    if (typeof children === "object") {
        if (vnode.shapeFlag & 1) ;
        else {
            vnode.shapeFlag |= 32;
        }
    }
}
const Text = Symbol("Text");
const Fragment = Symbol("Fragment");
function createTextVNode(text = " ") {
    return createVNode(Text, {}, text);
}
function normalizeVNode(child) {
    if (typeof child === "string" || typeof child === "number") {
        return createVNode(Text, null, String(child));
    }
    else {
        return child;
    }
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1
        : 4;
}

const h = (type, props, children) => {
    return createVNode(type, props, children);
};

function createAppAPI(render) {
    return function createApp(rootComponent) {
        const app = {
            _component: rootComponent,
            mount(rootContainer) {
                console.log("基于根组件创建 vnode");
                const vnode = createVNode(rootComponent);
                console.log("调用 render，基于 vnode 进行开箱");
                render(vnode, rootContainer);
            },
        };
        return app;
    };
}

function initProps(instance, rawProps) {
    console.log("initProps");
    instance.props = rawProps;
}

function initSlots(instance, children) {
    const { vnode } = instance;
    console.log("初始化 slots");
    if (vnode.shapeFlag & 32) {
        normalizeObjectSlots(children, (instance.slots = {}));
    }
}
const normalizeSlotValue = (value) => {
    return Array.isArray(value) ? value : [value];
};
const normalizeObjectSlots = (rawSlots, slots) => {
    for (const key in rawSlots) {
        const value = rawSlots[key];
        if (typeof value === "function") {
            slots[key] = (props) => normalizeSlotValue(value(props));
        }
    }
};

function emit(instance, event, ...rawArgs) {
    const props = instance.props;
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    if (handler) {
        handler(...rawArgs);
    }
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $emit: (i) => i.emit,
    $slots: (i) => i.slots,
    $props: (i) => i.props,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        console.log(`触发 proxy hook , key -> : ${key}`);
        if (key[0] !== "$") {
            if (hasOwn(setupState, key)) {
                return setupState[key];
            }
            else if (hasOwn(props, key)) {
                return props[key];
            }
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
    set({ _: instance }, key, value) {
        const { setupState } = instance;
        if (setupState !== {} && hasOwn(setupState, key)) {
            setupState[key] = value;
        }
        return true;
    },
};

function createDep(effects) {
    const dep = new Set(effects);
    return dep;
}

let activeEffect = void 0;
let shouldTrack = false;
const targetMap = new WeakMap();
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.fn = fn;
        this.scheduler = scheduler;
        this.active = true;
        this.deps = [];
        console.log("创建 ReactiveEffect 对象");
    }
    run() {
        console.log("run");
        if (!this.active) {
            return this.fn();
        }
        shouldTrack = true;
        activeEffect = this;
        console.log("执行用户传入的 fn");
        const result = this.fn();
        shouldTrack = false;
        activeEffect = undefined;
        return result;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn);
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
function stop(runner) {
    runner.effect.stop();
}
function track(target, type, key) {
    if (!isTracking()) {
        return;
    }
    console.log(`触发 track -> target: ${target} type:${type} key:${key}`);
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = createDep();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
function trackEffects(dep) {
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}
function trigger(target, type, key) {
    let deps = [];
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const dep = depsMap.get(key);
    deps.push(dep);
    const effects = [];
    deps.forEach((dep) => {
        effects.push(...dep);
    });
    triggerEffects(createDep(effects));
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        const isExistInReactiveMap = () => key === "__v_raw" && receiver === reactiveMap.get(target);
        const isExistInReadonlyMap = () => key === "__v_raw" && receiver === readonlyMap.get(target);
        const isExistInShallowReadonlyMap = () => key === "__v_raw" && receiver === shallowReadonlyMap.get(target);
        if (key === "__v_isReactive") {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly") {
            return isReadonly;
        }
        else if (isExistInReactiveMap() ||
            isExistInReadonlyMap() ||
            isExistInShallowReadonlyMap()) {
            return target;
        }
        const res = Reflect.get(target, key, receiver);
        if (!isReadonly) {
            track(target, "get", key);
        }
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);
        trigger(target, "set", key);
        return result;
    };
}
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        return true;
    },
};
const mutableHandlers = {
    get,
    set,
};
const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set(target, key) {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        return true;
    },
};

const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags["IS_READONLY"] = "__v_isReadonly";
    ReactiveFlags["RAW"] = "__v_raw";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(target) {
    return createReactiveObject(target, reactiveMap, mutableHandlers);
}
function readonly(target) {
    return createReactiveObject(target, readonlyMap, readonlyHandlers);
}
function shallowReadonly(target) {
    return createReactiveObject(target, shallowReadonlyMap, shallowReadonlyHandlers);
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function isReadonly(value) {
    return !!value["__v_isReadonly"];
}
function isReactive(value) {
    return !!value["__v_isReactive"];
}
function createReactiveObject(target, proxyMap, baseHandlers) {
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}

class RefImpl {
    constructor(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        this._value = convert(value);
        this.dep = createDep();
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        if (hasChanged(newValue, this._rawValue)) {
            this._value = convert(newValue);
            this._rawValue = newValue;
            triggerRefValue(this);
        }
    }
}
function ref(value) {
    return createRef(value);
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function createRef(value) {
    const refImpl = new RefImpl(value);
    return refImpl;
}
function triggerRefValue(ref) {
    triggerEffects(ref.dep);
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
const shallowUnwrapHandlers = {
    get(target, key, receiver) {
        return unRef(Reflect.get(target, key, receiver));
    },
    set(target, key, value, receiver) {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
            return (target[key].value = value);
        }
        else {
            return Reflect.set(target, key, value, receiver);
        }
    },
};
function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function isRef(value) {
    return !!value.__v_isRef;
}

class ComputedRefImpl {
    constructor(getter) {
        this._dirty = true;
        this.dep = createDep();
        this.effect = new ReactiveEffect(getter, () => {
            if (this._dirty)
                return;
            this._dirty = true;
            triggerRefValue(this);
        });
    }
    get value() {
        trackRefValue(this);
        if (this._dirty) {
            this._dirty = false;
            this._value = this.effect.run();
        }
        return this._value;
    }
}
function computed(getter) {
    return new ComputedRefImpl(getter);
}

function createComponentInstance(vnode, parent) {
    const instance = {
        type: vnode.type,
        vnode,
        next: null,
        props: {},
        parent,
        provides: parent ? parent.provides : {},
        proxy: null,
        isMounted: false,
        attrs: {},
        slots: {},
        ctx: {},
        setupState: {},
        emit: () => { },
    };
    instance.ctx = {
        _: instance,
    };
    instance.emit = emit.bind(null, instance);
    return instance;
}
function setupComponent(instance) {
    const { props, children } = instance.vnode;
    initProps(instance, props);
    initSlots(instance, children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    console.log("创建 proxy");
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        setCurrentInstance(instance);
        const setupContext = createSetupContext(instance);
        const setupResult = setup && setup(shallowReadonly(instance.props), setupContext);
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
    else {
        finishComponentSetup(instance);
    }
}
function createSetupContext(instance) {
    console.log("初始化 setup context");
    return {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: instance.emit,
        expose: () => { },
    };
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "function") {
        instance.render = setupResult;
    }
    else if (typeof setupResult === "object") {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (!instance.render) {
        if (compile && !Component.render) {
            if (Component.template) {
                const template = Component.template;
                Component.render = compile(template);
            }
        }
        instance.render = Component.render;
    }
}
let currentInstance = {};
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}
let compile;
function registerRuntimeCompiler(_compile) {
    compile = _compile;
}

function provide(key, value) {
    var _a;
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        if (parentProvides === provides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    var _a;
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const provides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        if (key in provides) {
            return provides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

function renderSlot(slots, name, props = {}) {
    const slot = slots[name];
    console.log(`渲染插槽 slot -> ${name}`);
    if (slot) {
        const slotContent = slot(props);
        return createVNode(Fragment, {}, slotContent);
    }
}

const queue = [];
const p = Promise.resolve();
let isFlushPending = false;
function nextTick(fn) {
    return fn ? p.then(fn) : p;
}
function queueJob(job) {
    if (!queue.includes(job)) {
        queue.push(job);
        queueFlush();
    }
}
function queueFlush() {
    if (isFlushPending)
        return;
    isFlushPending = true;
    nextTick(flushJobs);
}
function flushJobs() {
    isFlushPending = false;
    let job;
    while ((job = queue.shift())) {
        if (job) {
            job();
        }
    }
}

function shouldUpdateComponent(prevVNode, nextVNode) {
    const { props: prevProps } = prevVNode;
    const { props: nextProps } = nextVNode;
    if (prevProps === nextProps) {
        return false;
    }
    if (!prevProps) {
        return !!nextProps;
    }
    if (!nextProps) {
        return true;
    }
    return hasPropsChanged(prevProps, nextProps);
}
function hasPropsChanged(prevProps, nextProps) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
        return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
        const key = nextKeys[i];
        if (nextProps[key] !== prevProps[key]) {
            return true;
        }
    }
    return false;
}

function createRenderer(options) {
    const { createElement: hostCreateElement, setElementText: hostSetElementText, patchProp: hostPatchProp, insert: hostInsert, remove: hostRemove, setText: hostSetText, createText: hostCreateText, } = options;
    const render = (vnode, container) => {
        console.log("调用 path");
        patch(null, vnode, container);
    };
    function patch(n1, n2, container = null, anchor = null, parentComponent = null) {
        const { type, shapeFlag } = n2;
        switch (type) {
            case Text:
                processText(n1, n2, container);
                break;
            case Fragment:
                processFragment(n1, n2, container);
                break;
            default:
                if (shapeFlag & 1) {
                    console.log("处理 element");
                    processElement(n1, n2, container, anchor, parentComponent);
                }
                else if (shapeFlag & 4) {
                    console.log("处理 component");
                    processComponent(n1, n2, container, parentComponent);
                }
        }
    }
    function processFragment(n1, n2, container) {
        if (!n1) {
            console.log("初始化 Fragment 类型的节点");
            mountChildren(n2.children, container);
        }
    }
    function processText(n1, n2, container) {
        console.log("处理 Text 节点");
        if (n1 === null) {
            console.log("初始化 Text 类型的节点");
            hostInsert((n2.el = hostCreateText(n2.children)), container);
        }
        else {
            const el = (n2.el = n1.el);
            if (n2.children !== n1.children) {
                console.log("更新 Text 类型的节点");
                hostSetText(el, n2.children);
            }
        }
    }
    function processElement(n1, n2, container, anchor, parentComponent) {
        if (!n1) {
            mountElement(n2, container, anchor);
        }
        else {
            updateElement(n1, n2, container, anchor, parentComponent);
        }
    }
    function updateElement(n1, n2, container, anchor, parentComponent) {
        const oldProps = (n1 && n1.props) || {};
        const newProps = n2.props || {};
        console.log("应该更新 element");
        console.log("旧的 vnode", n1);
        console.log("新的 vnode", n2);
        const el = (n2.el = n1.el);
        patchProps(el, oldProps, newProps);
        patchChildren(n1, n2, el, anchor, parentComponent);
    }
    function patchProps(el, oldProps, newProps) {
        for (const key in newProps) {
            const prevProp = oldProps[key];
            const nextProp = newProps[key];
            if (prevProp !== nextProp) {
                hostPatchProp(el, key, prevProp, nextProp);
            }
        }
        for (const key in oldProps) {
            const prevProp = oldProps[key];
            const nextProp = null;
            if (!(key in newProps)) {
                hostPatchProp(el, key, prevProp, nextProp);
            }
        }
    }
    function patchChildren(n1, n2, container, anchor, parentComponent) {
        const { shapeFlag: prevShapeFlag, children: c1 } = n1;
        const { shapeFlag, children: c2 } = n2;
        if (shapeFlag & 8) {
            if (c2 !== c1) {
                console.log("类型为 text_children, 当前需要更新");
                hostSetElementText(container, c2);
            }
        }
        else {
            if (prevShapeFlag & 16) {
                if (shapeFlag & 16) {
                    patchKeyedChildren(c1, c2, container, anchor, parentComponent);
                }
            }
        }
    }
    function patchKeyedChildren(c1, c2, container, parentAnchor, parentComponent) {
        let i = 0;
        const l2 = c2.length;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;
        const isSameVNodeType = (n1, n2) => {
            return n1.type === n2.type && n1.key === n2.key;
        };
        while (i <= e1 && i <= e2) {
            const prevChild = c1[i];
            const nextChild = c2[i];
            if (!isSameVNodeType(prevChild, nextChild)) {
                console.log("两个 child 不相等(从左往右比对)");
                console.log(`prevChild:${prevChild}`);
                console.log(`nextChild:${nextChild}`);
                break;
            }
            console.log("两个 child 相等，接下来对比这两个 child 节点(从左往右比对)");
            patch(prevChild, nextChild, container, parentAnchor, parentComponent);
            i++;
        }
        while (i <= e1 && i <= e2) {
            const prevChild = c1[e1];
            const nextChild = c2[e2];
            if (!isSameVNodeType(prevChild, nextChild)) {
                console.log("两个 child 不相等(从右往左比对)");
                console.log(`prevChild:${prevChild}`);
                console.log(`nextChild:${nextChild}`);
                break;
            }
            console.log("两个 child 相等，接下来对比这两个 child 节点(从右往左比对)");
            patch(prevChild, nextChild, container, parentAnchor, parentComponent);
            e1--;
            e2--;
        }
        if (i > e1 && i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
            while (i <= e2) {
                console.log(`需要新创建一个 vnode: ${c2[i].key}`);
                patch(null, c2[i], container, anchor, parentComponent);
                i++;
            }
        }
        else if (i > e2 && i <= e1) {
            while (i <= e1) {
                console.log(`需要删除当前的 vnode: ${c1[i].key}`);
                hostRemove(c1[i].el);
                i++;
            }
        }
        else {
            let s1 = i;
            let s2 = i;
            const keyToNewIndexMap = new Map();
            let moved = false;
            let maxNewIndexSoFar = 0;
            for (let i = s2; i <= e2; i++) {
                const nextChild = c2[i];
                keyToNewIndexMap.set(nextChild.key, i);
            }
            const toBePatched = e2 - s2 + 1;
            let patched = 0;
            const newIndexToOldIndexMap = new Array(toBePatched);
            for (let i = 0; i < toBePatched; i++)
                newIndexToOldIndexMap[i] = 0;
            for (i = s1; i <= e1; i++) {
                const prevChild = c1[i];
                if (patched >= toBePatched) {
                    hostRemove(prevChild.el);
                    continue;
                }
                let newIndex;
                if (prevChild.key != null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key);
                }
                else {
                    for (let j = s2; j <= e2; j++) {
                        if (isSameVNodeType(prevChild, c2[j])) {
                            newIndex = j;
                            break;
                        }
                    }
                }
                if (newIndex === undefined) {
                    hostRemove(prevChild.el);
                }
                else {
                    console.log("新老节点都存在");
                    newIndexToOldIndexMap[newIndex - s2] = i + 1;
                    if (newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex;
                    }
                    else {
                        moved = true;
                    }
                    patch(prevChild, c2[newIndex], container, null, parentComponent);
                    patched++;
                }
            }
            const increasingNewIndexSequence = moved
                ? getSequence(newIndexToOldIndexMap)
                : [];
            let j = increasingNewIndexSequence.length - 1;
            for (let i = toBePatched - 1; i >= 0; i--) {
                const nextIndex = s2 + i;
                const nextChild = c2[nextIndex];
                const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
                if (newIndexToOldIndexMap[i] === 0) {
                    patch(null, nextChild, container, anchor, parentComponent);
                }
                else if (moved) {
                    if (j < 0 || increasingNewIndexSequence[j] !== i) {
                        hostInsert(nextChild.el, container, anchor);
                    }
                    else {
                        j--;
                    }
                }
            }
        }
    }
    function mountElement(vnode, container, anchor) {
        const { shapeFlag, props } = vnode;
        const el = (vnode.el = hostCreateElement(vnode.type));
        if (shapeFlag & 8) {
            console.log(`处理文本:${vnode.children}`);
            hostSetElementText(el, vnode.children);
        }
        else if (shapeFlag & 16) {
            mountChildren(vnode.children, el);
        }
        if (props) {
            for (const key in props) {
                const nextVal = props[key];
                hostPatchProp(el, key, null, nextVal);
            }
        }
        console.log("vnodeHook  -> onVnodeBeforeMount");
        console.log("DirectiveHook  -> beforeMount");
        console.log("transition  -> beforeEnter");
        hostInsert(el, container, anchor);
        console.log("vnodeHook  -> onVnodeMounted");
        console.log("DirectiveHook  -> mounted");
        console.log("transition  -> enter");
    }
    function mountChildren(children, container) {
        children.forEach((VNodeChild) => {
            console.log("mountChildren:", VNodeChild);
            patch(null, VNodeChild, container);
        });
    }
    function processComponent(n1, n2, container, parentComponent) {
        if (!n1) {
            mountComponent(n2, container, parentComponent);
        }
        else {
            updateComponent(n1, n2);
        }
    }
    function updateComponent(n1, n2, container) {
        console.log("更新组件", n1, n2);
        const instance = (n2.component = n1.component);
        if (shouldUpdateComponent(n1, n2)) {
            console.log(`组件需要更新: ${instance}`);
            instance.next = n2;
            instance.update();
        }
        else {
            console.log(`组件不需要更新: ${instance}`);
            n2.component = n1.component;
            n2.el = n1.el;
            instance.vnode = n2;
        }
    }
    function mountComponent(initialVNode, container, parentComponent) {
        const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent));
        console.log(`创建组件实例:${instance.type.name}`);
        setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container);
    }
    function setupRenderEffect(instance, initialVNode, container) {
        function componentUpdateFn() {
            if (!instance.isMounted) {
                console.log(`${instance.type.name}:调用 render,获取 subTree`);
                const proxyToUse = instance.proxy;
                const subTree = (instance.subTree = normalizeVNode(instance.render.call(proxyToUse, proxyToUse)));
                console.log("subTree", subTree);
                console.log(`${instance.type.name}:触发 beforeMount hook`);
                console.log(`${instance.type.name}:触发 onVnodeBeforeMount hook`);
                patch(null, subTree, container, null, instance);
                initialVNode.el = subTree.el;
                console.log(`${instance.type.name}:触发 mounted hook`);
                instance.isMounted = true;
            }
            else {
                console.log(`${instance.type.name}:调用更新逻辑`);
                const { next, vnode } = instance;
                if (next) {
                    next.el = vnode.el;
                    updateComponentPreRender(instance, next);
                }
                const proxyToUse = instance.proxy;
                const nextTree = normalizeVNode(instance.render.call(proxyToUse, proxyToUse));
                const prevTree = instance.subTree;
                instance.subTree = nextTree;
                console.log(`${instance.type.name}:触发 beforeUpdated hook`);
                console.log(`${instance.type.name}:触发 onVnodeBeforeUpdate hook`);
                patch(prevTree, nextTree, prevTree.el, null, instance);
                console.log(`${instance.type.name}:触发 updated hook`);
                console.log(`${instance.type.name}:触发 onVnodeUpdated hook`);
            }
        }
        instance.update = effect(componentUpdateFn, {
            scheduler: () => {
                queueJob(instance.update);
            },
        });
    }
    function updateComponentPreRender(instance, nextVNode) {
        nextVNode.component = instance;
        instance.vnode = nextVNode;
        instance.next = null;
        const { props } = nextVNode;
        console.log("更新组件的 props", props);
        instance.props = props;
        console.log("更新组件的 slots");
    }
    return {
        createApp: createAppAPI(render),
    };
}
function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}

function createElement(type) {
    console.log("CreateElement", type);
    const element = document.createElement(type);
    return element;
}
function createText(text) {
    return document.createTextNode(text);
}
function setText(node, text) {
    node.nodeValue = text;
}
function setElementText(el, text) {
    console.log("SetElementText", el, text);
    el.textContent = text;
}
function patchProp(el, key, preValue, nextValue) {
    console.log(`PatchProp 设置属性:${key} 值:${nextValue}`);
    console.log(`key: ${key} 之前的值是:${preValue}`);
    if (isOn(key)) {
        const invokers = el._vei || (el._vei = {});
        const existingInvoker = invokers[key];
        if (nextValue && existingInvoker) {
            existingInvoker.value = nextValue;
        }
        else {
            const eventName = key.slice(2).toLowerCase();
            if (nextValue) {
                const invoker = (invokers[key] = nextValue);
                el.addEventListener(eventName, invoker);
            }
            else {
                el.removeEventListener(eventName, existingInvoker);
                invokers[key] = undefined;
            }
        }
    }
    else {
        if (nextValue === null || nextValue === "") {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, nextValue);
        }
    }
}
function insert(child, parent, anchor = null) {
    console.log("Insert");
    parent.insertBefore(child, anchor);
}
function remove(child) {
    const parent = child.parentNode;
    if (parent) {
        parent.removeChild(child);
    }
}
let renderer;
function ensureRenderer() {
    return (renderer ||
        (renderer = createRenderer({
            createElement,
            createText,
            setText,
            setElementText,
            patchProp,
            insert,
            remove,
        })));
}
const createApp = (...args) => {
    return ensureRenderer().createApp(...args);
};

var runtimeDom = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createApp: createApp,
    getCurrentInstance: getCurrentInstance,
    registerRuntimeCompiler: registerRuntimeCompiler,
    inject: inject,
    provide: provide,
    renderSlot: renderSlot,
    createTextVNode: createTextVNode,
    createElementVNode: createVNode,
    createRenderer: createRenderer,
    toDisplayString: toDisplayString,
    reactive: reactive,
    ref: ref,
    readonly: readonly,
    unRef: unRef,
    proxyRefs: proxyRefs,
    isReadonly: isReadonly,
    isReactive: isReactive,
    isProxy: isProxy,
    isRef: isRef,
    shallowReadonly: shallowReadonly,
    effect: effect,
    stop: stop,
    computed: computed,
    h: h,
    createAppAPI: createAppAPI
});

const TO_DISPLAY_STRING = Symbol(`toDisplayString`);
const CREATE_ELEMENT_VNODE = Symbol("createElementVNode");
const helperNameMap = {
    [TO_DISPLAY_STRING]: "toDisplayString",
    [CREATE_ELEMENT_VNODE]: "createElementVNode"
};

function generate(ast, options = {}) {
    const context = createCodegenContext(ast, options);
    const { push, mode } = context;
    if (mode === "module") {
        genModulePreamble(ast, context);
    }
    else {
        genFunctionPreamble(ast, context);
    }
    const functionName = "render";
    const args = ["_ctx"];
    const signature = args.join(", ");
    push(`function ${functionName}(${signature}) {`);
    push("return ");
    genNode(ast.codegenNode, context);
    push("}");
    return {
        code: context.code,
    };
}
function genFunctionPreamble(ast, context) {
    const { runtimeGlobalName, push, newline } = context;
    const VueBinging = runtimeGlobalName;
    const aliasHelper = (s) => `${helperNameMap[s]} : _${helperNameMap[s]}`;
    if (ast.helpers.length > 0) {
        push(`
        const { ${ast.helpers.map(aliasHelper).join(", ")}} = ${VueBinging} 

      `);
    }
    newline();
    push(`return `);
}
function genNode(node, context) {
    switch (node.type) {
        case 2:
            genInterpolation(node, context);
            break;
        case 3:
            genExpression(node, context);
            break;
        case 4:
            genElement(node, context);
            break;
        case 5:
            genCompoundExpression(node, context);
            break;
        case 0:
            genText(node, context);
            break;
    }
}
function genCompoundExpression(node, context) {
    const { push } = context;
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (isString(child)) {
            push(child);
        }
        else {
            genNode(child, context);
        }
    }
}
function genText(node, context) {
    const { push } = context;
    push(`'${node.content}'`);
}
function genElement(node, context) {
    const { push, helper } = context;
    const { tag, props, children } = node;
    push(`${helper(CREATE_ELEMENT_VNODE)}(`);
    genNodeList(genNullableArgs([tag, props, children]), context);
    push(`)`);
}
function genNodeList(nodes, context) {
    const { push } = context;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (isString(node)) {
            push(`${node}`);
        }
        else {
            genNode(node, context);
        }
        if (i < nodes.length - 1) {
            push(", ");
        }
    }
}
function genNullableArgs(args) {
    let i = args.length;
    while (i--) {
        if (args[i] != null)
            break;
    }
    return args.slice(0, i + 1).map((arg) => arg || "null");
}
function genExpression(node, context) {
    context.push(node.content, node);
}
function genInterpolation(node, context) {
    const { push, helper } = context;
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(")");
}
function genModulePreamble(ast, context) {
    const { push, newline, runtimeModuleName } = context;
    if (ast.helpers.length) {
        const code = `import {${ast.helpers
            .map((s) => `${helperNameMap[s]} as _${helperNameMap[s]}`)
            .join(", ")} } from ${JSON.stringify(runtimeModuleName)}`;
        push(code);
    }
    newline();
    push(`export `);
}
function createCodegenContext(ast, { runtimeModuleName = "vue", runtimeGlobalName = "Vue", mode = "function" }) {
    const context = {
        code: "",
        mode,
        runtimeModuleName,
        runtimeGlobalName,
        helper(key) {
            return `_${helperNameMap[key]}`;
        },
        push(code) {
            context.code += code;
        },
        newline() {
            context.code += "\n";
        },
    };
    return context;
}

var TagType;
(function (TagType) {
    TagType[TagType["Start"] = 0] = "Start";
    TagType[TagType["End"] = 1] = "End";
})(TagType || (TagType = {}));
function baseParse(content) {
    const context = createParserContext(content);
    return createRoot(parseChildren(context, []));
}
function createParserContext(content) {
    console.log("创建 paserContext");
    return {
        source: content,
    };
}
function parseChildren(context, ancestors) {
    console.log("开始解析 children");
    const nodes = [];
    while (!isEnd(context, ancestors)) {
        let node;
        const s = context.source;
        if (startsWith(s, "{{")) {
            node = parseInterpolation(context);
        }
        else if (s[0] === "<") {
            if (s[1] === "/") {
                if (/[a-z]/i.test(s[2])) {
                    parseTag(context, 1);
                    continue;
                }
            }
            else if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors);
            }
        }
        if (!node) {
            node = parseText(context);
        }
        nodes.push(node);
    }
    return nodes;
}
function isEnd(context, ancestors) {
    const s = context.source;
    if (context.source.startsWith("</")) {
        for (let i = ancestors.length - 1; i >= 0; --i) {
            if (startsWithEndTagOpen(s, ancestors[i].tag)) {
                return true;
            }
        }
    }
    return !context.source;
}
function parseElement(context, ancestors) {
    const element = parseTag(context, 0);
    ancestors.push(element);
    const children = parseChildren(context, ancestors);
    ancestors.pop();
    if (startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, 1);
    }
    else {
        throw new Error(`缺失结束标签：${element.tag}`);
    }
    element.children = children;
    return element;
}
function startsWithEndTagOpen(source, tag) {
    return (startsWith(source, "</") &&
        source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase());
}
function parseTag(context, type) {
    const match = /^<\/?([a-z][^\r\n\t\f />]*)/i.exec(context.source);
    const tag = match[1];
    advanceBy(context, match[0].length);
    advanceBy(context, 1);
    if (type === 1)
        return;
    let tagType = 0;
    return {
        type: 4,
        tag,
        tagType,
    };
}
function parseInterpolation(context) {
    const openDelimiter = "{{";
    const closeDelimiter = "}}";
    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);
    advanceBy(context, 2);
    const rawContentLength = closeIndex - openDelimiter.length;
    const rawContent = context.source.slice(0, rawContentLength);
    const preTrimContent = parseTextData(context, rawContent.length);
    const content = preTrimContent.trim();
    advanceBy(context, closeDelimiter.length);
    return {
        type: 2,
        content: {
            type: 3,
            content,
        },
    };
}
function parseText(context) {
    console.log("解析 text", context);
    const endTokens = ["<", "{{"];
    let endIndex = context.source.length;
    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i]);
        if (index !== -1 && endIndex > index) {
            endIndex = index;
        }
    }
    const content = parseTextData(context, endIndex);
    return {
        type: 0,
        content,
    };
}
function parseTextData(context, length) {
    console.log("解析 textData");
    const rawText = context.source.slice(0, length);
    advanceBy(context, length);
    return rawText;
}
function advanceBy(context, numberOfCharacters) {
    console.log("推进代码", context, numberOfCharacters);
    context.source = context.source.slice(numberOfCharacters);
}
function createRoot(children) {
    return {
        type: 1,
        children,
        helpers: [],
    };
}
function startsWith(source, searchString) {
    return source.startsWith(searchString);
}

function transform(root, options = {}) {
    const context = createTransformContext(root, options);
    traverseNode(root, context);
    createRootCodegen(root);
    root.helpers.push(...context.helpers.keys());
}
function traverseNode(node, context) {
    const type = node.type;
    const nodeTransforms = context.nodeTransforms;
    const exitFns = [];
    for (let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i];
        const onExit = transform(node, context);
        if (onExit) {
            exitFns.push(onExit);
        }
    }
    switch (type) {
        case 2:
            context.helper(TO_DISPLAY_STRING);
            break;
        case 1:
        case 4:
            traverseChildren(node, context);
            break;
    }
    let i = exitFns.length;
    while (i--) {
        exitFns[i]();
    }
}
function traverseChildren(parent, context) {
    parent.children.forEach((node) => {
        traverseNode(node, context);
    });
}
function createTransformContext(root, options) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(name) {
            const count = context.helpers.get(name) || 0;
            context.helpers.set(name, count + 1);
        },
    };
    return context;
}
function createRootCodegen(root, context) {
    const { children } = root;
    const child = children[0];
    if (child.type === 4 && child.codegenNode) {
        const codegenNode = child.codegenNode;
        root.codegenNode = codegenNode;
    }
    else {
        root.codegenNode = child;
    }
}

function transformExpression(node) {
    if (node.type === 2) {
        node.content = processExpression(node.content);
    }
}
function processExpression(node) {
    node.content = `_ctx.${node.content}`;
    return node;
}

var NodeTypes;
(function (NodeTypes) {
    NodeTypes[NodeTypes["TEXT"] = 0] = "TEXT";
    NodeTypes[NodeTypes["ROOT"] = 1] = "ROOT";
    NodeTypes[NodeTypes["INTERPOLATION"] = 2] = "INTERPOLATION";
    NodeTypes[NodeTypes["SIMPLE_EXPRESSION"] = 3] = "SIMPLE_EXPRESSION";
    NodeTypes[NodeTypes["ELEMENT"] = 4] = "ELEMENT";
    NodeTypes[NodeTypes["COMPOUND_EXPRESSION"] = 5] = "COMPOUND_EXPRESSION";
})(NodeTypes || (NodeTypes = {}));
var ElementTypes;
(function (ElementTypes) {
    ElementTypes[ElementTypes["ELEMENT"] = 0] = "ELEMENT";
})(ElementTypes || (ElementTypes = {}));
function createVNodeCall(context, tag, props, children) {
    if (context) {
        context.helper(CREATE_ELEMENT_VNODE);
    }
    return {
        type: 4,
        tag,
        props,
        children,
    };
}

function transformElement(node, context) {
    if (node.type === 4) {
        return () => {
            const vnodeTag = `'${node.tag}'`;
            const vnodeProps = null;
            let vnodeChildren = null;
            if (node.children.length > 0) {
                if (node.children.length === 1) {
                    const child = node.children[0];
                    vnodeChildren = child;
                }
            }
            node.codegenNode = createVNodeCall(context, vnodeTag, vnodeProps, vnodeChildren);
        };
    }
}

function isText(node) {
    return node.type === 2 || node.type === 0;
}

function transformText(node, context) {
    if (node.type === 4) {
        return () => {
            const children = node.children;
            let currentContainer;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (isText(child)) {
                    for (let j = i + 1; j < children.length; j++) {
                        const next = children[j];
                        if (isText(next)) {
                            if (!currentContainer) {
                                currentContainer = children[i] = {
                                    type: 5,
                                    loc: child.loc,
                                    children: [child],
                                };
                            }
                            currentContainer.children.push(` + `, next);
                            children.splice(j, 1);
                            j--;
                        }
                        else {
                            currentContainer = undefined;
                            break;
                        }
                    }
                }
            }
        };
    }
}

function baseCompile(template, options) {
    const ast = baseParse(template);
    transform(ast, Object.assign(options, {
        nodeTransforms: [transformElement, transformText, transformExpression],
    }));
    return generate(ast);
}

function compileToFunction(template, options = {}) {
    const { code } = baseCompile(template, options);
    const render = new Function("Vue", code)(runtimeDom);
    return render;
}
registerRuntimeCompiler(compileToFunction);

export { computed, createApp, createAppAPI, createVNode as createElementVNode, createRenderer, createTextVNode, effect, getCurrentInstance, h, inject, isProxy, isReactive, isReadonly, isRef, provide, proxyRefs, reactive, readonly, ref, registerRuntimeCompiler, renderSlot, shallowReadonly, stop, toDisplayString, unRef };
//# sourceMappingURL=mini-vue.esm-bundler.js.map
