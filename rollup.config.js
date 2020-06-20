import pkg from "./package.json";
import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";

export default {
  input: "./src/index.ts",
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
    sourceMaps()
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
