export declare class GlobalValidators {
    static isValidEmail(email: string): boolean;
    static isNonEmpty(text: string): boolean;
    static isPositiveNumber(value: number): boolean;
    static minLength(text: string, size: number): boolean;
    static maxLength(text: string, size: number): boolean;
    static isValidUrl(url: string): boolean;
    static isValidDate(date: any): boolean;
}
