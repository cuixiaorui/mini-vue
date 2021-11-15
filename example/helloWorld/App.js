import { h, ref, reactive, computed } from "../../lib/mini-vue.esm.js";

const HelloWorld = {
    name: "HelloWorld",
    setup() {


        const msg = ref(123);
        const msgs = ref({ count: 1231 });

        const msgr = reactive({ count: 1231111 });
        // const stateAsRefs = toRefs(state)


        const plusOne = computed(() => msg.value + 1) //里面的值是获取最新的值

        const changeChildProps = () => {
            msg.value = 456;
            console.log('aa-msgs', msgs, msgr.count)

        };

        return { msg, msgs, plusOne, changeChildProps };
    },
    // TODO 第一个小目标
    // 可以在使用 template 只需要有一个插值表达式即
    // 可以解析 tag 标签
    // template: `
    //   <div>hi {{msg}}</div>
    //   需要编译成 render 函数
    // `,
    render() {
        return h(
            "div", { tId: "helloWorld" }, [
                h("div", {}, "你好" + this.msg),
                h("div", {}, "你好s" + this.msgs.count),
                h("div", {}, "你好ss" + this.plusOne.value),
                h(
                    "button", {
                        onClick: this.changeChildProps,
                    },
                    "change child props"
                ),
                // h(Child, {
                //   msg: this.msg,
                // }),
                // h(`hello world: count: ${count.value}`, {
                //   msg: this.msg,
                // }),

            ]
            // `hello world: count: ${count.value}`
        );
    },
};

export default {
    name: "App",
    // props,
    emits: ['close', 'change', 'finish', 'click-tab', 'update:modelValue'],
    setup() {

        const onClose = () => emit('close');
        const onClickTab = ({ name, title }) => emit('change', name, title);

    },

    render() {
        return h("div", { tId: 1 }, [h("p", {}, "主页"), h(HelloWorld)]);
    },
};