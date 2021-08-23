var c2eMap = {
    你好: "hello",
    "调用 patch": "call patch function",
};
var e2cMap = {
    hello: "你好",
};
var LanguageTranslator = (function () {
    function LanguageTranslator() {
        this.currentLanguage = "cn";
    }
    Object.defineProperty(LanguageTranslator.prototype, "currentMap", {
        get: function () {
            return this.currentLanguage === "cn" ? e2cMap : c2eMap;
        },
        enumerable: false,
        configurable: true
    });
    LanguageTranslator.prototype.transition = function (text) {
        var result = this.currentMap[text];
        return result ? result : text;
    };
    return LanguageTranslator;
}());

var Debug = (function () {
    function Debug(languageTranslator) {
        this.languageTranslator = languageTranslator;
    }
    Debug.prototype.mainPath = function (text) {
        return window.console.log.bind(window.console, "%c[ mainPath ] " + this.languageTranslator.transition(text), "color:red");
    };
    return Debug;
}());

var debug$1 = new Debug(new LanguageTranslator());
window.debug = debug$1;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function createDep(effects) {
    var dep = new Set(effects);
    return dep;
}

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

var isObject = function (val) {
    return val !== null && typeof val === "object";
};
var camelizeRE = /-(\w)/g;
var camelize = function (str) {
    return str.replace(camelizeRE, function (_, c) { return (c ? c.toUpperCase() : ""); });
};
var extend = Object.assign;
function hasChanged(value, oldValue) {
    return !Object.is(value, oldValue);
}
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var toHandlerKey = function (str) {
    return str ? "on" + capitalize(str) : "";
};

