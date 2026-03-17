// Validações globais do sistema
export class GlobalValidators {
    // Validar email
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar texto não vazio
    static isNonEmpty(text: string): boolean {
        return text && text.trim().length > 0;
    }

    // Validar número positivo
    static isPositiveNumber(value: number): boolean {
        return typeof value === 'number' && value > 0;
    }

    // Validar comprimento mínimo
    static minLength(text: string, size: number): boolean {
        return text && text.trim().length >= size;
    }

    // Validar comprimento máximo
    static maxLength(text: string, size: number): boolean {
        return text && text.length <= size;
    }

    // Validar URL
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Validar data
    static isValidDate(date: any): boolean {
        return date instanceof Date && !isNaN(date.getTime());
    }
}