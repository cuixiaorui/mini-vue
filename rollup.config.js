import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";
// 为了支持 Promises 功能，你必须引入 Babel polyfill。 
// 如需使用 Iterators (接口) 则必须引入 Babel polyfill。 
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs"; //将 CommonJS 的模块转换为 ES2015 供 rollup 处理。
// rollup.js编译源码中的模块引用默认只支持 ES6+的模块方式import/export。然而大量的npm模块是基于CommonJS模块方式，这就导致了大量 npm 模块不能直接编译使用。

import replace from "@rollup/plugin-replace";

import babel, { getBabelOutputPlugin } from "@rollup/plugin-babel";
// 可以看到箭头函数被保留下来，这样的代码在不支持ES6的环境下将无法运行。我们期望在rollup.js打包的过程中就能使用babel完成代码转换，因此我们需要babel插件。

// import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "./src/index.ts", //这个包的入口点 
    plugins: [ //插件(plugins)#
        replace({
            "process.env.NODE_ENV": JSON.stringify("development"),
            "process.env.VUE_ENV": JSON.stringify("browser"),
            "process.env.LANGUAGE": JSON.stringify(process.env.LANGUAGE),
        }),
        resolve(),
        commonjs(),
        typescript(),
        sourceMaps(),
        babel(),
        // getBabelOutputPlugin({ presets: ['@babel/preset-env'] })
        // babel({
        //   exclude: 'node_modules/**',
        // })
    ],
    output: [{
            format: "cjs", //格式
            // amd – 异步模块定义，用于像RequireJS这样的模块加载器
            // cjs – CommonJS，适用于 Node 和 Browserify/Webpack
            // esm – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 <script type=module> 标签引入
            // iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
            // umd – 通用模块定义，以amd，cjs 和 iife 为一体
            // system - SystemJS 加载器格式
            file: pkg.main, // 要写入的文件。也可用于生成 sourcemaps，如果适用
            sourcemap: true, //生成的包名
        },
        {
            name: "vue",
            format: "es",
            file: pkg.module,
            sourcemap: true,
            // paths: {      d3: 'https://d3js.org/d3.v4.min'    }  //路径   
        },
    ],
    // globals: {    jquery: '$'  }
    onwarn: (msg, warn) => { //Function 将拦截警告信息。如果没有提供，警告将被复制并打印到控制台。
        // 忽略 Circular 的错误
        if (!/Circular/.test(msg)) {
            warn(msg);
        }
    },
    // npm i -D @rollup/plugin-node-resolve
    // plugins: [resolve()],
    external: ["the-answer"],
    // resolve插件，但可能我们仍然想要某些库保持外部引用状态，这时我们就需要使用external属性，来告诉rollup.js哪些是外部的类库。


};