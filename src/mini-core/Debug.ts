// 使用： debug.mainPath("你好")()
// 必须使用两个括号，要保证 line 的正确性就得在要显示 line 的地方调用函数
// console.log 这个函数不可以被封装
export default class Debug {
  private languageTranslator: any;
  constructor(languageTranslator) {
    // 文本转换器 for support english
    this.languageTranslator = languageTranslator;
  }

  mainPath(text) {
    return window.console.log.bind(
      window.console,
      `%c[ mainPath ] ${this.languageTranslator.transition(text)}`,
      "color:red"
    );
  }
}
