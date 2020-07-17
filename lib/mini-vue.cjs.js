'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}

const EMPTY_OBJ =  Object.freeze({})
    ;
const extend = Object.assign;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isSymbol = (val) => typeof val === 'symbol';
const isObject = (val) => val !== null && typeof val === 'object';
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
};
const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return ((str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
// compare whether a value has changed, accounting for NaN.
const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
        configurable: true,
        value
    });
};

const targetMap = new WeakMap();
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol( 'iterate' );
const MAP_KEY_ITERATE_KEY = Symbol( 'Map key iterate' );
function isEffect(fn) {
    return fn && fn._isEffect === true;
}
function effect(fn, options = EMPTY_OBJ) {
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
function stop(effect) {
    if (effect.active) {
        cleanup(effect);
        if (effect.options.onStop) {
            effect.options.onStop();
        }
        effect.active = false;
    }
}
let uid = 0;
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect(...args) {
        if (!effect.active) {
            return options.scheduler ? undefined : fn(...args);
        }
        if (!effectStack.includes(effect)) {
            cleanup(effect);
            try {
                enableTracking();
                effectStack.push(effect);
                activeEffect = effect;
                return fn(...args);
            }
            finally {
                effectStack.pop();
                resetTracking();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.id = uid++;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}
function cleanup(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}
function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
}
function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}
function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if ( activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target,
                type,
                key
            });
        }
    }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    const effects = new Set();
    const computedRunners = new Set();
    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                if (effect !== activeEffect || !shouldTrack) {
                    if (effect.options.computed) {
                        computedRunners.add(effect);
                    }
                    else {
                        effects.add(effect);
                    }
                }
            });
        }
    };
    if (type === "clear" /* CLEAR */) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add);
    }
    else if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                add(dep);
            }
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE | Map.SET
        const isAddOrDelete = type === "add" /* ADD */ ||
            (type === "delete" /* DELETE */ && !isArray(target));
        if (isAddOrDelete ||
            (type === "set" /* SET */ && target instanceof Map)) {
            add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY));
        }
        if (isAddOrDelete && target instanceof Map) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY));
        }
    }
    const run = (effect) => {
        if ( effect.options.onTrigger) {
            effect.options.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue,
                oldTarget
            });
        }
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        }
        else {
            effect();
        }
    };
    // Important: computed effects must be run first so that computed getters
    // can be invalidated before any normal effects that depend on them are run.
    computedRunners.forEach(run);
    effects.forEach(run);
}

const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
    .map(key => Symbol[key])
    .filter(isSymbol));
