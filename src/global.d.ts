interface Debug {
  mainPath: (string) => any;
  level:number;
  add:()=>void;
  sub:()=>void;
  log:(...items:any[])=>void;
  // 开启分组
  gb:(label:string,isCollapsed?:boolean)=>void;
  // 结束分组 
  ge:()=>void;
}

declare var debug: Debug;
