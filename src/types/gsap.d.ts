declare module "gsap/SplitText" {
  export class SplitText {
    constructor(target: any, vars?: any);
    chars: HTMLElement[];
    words: HTMLElement[];
    lines: HTMLElement[];
    revert(): void;
  }
}

declare module "gsap/DrawSVGPlugin" {
  export const DrawSVGPlugin: any;
}

declare module "gsap/MorphSVGPlugin" {
  export const MorphSVGPlugin: any;
}

declare module "gsap/ScrollSmoother" {
  export class ScrollSmoother {
    static create(vars?: any): ScrollSmoother;
    static get(): ScrollSmoother | null;
    scrollTo(target: any, smooth?: boolean, position?: string): void;
    scrollTop(position?: number): number | void;
    kill(): void;
    paused(pause?: boolean): boolean | void;
  }
}

declare module "gsap/GSDevTools" {
  export const GSDevTools: any;
}

declare module "gsap/CustomEase" {
  export const CustomEase: any;
}

declare module "gsap/ScrambleTextPlugin" {
  export const ScrambleTextPlugin: any;
}
