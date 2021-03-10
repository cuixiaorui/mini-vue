export default class Debug {
  private languageTranslator: any;
  constructor(languageTranslator) {
    // 文本转换器 for support english
    this.languageTranslator = languageTranslator;
  }

  mainPath(text) {
    return window.console.log.bind(
      window.console,
      `%c${this.languageTranslator.transition(text)}`,
      "color:red"
    );
  }
}
