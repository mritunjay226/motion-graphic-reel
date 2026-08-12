declare module "culori" {
  export interface Rgb {
    mode: "rgb";
    r: number;
    g: number;
    b: number;
    alpha?: number;
  }

  export interface Oklch {
    mode: "oklch";
    l: number;
    c: number;
    h?: number;
    alpha?: number;
  }

  export function clampChroma(color: any, mode?: string, targetMode?: string): any;
  export function converter(targetMode: string): (color: any) => any;
  export function formatRgb(color: any): string;
  export function interpolate(colors: any[], mode?: string): (t: number) => any;
  export function parse(color: string): any;
}