var activeEffect = void 0;
var targetMap = new WeakMap();
var ReactiveEffect = (function () {
    function ReactiveEffect(fn, scheduler) {
        this.fn = fn;
        this.scheduler = scheduler;
        this.active = true;
        this.deps = [];
        console.log("创建 ReactiveEffect 对象");
    }
    ReactiveEffect.prototype.run = function () {
        activeEffect = this;
        console.log("执行用户传入的 fn");
        return this.fn();
    };
    ReactiveEffect.prototype.stop = function () {
        if (this.active) {
            cleanupEffect(this);
            this.active = false;
        }
    };
    return ReactiveEffect;
}());
function cleanupEffect(effect) {
    effect.deps.forEach(function (dep) {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
function effect(fn, options) {
    if (options === void 0) { options = {}; }
    var _effect = new ReactiveEffect(fn);
    extend(_effect, options);
    _effect.run();
    var runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
function stop(runner) {
    runner.effect.stop();
}
function track(target, type, key) {
    console.log("\u89E6\u53D1 track -> target: " + target + " type:" + type + " key:" + key);
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    var dep = depsMap.get(key);
    if (!dep) {
        dep = createDep();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
function trackEffects(dep) {
    if (!activeEffect)
        return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
function trigger(target, type, key) {
    var deps = [];
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    deps.push(dep);
    var effects = [];
    deps.forEach(function (dep) {
        effects.push.apply(effects, __spread(dep));
    });
    triggerEffects(createDep(effects));
}
function isTracking() {
    return activeEffect !== undefined;
}
function triggerEffects(dep) {
    var e_1, _a;
    try {
        for (var dep_1 = __values(dep), dep_1_1 = dep_1.next(); !dep_1_1.done; dep_1_1 = dep_1.next()) {
            var effect_1 = dep_1_1.value;
            if (effect_1.scheduler) {
                effect_1.scheduler();
            }
            else {
                effect_1.run();
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dep_1_1 && !dep_1_1.done && (_a = dep_1.return)) _a.call(dep_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}

var get = createGetter();
var set = createSetter();
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key, receiver) {
        var isExistInReactiveMap = function () {
            return key === ReactiveFlags.RAW && receiver === reactiveMap.get(target);
        };
        var isExistInReadonlyMap = function () {
            return key === ReactiveFlags.RAW && receiver === readonlyMap.get(target);
        };
        var isExistInShallowReadonlyMap = function () {
            return key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target);
        };
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        else if (isExistInReactiveMap() ||
            isExistInReadonlyMap() ||
            isExistInShallowReadonlyMap()) {
            return target;
        }
        var res = Reflect.get(target, key, receiver);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        if (!isReadonly) {
            track(target, "get", key);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value, receiver) {
        var result = Reflect.set(target, key, value, receiver);
        trigger(target, "get", key);
        return result;
    };
}
var readonlyHandlers = {
    get: createGetter(true),
    set: function (target, key) {
        console.warn("Set operation on key \"" + String(key) + "\" failed: target is readonly.", target);
        return true;
    },
};
var mutableHandlers = {
    get: get,
    set: set,
};
var shallowReadonlyHandlers = {
    get: createGetter(true, true),
    set: function (target, key) {
        console.warn("Set operation on key \"" + String(key) + "\" failed: target is readonly.", target);
        return true;
    },
};

var reactiveMap = new WeakMap();
var readonlyMap = new WeakMap();
var shallowReadonlyMap = new WeakMap();
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
    return !!value[ReactiveFlags.IS_READONLY];
}
function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}
function createReactiveObject(target, proxyMap, baseHandlers) {
    var existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    var proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}

var RefImpl = (function () {
    function RefImpl(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        this._value = convert(value);
        this.dep = createDep();
    }
    Object.defineProperty(RefImpl.prototype, "value", {
        get: function () {
            trackRefValue(this);
            return this._value;
        },
        set: function (newValue) {
            if (hasChanged(newValue, this._rawValue)) {
                this._value = convert(newValue);
                this._rawValue = newValue;
                triggerRefValue(this);
            }
        },
        enumerable: false,
        configurable: true
    });
    return RefImpl;
}());
function ref(value) {
    return createRef(value);
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function createRef(value) {
    var refImpl = new RefImpl(value);
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
var shallowUnwrapHandlers = {
    get: function (target, key, receiver) {
        return unRef(Reflect.get(target, key, receiver));
    },
    set: function (target, key, value, receiver) {
        var oldValue = target[key];
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
    return value.__v_isRef;
}

var ComputedRefImpl = (function () {
    function ComputedRefImpl(getter) {
        var _this = this;
        this._dirty = true;
        this.dep = createDep();
        this.effect = new ReactiveEffect(getter, function () {
            if (_this._dirty)
                return;
            _this._dirty = true;
            triggerRefValue(_this);
        });
    }
    Object.defineProperty(ComputedRefImpl.prototype, "value", {
        get: function () {
            trackRefValue(this);
            if (this._dirty) {
                this._dirty = false;
                this._value = this.effect.run();
            }
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    return ComputedRefImpl;
}());
function computed(getter) {
    return new ComputedRefImpl(getter);
}

var createVNode = function (type, props, children) {
    if (props === void 0) { props = {}; }
    var vnode = {
        el: null,
        component: null,
        key: props.key || null,
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
    };
    if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    else if (typeof children === "string") {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
    normalizeChildren(vnode, children);
    return vnode;
};
function normalizeChildren(vnode, children) {
    if (typeof children === "object") {
        if (vnode.shapeFlag & ShapeFlags.ELEMENT) ;
        else {
            vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
        }
    }
}
var Text = Symbol("Text");
function createTextVNode(text) {
    if (text === void 0) { text = " "; }
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
}

var h = function (type, props, children) {
    return createVNode(type, props, children);
};

function initProps(instance, rawProps) {
    console.log("initProps");
    instance.props = rawProps;
}

function initSlots(instance, children) {
    var vnode = instance.vnode;
    console.log("初始化 slots");
    if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
        normalizeObjectSlots(children, (instance.slots = {}));
    }
}
var normalizeObjectSlots = function (rawSlots, slots) {
    for (var key in rawSlots) {
        var value = rawSlots[key];
        if (typeof value === "function") {
            slots[key] = value;
        }
    }
};

function emit(instance, event) {
    var rawArgs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        rawArgs[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    var handlerName = toHandlerKey(camelize(event));
    var handler = props[handlerName];
    if (handler) {
        handler.apply(void 0, __spread(rawArgs));
    }
}

var publicPropertiesMap = {
    $emit: function (i) { return i.emit; },
    $slots: function (i) { return i.slots; },
    $props: function (i) { return i.props; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        console.log("\u89E6\u53D1 proxy hook , key -> : " + key);
        if (key !== "$") {
            if (key in setupState) {
                return setupState[key];
            }
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function createComponentInstance(vnode, parent) {
    var instance = {
        type: vnode.type,
        vnode: vnode,
        next: null,
        props: {},
        parent: parent,
        provides: parent ? parent.provides : {},
        proxy: null,
        isMounted: false,
        attrs: {},
        slots: {},
        ctx: {},
        setupState: {},
        emit: function () { },
    };
    instance.ctx = {
        _: instance,
    };
    instance.emit = emit.bind(null, instance);
    return instance;
}
function setupComponent(instance) {
    var _a = instance.vnode, props = _a.props, children = _a.children;
    initProps(instance, props);
    initSlots(instance, children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    console.log("创建 proxy");
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        setCurrentInstance(instance);
        var setupContext = createSetupContext(instance);
        var setupResult = setup && setup(shallowReadonly(instance.props), setupContext);
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function createSetupContext(instance) {
    console.log("初始化 setup context");
    return {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: instance.emit,
        expose: function () { },
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
    var Component = instance.type;
    if (!instance.render) {
        instance.render = Component.render;
    }
}
var currentInstance = {};
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

function hostCreateElement(type) {
    console.log("hostCreateElement", type);
    var element = document.createElement(type);
    return element;
}
function hostCreateText(text) {
    return document.createTextNode(text);
}
function hostSetText(node, text) {
    node.nodeValue = text;
}
function hostSetElementText(el, text) {
    console.log("hostSetElementText", el, text);
    el.innerText = text;
}
function hostPatchProp(el, key, preValue, nextValue) {
    console.log("hostPatchProp \u8BBE\u7F6E\u5C5E\u6027:" + key + " \u503C:" + nextValue);
    console.log("key: " + key + " \u4E4B\u524D\u7684\u503C\u662F:" + preValue);
    switch (key) {
        case "id":
        case "tId":
            if (nextValue === null || nextValue === undefined) {
                el.removeAttribute(key);
            }
            else {
                el.setAttribute(key, nextValue);
            }
            break;
        case "onClick":
            if (preValue) {
                el.removeEventListener("click", preValue);
            }
            el.addEventListener("click", nextValue);
            break;
    }
}
function hostInsert(child, parent, anchor) {
    if (anchor === void 0) { anchor = null; }
    console.log("hostInsert");
    if (anchor) {
        parent.insertBefore(child, anchor);
    }
    else {
        parent.appendChild(child);
    }
}
function hostRemove(child) {
    var parent = child.parentNode;
    if (parent) {
        parent.removeChild(child);
    }
}

var queue = [];
var p = Promise.resolve();
var isFlushPending = false;
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
    var job;
    while ((job = queue.shift())) {
        if (job) {
            job();
        }
    }
}

function shouldUpdateComponent(prevVNode, nextVNode) {
    var prevProps = prevVNode.props;
    var nextProps = nextVNode.props;
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
    var nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
        return true;
    }
    for (var i = 0; i < nextKeys.length; i++) {
        var key = nextKeys[i];
        if (nextProps[key] !== prevProps[key]) {
            return true;
        }
    }
    return false;
}

var render = function (vnode, container) {
    debug.mainPath("调用 patch")();
    patch(null, vnode, container);
};
function patch(n1, n2, container, parentComponent) {
    if (container === void 0) { container = null; }
    if (parentComponent === void 0) { parentComponent = null; }
    var type = n2.type, shapeFlag = n2.shapeFlag;
    switch (type) {
        case Text:
            processText(n1, n2, container);
            break;
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                console.log("处理 element");
                processElement(n1, n2, container);
            }
            else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                console.log("处理 component");
                processComponent(n1, n2, container, parentComponent);
            }
    }
}
function processText(n1, n2, container) {
    console.log("处理 Text 节点");
    if (n1 === null) {
        console.log("初始化 Text 类型的节点");
        hostInsert((n2.el = hostCreateText(n2.children)), container);
    }
    else {
        var el = (n2.el = n1.el);
        if (n2.children !== n1.children) {
            console.log("更新 Text 类型的节点");
            hostSetText(el, n2.children);
        }
    }
}
function processElement(n1, n2, container) {
    if (!n1) {
        mountElement(n2, container);
    }
    else {
        updateElement(n1, n2);
    }
}
function updateElement(n1, n2, container) {
    var oldProps = (n1 && n1.props) || {};
    var newProps = n2.props || {};
    console.log("应该更新 element");
    console.log("旧的 vnode", n1);
    console.log("新的 vnode", n2);
    var el = (n2.el = n1.el);
    patchProps(el, oldProps, newProps);
    patchChildren(n1, n2, el);
}
function patchProps(el, oldProps, newProps) {
    for (var key in newProps) {
        var prevProp = oldProps[key];
        var nextProp = newProps[key];
        if (prevProp !== nextProp) {
            hostPatchProp(el, key, prevProp, nextProp);
        }
    }
    for (var key in oldProps) {
        var prevProp = oldProps[key];
        var nextProp = null;
        if (!(key in newProps)) {
            hostPatchProp(el, key, prevProp, nextProp);
        }
    }
}
function patchChildren(n1, n2, container) {
    var prevShapeFlag = n1.shapeFlag, c1 = n1.children;
    var shapeFlag = n2.shapeFlag, c2 = n2.children;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        if (c2 !== c1) {
            console.log("类型为 text_children, 当前需要更新");
            hostSetElementText(container, c2);
        }
    }
    else {
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                patchKeyedChildren(c1, c2, container);
            }
        }
    }
}
function patchKeyedChildren(c1, c2, container) {
    var i = 0;
    var e1 = c1.length - 1;
    var e2 = c2.length - 1;
    var isSameVNodeType = function (n1, n2) {
        return n1.type === n2.type && n1.key === n2.key;
    };
    while (i <= e1 && i <= e2) {
        var prevChild = c1[i];
        var nextChild = c2[i];
        if (!isSameVNodeType(prevChild, nextChild)) {
            console.log("两个 child 不相等(从左往右比对)");
            console.log("prevChild:" + prevChild);
            console.log("nextChild:" + nextChild);
            break;
        }
        console.log("两个 child 相等，接下来对比着两个 child 节点(从左往右比对)");
        patch(prevChild, nextChild, container);
        i++;
    }
    while (i <= e1 && i <= e2) {
        var prevChild = c1[e1];
        var nextChild = c2[e2];
        if (!isSameVNodeType(prevChild, nextChild)) {
            console.log("两个 child 不相等(从右往左比对)");
            console.log("prevChild:" + prevChild);
            console.log("nextChild:" + nextChild);
            break;
        }
        console.log("两个 child 相等，接下来对比着两个 child 节点(从右往左比对)");
        patch(prevChild, nextChild, container);
        e1--;
        e2--;
    }
    if (i > e1 && i <= e2) {
        while (i <= e2) {
            console.log("\u9700\u8981\u65B0\u521B\u5EFA\u4E00\u4E2A vnode: " + c2[i].key);
            patch(null, c2[i], container);
            i++;
        }
    }
    else if (i > e2 && i <= e1) {
        while (i <= e1) {
            console.log("\u9700\u8981\u5220\u9664\u5F53\u524D\u7684 vnode: " + c1[i].key);
            hostRemove(c1[i].el);
            i++;
        }
    }
    else {
        var s1 = i;
        var s2 = i;
        var keyToNewIndexMap = new Map();
        for (var i_1 = s2; i_1 <= e2; i_1++) {
            var nextChild = c2[i_1];
            keyToNewIndexMap.set(nextChild.key, i_1);
        }
        var toBePatched = e2 - s2 + 1;
        var newIndexToOldIndexMap = new Array(toBePatched);
        for (var index = 0; index < newIndexToOldIndexMap.length; index++) {
            newIndexToOldIndexMap[index] = -1;
        }
        for (i = s1; i <= e1; i++) {
            var prevChild = c1[i];
            var newIndex = keyToNewIndexMap.get(prevChild.key);
            newIndexToOldIndexMap[newIndex] = i;
            if (newIndex === undefined) {
                hostRemove(prevChild.el);
            }
            else {
                console.log("新老节点都存在");
                patch(prevChild, c2[newIndex], container);
            }
        }
        for (i = e2; i >= s2; i--) {
            var nextChild = c2[i];
            if (newIndexToOldIndexMap[i] === -1) {
                patch(null, c2[i], container);
            }
            else {
                var anchor = i + 1 >= e2 + 1 ? null : c2[i + 1];
                hostInsert(nextChild.el, container, anchor && anchor.el);
            }
        }
    }
}
function mountElement(vnode, container) {
    var shapeFlag = vnode.shapeFlag, props = vnode.props;
    var el = (vnode.el = hostCreateElement(vnode.type));
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        console.log("\u5904\u7406\u6587\u672C:" + vnode.children);
        hostSetElementText(el, vnode.children);
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode.children, el);
    }
    if (props) {
        for (var key in props) {
            var nextVal = props[key];
            hostPatchProp(el, key, null, nextVal);
        }
    }
    console.log("vnodeHook  -> onVnodeBeforeMount");
    console.log("DirectiveHook  -> beforeMount");
    console.log("transition  -> beforeEnter");
    hostInsert(el, container);
    console.log("vnodeHook  -> onVnodeMounted");
    console.log("DirectiveHook  -> mounted");
    console.log("transition  -> enter");
}
function mountChildren(children, container) {
    children.forEach(function (VNodeChild) {
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
    var instance = (n2.component = n1.component);
    if (shouldUpdateComponent(n1, n2)) {
        console.log("\u7EC4\u4EF6\u9700\u8981\u66F4\u65B0: " + instance);
        instance.next = n2;
        instance.update();
    }
    else {
        console.log("\u7EC4\u4EF6\u4E0D\u9700\u8981\u66F4\u65B0: " + instance);
        n2.component = n1.component;
        n2.el = n1.el;
        instance.vnode = n2;
    }
}
function mountComponent(initialVNode, container, parentComponent) {
    var instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent));
    console.log("\u521B\u5EFA\u7EC4\u4EF6\u5B9E\u4F8B:" + instance.type.name);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    function componentUpdateFn() {
        if (!instance.isMounted) {
            console.log("调用 render,获取 subTree");
            var proxyToUse_1 = instance.proxy;
            var subTree = (instance.subTree = instance.render.call(proxyToUse_1, proxyToUse_1));
            console.log("subTree", subTree);
            console.log(instance.type.name + ":\u89E6\u53D1 beforeMount hook");
            console.log(instance.type.name + ":\u89E6\u53D1 onVnodeBeforeMount hook");
            patch(null, subTree, container, instance);
            console.log(instance.type.name + ":\u89E6\u53D1 mounted hook");
            instance.isMounted = true;
        }
        console.log("调用更新逻辑");
        var next = instance.next, vnode = instance.vnode;
        if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next);
        }
        var proxyToUse = instance.proxy;
        var nextTree = instance.render.call(proxyToUse, proxyToUse);
        var prevTree = instance.subTree;
        instance.subTree = nextTree;
        console.log("beforeUpdated hook");
        console.log("onVnodeBeforeUpdate hook");
        patch(prevTree, nextTree, prevTree.el, instance);
        console.log("updated hook");
        console.log("onVnodeUpdated hook");
    }
    instance.update = effect(componentUpdateFn, {
        scheduler: function () {
            queueJob(instance.update);
        },
    });
}
function updateComponentPreRender(instance, nextVNode) {
    var props = nextVNode.props;
    console.log("更新组件的 props", props);
    instance.props = props;
    console.log("更新组件的 slots");
}

var createApp = function (rootComponent) {
    var app = {
        _component: rootComponent,
        mount: function (rootContainer) {
            console.log("基于根组件创建 vnode");
            var vnode = createVNode(rootComponent);
            console.log("调用 render，基于 vnode 进行开箱");
            render(vnode, rootContainer);
        },
    };
    return app;
};

function provide(key, value) {
    var _a;
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var provides = currentInstance.provides;
        var parentProvides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        if (parentProvides === provides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    var _a;
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var provides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
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

function renderSlot(slots, name, props) {
    if (props === void 0) { props = {}; }
    var slot = slots[name];
    console.log("\u6E32\u67D3\u63D2\u69FD slot -> " + name);
    if (slot) {
        return slot(props);
    }
}

export { computed, createApp, createTextVNode, effect, getCurrentInstance, h, inject, isProxy, isReactive, isReadonly, isRef, provide, proxyRefs, reactive, readonly, ref, renderSlot, shallowReadonly, stop, unRef };
//# sourceMappingURL=mini-vue.esm.js.map