const get = /*#__PURE__*/ createGetter();
const shallowGet = /*#__PURE__*/ createGetter(false, true);
const readonlyGet = /*#__PURE__*/ createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);
const arrayInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
    arrayInstrumentations[key] = function (...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
            track(arr, "get" /* GET */, i + '');
        }
        // we run the method using the original args first (which may be reactive)
        const res = arr[key](...args);
        if (res === -1 || res === false) {
            // if that didn't work, run it again using raw values.
            return arr[key](...args.map(toRaw));
        }
        else {
            return res;
        }
    };
});
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === "__v_isReactive" /* isReactive */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* isReadonly */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* raw */ &&
            receiver ===
                (isReadonly
                    ? target.__v_readonly
                    : target.__v_reactive)) {
            return target;
        }
        const targetIsArray = isArray(target);
        if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if ((isSymbol(key) && builtInSymbols.has(key)) || key === '__proto__') {
            return res;
        }
        if (!isReadonly) {
            track(target, "get" /* GET */, key);
        }
        if (shallow) {
            return res;
        }
        if (isRef(res)) {
            // ref unwrapping, only for Objects, not for Arrays.
            return targetIsArray ? res : res.value;
        }
        if (isObject(res)) {
            // Convert returned value into a proxy as well. we do the isObject check
            // here to avoid invalid value warning. Also need to lazy access readonly
            // and reactive here to avoid circular dependency.
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
const set = /*#__PURE__*/ createSetter();
const shallowSet = /*#__PURE__*/ createSetter(true);
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        const oldValue = target[key];
        if (!shallow) {
            value = toRaw(value);
            if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
        }
        const hadKey = hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        // don't trigger if target is something up in the prototype chain of original
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, "add" /* ADD */, key, value);
            }
            else if (hasChanged(value, oldValue)) {
                trigger(target, "set" /* SET */, key, value, oldValue);
            }
        }
        return result;
    };
}
function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function has(target, key) {
    const result = Reflect.has(target, key);
    track(target, "has" /* HAS */, key);
    return result;
}
function ownKeys(target) {
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.ownKeys(target);
}
const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
};
const readonlyHandlers = {
    get: readonlyGet,
    has,
    ownKeys,
    set(target, key) {
        {
            console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
    },
    deleteProperty(target, key) {
        {
            console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
    }
};
const shallowReactiveHandlers = extend({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
});
// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, wrap) {
    target = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
        track(target, "get" /* GET */, key);
    }
    track(target, "get" /* GET */, rawKey);
    const { has, get } = getProto(target);
    if (has.call(target, key)) {
        return wrap(get.call(target, key));
    }
    else if (has.call(target, rawKey)) {
        return wrap(get.call(target, rawKey));
    }
}
function has$1(key) {
    const target = toRaw(this);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
        track(target, "has" /* HAS */, key);
    }
    track(target, "has" /* HAS */, rawKey);
    const has = getProto(target).has;
    return has.call(target, key) || has.call(target, rawKey);
}
function size(target) {
    target = toRaw(target);
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.get(getProto(target), 'size', target);
}
function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    const result = proto.add.call(target, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, value, value);
    }
    return result;
}
function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has, get, set } = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get.call(target, key);
    const result = set.call(target, key, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, key, value);
    }
    else if (hasChanged(value, oldValue)) {
        trigger(target, "set" /* SET */, key, value, oldValue);
    }
    return result;
}
function deleteEntry(key) {
    const target = toRaw(this);
    const { has, get, delete: del } = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get ? get.call(target, key) : undefined;
    // forward the operation before queueing reactions
    const result = del.call(target, key);
    if (hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget =  target instanceof Map
            ? new Map(target)
            : new Set(target)
        ;
    // forward the operation before queueing reactions
    const result = getProto(target).clear.call(target);
    if (hadItems) {
        trigger(target, "clear" /* CLEAR */, undefined, undefined, oldTarget);
    }
    return result;
}
function createForEach(isReadonly, shallow) {
    return function forEach(callback, thisArg) {
        const observed = this;
        const target = toRaw(observed);
        const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
        !isReadonly && track(target, "iterate" /* ITERATE */, ITERATE_KEY);
        // important: create sure the callback is
        // 1. invoked with the reactive map as `this` and 3rd arg
        // 2. the value received should be a corresponding reactive/readonly.
        function wrappedCallback(value, key) {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
        }
        return getProto(target).forEach.call(target, wrappedCallback);
    };
}
function createIterableMethod(method, isReadonly, shallow) {
    return function (...args) {
        const target = toRaw(this);
        const isMap = target instanceof Map;
        const isPair = method === 'entries' || (method === Symbol.iterator && isMap);
        const isKeyOnly = method === 'keys' && isMap;
        const innerIterator = getProto(target)[method].apply(target, args);
        const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
        !isReadonly &&
            track(target, "iterate" /* ITERATE */, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        // return a wrapped iterator which returns observed versions of the
        // values emitted from the real iterator
        return {
            // iterator protocol
            next() {
                const { value, done } = innerIterator.next();
                return done
                    ? { value, done }
                    : {
                        value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                        done
                    };
            },
            // iterable protocol
            [Symbol.iterator]() {
                return this;
            }
        };
    };
}
function createReadonlyMethod(type) {
    return function (...args) {
        {
            const key = args[0] ? `on key "${args[0]}" ` : ``;
            console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
        }
        return type === "delete" /* DELETE */ ? false : this;
    };
}
const mutableInstrumentations = {
    get(key) {
        return get$1(this, key, toReactive);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
};
const shallowInstrumentations = {
    get(key) {
        return get$1(this, key, toShallow);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
};
const readonlyInstrumentations = {
    get(key) {
        return get$1(this, key, toReadonly);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add: createReadonlyMethod("add" /* ADD */),
    set: createReadonlyMethod("set" /* SET */),
    delete: createReadonlyMethod("delete" /* DELETE */),
    clear: createReadonlyMethod("clear" /* CLEAR */),
    forEach: createForEach(true, false)
};
const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
iteratorMethods.forEach(method => {
    mutableInstrumentations[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true, false);
    shallowInstrumentations[method] = createIterableMethod(method, false, true);
});
function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = shallow
        ? shallowInstrumentations
        : isReadonly
            ? readonlyInstrumentations
            : mutableInstrumentations;
    return (target, key, receiver) => {
        if (key === "__v_isReactive" /* isReactive */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* isReadonly */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* raw */) {
            return target;
        }
        return Reflect.get(hasOwn(instrumentations, key) && key in target
            ? instrumentations
            : target, key, receiver);
    };
}
const mutableCollectionHandlers = {
    get: createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
};
function checkIdentityKeys(target, has, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
        const type = toRawType(target);
        console.warn(`Reactive ${type} contains both the raw and reactive ` +
            `versions of the same object${type === `Map` ? `as keys` : ``}, ` +
            `which can lead to inconsistencies. ` +
            `Avoid differentiating between the raw and reactive versions ` +
            `of an object and only use the reactive version if possible.`);
    }
}

const collectionTypes = new Set([Set, Map, WeakMap, WeakSet]);
const isObservableType = /*#__PURE__*/ makeMap('Object,Array,Map,Set,WeakMap,WeakSet');
const canObserve = (value) => {
    return (!value["__v_skip" /* skip */] &&
        isObservableType(toRawType(value)) &&
        !Object.isFrozen(value));
};
function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && target["__v_isReadonly" /* isReadonly */]) {
        return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
}
// Return a reactive-copy of the original object, where only the root level
// properties are reactive, and does NOT unwrap refs nor recursively convert
// returned properties.
function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers);
}
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers);
}
// Return a reactive-copy of the original object, where only the root level
// properties are readonly, and does NOT unwrap refs nor recursively convert
// returned properties.
// This is used for creating the props proxy object for stateful components.
function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, readonlyCollectionHandlers);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {
    if (!isObject(target)) {
        {
            console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
    }
    // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object
    if (target["__v_raw" /* raw */] &&
        !(isReadonly && target["__v_isReactive" /* isReactive */])) {
        return target;
    }
    // target already has corresponding Proxy
    if (hasOwn(target, isReadonly ? "__v_readonly" /* readonly */ : "__v_reactive" /* reactive */)) {
        return isReadonly
            ? target["__v_readonly" /* readonly */]
            : target["__v_reactive" /* reactive */];
    }
    // only a whitelist of value types can be observed.
    if (!canObserve(target)) {
        return target;
    }
    const observed = new Proxy(target, collectionTypes.has(target.constructor) ? collectionHandlers : baseHandlers);
    def(target, isReadonly ? "__v_readonly" /* readonly */ : "__v_reactive" /* reactive */, observed);
    return observed;
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value["__v_raw" /* raw */]);
    }
    return !!(value && value["__v_isReactive" /* isReactive */]);
}
function isReadonly(value) {
    return !!(value && value["__v_isReadonly" /* isReadonly */]);
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
    return ((observed && toRaw(observed["__v_raw" /* raw */])) || observed);
}
function markRaw(value) {
    def(value, "__v_skip" /* skip */, true);
    return value;
}

