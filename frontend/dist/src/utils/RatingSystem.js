export class RatingSystem {
    ratings = new Map();
    //adiciona uma avaliação para uma entidade
    rate(item, value) {
        if (value < 1 || value > 5) {
            throw new Error('Rating deve estar entre 1 e 5');
        }
        if (!this.ratings.has(item)) {
            this.ratings.set(item, []);
        }
        this.ratings.get(item).push(value);
    }
    //obtém a avaliação média de uma entidade
    getAverage(item) {
        const ratings = this.ratings.get(item);
        if (!ratings || ratings.length === 0) {
            return 0;
        }
        const sum = ratings.reduce((acc, val) => acc + val, 0);
        return sum / ratings.length;
    }
    //obtém todas as avaliações de uma entidade
    getRatings(item) {
        return this.ratings.get(item) || [];
    }
    //limpa todas as avaliações de uma entidade
    clearRatings(item) {
        this.ratings.delete(item);
    }
    //obtém o número de avaliações de uma entidade
    getRatingCount(item) {
        return this.getRatings(item).length;
    }
}
//# sourceMappingURL=RatingSystem.js.map