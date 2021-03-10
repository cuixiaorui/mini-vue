// 这个文件夹是 mini-vue 库自己专用的
// 用户无需关心
import LanguageTranslator from "./LanguageTranslator";
import Debug from "./Debug";

const debug = new Debug(new LanguageTranslator());
window.debug = debug;