const convert = (val) => isObject(val) ? reactive(val) : val;
function isRef(r) {
    return r ? r.__v_isRef === true : false;
}
function ref(value) {
    return createRef(value);
}
function shallowRef(value) {
    return createRef(value, true);
}
function createRef(rawValue, shallow = false) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    let value = shallow ? rawValue : convert(rawValue);
    const r = {
        __v_isRef: true,
        get value() {
            track(r, "get" /* GET */, 'value');
            return value;
        },
        set value(newVal) {
            if (hasChanged(toRaw(newVal), rawValue)) {
                rawValue = newVal;
                value = shallow ? newVal : convert(newVal);
                trigger(r, "set" /* SET */, 'value',  { newValue: newVal } );
            }
        }
    };
    return r;
}
function triggerRef(ref) {
    trigger(ref, "set" /* SET */, 'value',  { newValue: ref.value } );
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
function customRef(factory) {
    const { get, set } = factory(() => track(r, "get" /* GET */, 'value'), () => trigger(r, "set" /* SET */, 'value'));
    const r = {
        __v_isRef: true,
        get value() {
            return get();
        },
        set value(v) {
            set(v);
        }
    };
    return r;
}
function toRefs(object) {
    if ( !isProxy(object)) {
        console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
function toRef(object, key) {
    return {
        __v_isRef: true,
        get value() {
            return object[key];
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
}

function computed(getterOrOptions) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter =  () => {
                console.warn('Write operation failed: computed value is readonly');
            }
            ;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    let dirty = true;
    let value;
    let computed;
    const runner = effect(getter, {
        lazy: true,
        // mark effect as computed so that it gets priority during trigger
        computed: true,
        scheduler: () => {
            if (!dirty) {
                dirty = true;
                trigger(computed, "set" /* SET */, 'value');
            }
        }
    });
    computed = {
        __v_isRef: true,
        // expose effect so computed can be stopped
        effect: runner,
        get value() {
            if (dirty) {
                value = runner();
                dirty = false;
            }
            track(computed, "get" /* GET */, 'value');
            return value;
        },
        set value(newValue) {
            setter(newValue);
        }
    };
    return computed;
}

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

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
    return vnode;
};
function getShapeFlag(type) {
    return typeof type === "string"
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
}

var h = function (type, props, children) {
    return createVNode(type, props, children);
};

function createComponentInstance(vnode) {
    var instance = {
        type: vnode.type,
        vnode: vnode,
        props: {},
        proxy: null,
        isMounted: false,
    };
    return instance;
}

function hostCreateElement(type) {
    console.log("hostCreateElement", type);
    var element = document.createElement(type);
    return element;
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
        case "onclick":
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

var render = function (vnode, container) {
    console.log("调用 patch");
    patch(null, vnode, container);
};
function patch(n1, n2, container) {
    if (container === void 0) { container = null; }
    var type = n2.type, shapeFlag = n2.shapeFlag;
    switch (type) {
        case "text":
            break;
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                console.log("处理 element");
                processElement(n1, n2, container);
            }
            else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                console.log("处理 component");
                processComponent(n1, n2, container);
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
function processComponent(n1, n2, container) {
    if (!n1) {
        mountComponent(n2, container);
    }
}
function mountComponent(initialVNode, container) {
    var instance = (initialVNode.component = createComponentInstance(initialVNode));
    console.log("\u521B\u5EFA\u7EC4\u4EF6\u5B9E\u4F8B:" + instance.type.name);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupComponent(instance) {
    initProps();
    initSlots();
    setupStatefulComponent(instance);
}
function initProps() {
    console.log("initProps");
}
function initSlots() {
    console.log("initSlots");
}
function setupStatefulComponent(instance) {
    console.log("创建 proxy");
    var setupResult = instance.setup && instance.setup(instance.props);
    handleSetupResult(instance, setupResult);
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "function") {
        instance.render = setupResult;
    }
    else if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (!instance.render) ;
    instance.render = Component.render;
}
function setupRenderEffect(instance, container) {
    instance.update = effect(function componentEffect() {
        if (!instance.isMounted) {
            console.log("调用 render,获取 subTree");
            var subTree = (instance.subTree = instance.render(instance.proxy));
            console.log("subTree", subTree);
            console.log(instance.type.name + ":\u89E6\u53D1 beforeMount hook");
            console.log(instance.type.name + ":\u89E6\u53D1 onVnodeBeforeMount hook");
            patch(null, subTree, container);
            console.log(instance.type.name + ":\u89E6\u53D1 mounted hook");
            instance.isMounted = true;
        }
        else {
            console.log("调用更新逻辑");
            var nextTree = instance.render(instance.proxy);
            var prevTree = instance.subTree;
            instance.subTree = nextTree;
            console.log("beforeUpdated hook");
            console.log("onVnodeBeforeUpdate hook");
            patch(prevTree, nextTree, prevTree.el);
            console.log("updated hook");
            console.log("onVnodeUpdated hook");
        }
    }, {
        scheduler: function (effect) {
            queueJob(effect);
        },
    });
}

var createApp = function (rootComponent) {
    var app = {
        _component: rootComponent,
        _container: null,
        mount: function (rootContainer) {
            console.log("基于根组件创建 vnode");
            var vnode = createVNode(rootComponent);
            app._container = rootContainer;
            console.log("调用 render，基于 vnode 进行开箱");
            render(vnode, rootContainer);
        },
    };
    return app;
};

exports.ITERATE_KEY = ITERATE_KEY;
exports.computed = computed;
exports.createApp = createApp;
exports.customRef = customRef;
exports.effect = effect;
exports.enableTracking = enableTracking;
exports.h = h;
exports.isProxy = isProxy;
exports.isReactive = isReactive;
exports.isReadonly = isReadonly;
exports.isRef = isRef;
exports.markRaw = markRaw;
exports.pauseTracking = pauseTracking;
exports.reactive = reactive;
exports.readonly = readonly;
exports.ref = ref;
exports.resetTracking = resetTracking;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;
exports.shallowRef = shallowRef;
exports.stop = stop;
exports.toRaw = toRaw;
exports.toRef = toRef;
exports.toRefs = toRefs;
exports.track = track;
exports.trigger = trigger;
exports.triggerRef = triggerRef;
exports.unref = unref;
//# sourceMappingURL=mini-vue.cjs.js.map
