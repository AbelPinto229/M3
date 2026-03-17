// Validações globais do sistema
export class GlobalValidators {
    // Validar email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Validar texto não vazio
    static isNonEmpty(text) {
        return text && text.trim().length > 0;
    }
    // Validar número positivo
    static isPositiveNumber(value) {
        return typeof value === 'number' && value > 0;
    }
    // Validar comprimento mínimo
    static minLength(text, size) {
        return text && text.trim().length >= size;
    }
    // Validar comprimento máximo
    static maxLength(text, size) {
        return text && text.length <= size;
    }
    // Validar URL
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    // Validar data
    static isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }
}
//# sourceMappingURL=GlobalValidators.js.map