// Utility class for paginating arrays
export class Paginator {
    paginate(items, pageNumber, pageSize) {
        const startIndex = (pageNumber - 1) * pageSize;
        return items.slice(startIndex, startIndex + pageSize);
    }
}
//# sourceMappingURL=Paginator.js.map