export class RatingSystem<T> {
    private ratings: Map<T, number[]> = new Map();

    //adiciona uma avaliação para uma entidade
    rate(item: T, value: number): void {
        if (value < 1 || value > 5) {
            throw new Error('Rating deve estar entre 1 e 5');
        }

        if (!this.ratings.has(item)) {
            this.ratings.set(item, []);
        }

        this.ratings.get(item)!.push(value);
    }
    //obtém a avaliação média de uma entidade
    getAverage(item: T): number {
        const ratings = this.ratings.get(item);

        if (!ratings || ratings.length === 0) {
            return 0;
        }

        const sum = ratings.reduce((acc, val) => acc + val, 0);
        return sum / ratings.length;
    }

   //obtém todas as avaliações de uma entidade
    getRatings(item: T): number[] {
        return this.ratings.get(item) || [];
    }

   //limpa todas as avaliações de uma entidade
    clearRatings(item: T): void {
        this.ratings.delete(item);
    }

    //obtém o número de avaliações de uma entidade
    getRatingCount(item: T): number {
        return this.getRatings(item).length;
    }
}
