'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

exports.ShapeFlags = void 0;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
})(exports.ShapeFlags || (exports.ShapeFlags = {}));

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

exports.camelize = camelize;
exports.capitalize = capitalize;
exports.extend = extend;
exports.hasChanged = hasChanged;
exports.hasOwn = hasOwn;
exports.isObject = isObject;
exports.isOn = isOn;
exports.isString = isString;
exports.toDisplayString = toDisplayString;
exports.toHandlerKey = toHandlerKey;
//# sourceMappingURL=shared.cjs.js.map
