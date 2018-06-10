export class CatalogPageFilters {
    constructor(model = {}) {
        // Инфо каталога
        this.catalogPathNodes = ['catalog'];
        this.catalogIds = [];
        this.itemsOnPage = 20;
        this.itemsOnPageValues = [20, 60, 100];
        this.rating = 0;
        this.ratingDefault = 0;
        this.colorCodes = [];
        this.colorCodesDefault = [];
        this.patternCodes = [];
        this.seasonsCodes = 0;
        this.sexesCodes = [];
        this.sortByItems = [
            { id: 0, title: 'По новизне' },
            { id: 1, title: 'По популярности' },
            { id: 2, title: 'По алфавиту' },
            { id: 3, title: 'По цене' }
        ];
        this.sortById = 1;
        this.sortByDesc = false;
        this.pricePerItemFrom = 0;
        this.pricePerItemTo = 0;

        this._seasons = null;
        this._sexes = null;
    }

    get Sexes() {
        return _.reduce(this.sexes, (s, n) => s + parseInt(n), 0);
    }

    get SortBy() {
        return '10';
    }
}