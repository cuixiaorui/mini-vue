// TODO 需要后面扩展 map 即可
const c2eMap = {
  你好: "hello",
};

const e2cMap = {
  hello: "你好",
};

export default class LanguageTranslator {
  private currentLanguage: string;
  constructor() {
    // TODO这个值可以基于环境变量自行控制
    this.currentLanguage = "cn";
  }

  private get currentMap(): any {
    return this.currentLanguage === "cn" ? e2cMap : c2eMap;
  }

  transition(text) {
    const result = this.currentMap[text];

    if (result) {
      return result;
    } else {
      return text;
    }
  }
}
