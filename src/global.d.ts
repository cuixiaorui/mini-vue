interface Debug {
  mainPath: (string) => any;
  level:number;
  add:()=>void;
  sub:()=>void;
  log:(...items:any[])=>void;
}

declare var debug: Debug;
