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
        return `${this.sortById}${this.sortByDesc ? '1' : '0'}`;
    }

    static isEqual(filterA, filterB) {
        if(filterA == null || filterB == null) return false;

        return  filterA.itemsOnPage === filterB.itemsOnPage 
            &&  filterA.rating === filterB.rating
            &&  _.difference(filterA.colorCodes, filterB.colorCodes).length == 0
            &&  _.difference(filterA.patternCodes, filterB.patternCodes).length == 0
            &&  filterA.seasonsCodes === filterB.seasonsCodes
            &&  _.difference(filterA.sexesCodes, filterB.sexesCodes).length == 0
            &&  filterA.pricePerItemFrom === filterB.pricePerItemFrom
            &&  filterA.pricePerItemTo === filterB.pricePerItemTo
    }

    static isEqualForProducts(filterA, filterB) {
        if(filterA == null || filterB == null) return false;
        
        return  this.isEqual(filterA, filterB)
            &&  filterA.sortById === filterB.sortById
            &&  filterA.sortByDesc === filterB.sortByDesc
    }
}