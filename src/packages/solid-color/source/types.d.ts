export declare type HexColor = string;
export declare type HslColor = {
    h: number;
    l: number;
    s: number;
    a?: number;
};
export declare type HsvColor = {
    h: number;
    s: number;
    v: number;
    a?: number;
};
export declare type RgbColor = {
    r: number;
    g: number;
    b: number;
    a?: number;
};
export declare type Color = HexColor | HslColor | HsvColor | RgbColor;
export declare type ColorResult = {
    hex: HexColor;
    hsl: HslColor;
    hsv: HsvColor;
    rgb: RgbColor;
    oldHue: number;
};
export declare type ChangeColor = HslColor | HsvColor | (RgbColor & {
    source?: string;
}) | {
    hex: HexColor;
    source: string;
} | HexColor;
export declare type Direction = 'horizontal' | 'vertical';
