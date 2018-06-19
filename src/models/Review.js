export class Review {
    constructor(model = {}) {
        this.reviewId = model.reviewId;
        this.reviewCollectionId = model.reviewCollectionId;
        this.userId = model.userId;
        this.addedDate = model.addedDate;
        this.title = model.title || '';
        this.subject = model.subject || '';
        this.body = model.body || '';
        this.rating = model.rating || 0;

        this.getAddedDate = this.getAddedDate.bind(this);
    }

    getAddedDate() {
        return (new Date(this.addedDate)).toLocaleDateString();
    }
}