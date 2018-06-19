import { Review } from './Review';

export class ReviewCollection {
    constructor(model = {}) {
        this.reviewCollectionId = model.reviewCollectionId;
        this.productModelId = model.productModelId;
        this.averageRating = model.averageRating;
        this.reviewsCount = model.reviewsCount;
        this.reviews = _.map(model.reviews, review => new Review(review));

        this.getReviewPage = this.getReviewPage.bind(this);
    }

    getReviewPage(currentPage, chunkSize = 3) {
        if(this.reviews.length > 0) {
            const reviewsChunked = _.chunk(this.reviews, chunkSize);
            return {
                reviews: reviewsChunked[currentPage - 1],
                pagesCount: reviewsChunked.length,
            }
        }
    }
}