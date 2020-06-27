/// <reference types="next" />
/// <reference types="next/types/global" />
declare module NodeJS {
  export interface Global {
    app: any;
    express: any;
    appRoot: string;
  }
}
