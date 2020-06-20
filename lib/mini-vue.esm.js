var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

var createVNode = function (type, props, children) {
    var vnode = {
        el: null,
        component: null,
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
    switch (key) {
        case "tId":
            el.setAttribute(key, nextValue);
            break;
    }
}
function hostInsert(el, container) {
    console.log("hostInsert");
    container.append(el);
}

var render = function (vnode, container) {
    console.log("调用 patch");
    patch(null, vnode, container);
};
function patch(n1, n2, container) {
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
    console.log("调用 render,获取 subTree");
    var subTree = instance.render(instance.proxy);
    console.log("subTree", subTree);
    console.log(instance.type.name + ":\u89E6\u53D1 beforeMount hook");
    console.log(instance.type.name + ":\u89E6\u53D1 onVnodeBeforeMount hook");
    patch(null, subTree, container);
    console.log(instance.type.name + ":\u89E6\u53D1 mounted hook");
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

export { createApp, h };
//# sourceMappingURL=mini-vue.esm.js.map
