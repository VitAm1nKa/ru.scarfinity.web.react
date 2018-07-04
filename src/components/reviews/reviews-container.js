import React            from 'react';

import {
    LeaveReviewButton
}                       from '../utility/buttons';
import Review           from './review';
import RatingBox        from '../utility/rating-box';

import Pagination       from '../utility/pagination';

import './reviews-container.less';

class LeaveReview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: true,
            value: "",
        }

        this.bodyValidate = () => this.state.value.length < 20;
        this.onTextChange = this.onTextChange.bind(this);
    }

    onTextChange(event) {
        this.setState({
            value: event.target.value.replace(/[|&$@+]/g, ""),
            disabled: this.bodyValidate()
        });
    }

    render() {
        return(
            <div className="review-container-leave">
                <div className="review-container-leave__top-row">
                    <div className="review-container-leave__top-row__avatar"></div>
                    <div className="review-container-leave__top-row__user-name">Михаил Силантьев</div>
                    <div className="review-container-leave__top-row__rating">
                        <span className="review-container-leave__top-row__rating__label">Оценка:</span>
                        <RatingBox currentValue={5} changeable />
                    </div>
                </div>
                <div className="review-container-leave__text-box">
                    <textarea className="review-container-leave__text-box__text-area" name="" id="" rows="10" placeholder="Напишите отзыв о товаре..."
                        value={this.state.value}
                        onChange={this.onTextChange}></textarea>
                </div>
                <div className="review-container-leave__bottom-row">
                    <div className="review-container-leave__bottom-row__button">
                        {/* <LeaveReviewButton
                            label="Оставить отзыв"
                            disabled={this.state.disabled}
                            onClick={() => {if(this.bodyValidate) this.props.onClick(this.state.value)}} /> */}
                    </div>
                    <div className="review-container-leave__bottom-row__notice">Минимальная длина: 20 символов</div>
                </div>
            </div>
        );
    }
}

const ReviewList = (props) => {
    if(props.reviews == null || props.reviews.length == 0) {
        return(
            <div className="review-container-noreviews">
                <div className="review-container-noreviews__text">
                    {"Пока что никто не писал отзыв об этом товаре."}
                </div>
                <div
                    className="review-container-noreviews__link"
                    onClick={props.onAddReview}>{"Написать отзыв"}</div>
            </div>
        )
    }

    return(
        <div className="review-container-list">
            {
                _.map(props.reviews, review => {
                    return(
                        <div
                            key={review.reviewId}
                            className="review-container-list__item">
                                <Review
                                    review={review} />
                                    {/* onClick={useful => {props.onClick(review.reviewCollectionItemId, useful)}} /> */}
                        </div>
                    )
                })
            }
            <div className="review-container-list__bottom-navigation">
                {
                    props.pagesCount > 0 &&
                    <Pagination
                        onIndexChange={props.onIndexChange}
                        pagesCount={props.pagesCount}
                        currentPage={props.currentPage}
                        onClick={props.onIndexChange}/>
                }
            </div>
        </div>
    );
}

const Header = (props) => {
    return(
        <div className="review-container-header">
            <span className="review-container-header__title">{props.title}</span>
            <div className="review-container-header__count">{props.reviewsCount || 0}</div>
            <div className="review-container-header__button">
                <LeaveReviewButton
                    label={props.buttonLabel}
                    onClick={props.onClick}/>
            </div>
        </div>
    )
}

class ReviewsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leave: false,
            reviewPages: [],
            currentPage: 1,
        }

        this.updateReviews = this.updateReviews.bind(this);
        this.handleIndexChange = this.handleIndexChange.bind(this);
        this.handleReviewEvaluationClick = this.handleReviewEvaluationClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.updateReviews(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateReviews(nextProps);
    }

    updateReviews(props) {
        if(!props.reviewsFetch) {
            const pages = _.chunk(props.reviews, props.pageSize || 3);
            this.setState({
                reviewPages: pages,
                currentPage: Math.max(Math.min(this.state.currentPage, pages.length), 1)
            })
        }
    }

    handleClick() {
        this.setState({ leave: !this.state.leave });
    }

    handleIndexChange(index) {
        this.setState({ currentPage: index });
    }

    handleReviewEvaluationClick(reviewId, useful) {
        // const collectionId = this.props.reviewsCollectionId || -1;
        // this.props.postReviewEvaluation(collectionId, reviewId, useful);
    }

    render() {
        const reviewsCount = this.props.reviews != null ? (
            this.props.reviews.length
        ) : 0;

        const reviewListContent = 
            !this.state.leave ? (
                !this.props.reviewsFetch ? (
                    <ReviewList
                        reviews={this.state.reviewPages[this.state.currentPage - 1]}
                        pagesCount={this.state.reviewPages.length}
                        currentPage={this.state.currentPage}
                        onIndexChange={this.handleIndexChange}
                        onClick={this.handleReviewEvaluationClick} />
                ) : <div>{"Loading..."}</div>
            ) : <LeaveReview />;

        return (
            <div className="review-container">
                <Header
                    title={this.state.leave ? 'Оставить отзыв' : 'Отзывы'}
                    reviewsCount={reviewsCount}
                    buttonLabel={this.state.leave ? 'К отзывам' : 'Оставить отзыв'}
                    onClick={this.handleClick}/>
                {reviewListContent}
            </div>
        )
    }
}

export default ReviewsContainer;