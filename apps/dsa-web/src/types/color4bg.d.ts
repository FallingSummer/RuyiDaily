declare module 'color4bg' {
  interface BgOptions {
    dom: string;
    colors: string[];
    seed?: number;
    loop?: boolean;
  }

  class AbstractShapeBg {
    constructor(options: BgOptions);
    start(): void;
    destroy(): void;
  }

  export { AbstractShapeBg };
}
