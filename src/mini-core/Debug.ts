// 使用： debug.mainPath("你好")()
// 必须使用两个括号，要保证 line 的正确性就得在要显示 line 的地方调用函数
// 增加层级打印组件日志
export default class Debug {
  private languageTranslator: any;
  private level=0;
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
  add(){
    this.level++
}
sub(){
    this.level--
}
log( ...items: any[]){
  let prefix= new Array(this.level).fill("_").map((s,i)=>s+i).join("")
  return window.console.log.bind(
    window.console,
    `%c${prefix}`,
    "color:red;font-weight:bold;",
    ...items,
  );
}
 // 开启分组。  isCollapsed 是默认让分组折叠
  gb(label:string,isCollapsed:boolean){
    isCollapsed? console.groupCollapsed(label) : console.group(label)
  }
  // 结束分组
  ge(){
    console.groupEnd()
  }
}
