// Gerador global de IDs únicos
export class IdGenerator {
    // Contador interno privado
    static counter = 0;
    // Gerar próximo ID único
    static generate() {
        return ++IdGenerator.counter;
    }
    // Obter contador atual
    static getCounter() {
        return IdGenerator.counter;
    }
    // Reset para testes
    static reset() {
        IdGenerator.counter = 0;
    }
}
//# sourceMappingURL=IdGenerator.js.map