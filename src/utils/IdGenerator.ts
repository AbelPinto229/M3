// Gerador global de IDs únicos
export class IdGenerator {
    // Contador interno privado
    private static counter: number = 0;

    // Gerar próximo ID único
    static generate(): number {
        return ++IdGenerator.counter;
    }

    // Obter contador atual
    static getCounter(): number {
        return IdGenerator.counter;
    }

    // Reset para testes
    static reset(): void {
        IdGenerator.counter = 0;
    }
}
