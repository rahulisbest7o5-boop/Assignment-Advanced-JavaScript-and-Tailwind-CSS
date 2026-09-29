type ConverterName = "weight" | "distance" | "temperature";
interface ConverterDefinition {
    title: string;
    description: string;
    from: string;
    to: string;
    fromUnit: string;
    toUnit: string;
}
declare const formulas: Record<string, (value: number) => number>;
declare const createConverter: (from: string, to: string) => (value: number | number[]) => number | number[];
declare const parseInput: (text: string) => number | number[] | null;
declare const formatResult: (result: number | number[]) => string;
//# sourceMappingURL=main.d.ts.map