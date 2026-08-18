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
  export function converter(mode: string): (color: any) => any;
  export function parse(color: string): any;
  export function formatRgb(color: any): string;
  export function clampChroma(color: any, mode?: string, target?: string): any;
  export function interpolate(colors: any[], mode?: string, options?: any): (t: number) => any;
}

declare module "culori/fn";
declare module "lucide-react";
declare module "@/types/*";
declare module "*convex/_generated/api" {
  export const api: any;
}
declare module "*convex/_generated/dataModel" {
  export type Id<T> = string;
}

