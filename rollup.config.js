import pkg from "./package.json";
import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

export default {
  input: "./src/index.ts",
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VUE_ENV': JSON.stringify('browser')
    }),
    resolve(),
    commonjs(),
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
    sourceMaps(),
  ],
  output: [
    {
      format: "cjs",
      file: pkg.main,
      sourcemap: true
    },
    {
      name:"vue",
      format: "es",
      file: pkg.module,
      sourcemap: true
    }
  ]
};
