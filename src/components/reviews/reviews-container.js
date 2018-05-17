import React            from 'react';
import {connect}        from 'react-redux';
import * as ReviewState from '../../store/review';

import RaisedButton     from 'material-ui/RaisedButton';
import Review           from './review';
import RatingBox        from '../utility/rating-box';

import Pagination       from '../utility/pagination';
import { ReviewCollection } from '../../store/__models';

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
                        <RaisedButton
                            label="Оставить отзыв"
                            disabled={this.state.disabled}
                            onClick={() => {if(this.bodyValidate) this.props.onClick(this.state.value)}} />
                    </div>
                    <div className="review-container-leave__bottom-row__notice">Минимальная длина: 20 символов</div>
                </div>
            </div>
        );
    }
}

const NoReviews = (props) => {
    return(
        <div className="review-container-noreviews">
            <div className="review-container-noreviews__text">
                {"Пока что никто не писал отзыв об этом товаре."}
            </div>
            <div
                className="review-container-noreviews__link"
                onClick={props.onClick}>{"Написать отзыв"}</div>
        </div>
    )
}

const ReviewList = (props) => {
    return(
        <div className="review-container-list">
            {
                _.map(props.reviews, review => {
                    return(
                        <div
                            key={review.reviewCollectionItemId}
                            className="review-container-list__item">
                                <Review
                                    review={review}
                                    onClick={useful => {props.onClick(review.reviewCollectionItemId, useful)}} />
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
    var leaveReviewPrerender = 
        <div className={`review-container-header`}>
            <span className="review-container-header__title">Оставить отзыв</span>
            <div style={{flex: 1, textAlign: 'right'}}>
                <RaisedButton 
                    onClick={() => {props.onClick("leave")}}
                    label="К отзывам"/>
            </div>
        </div>

    var reviewListPrerender = 
        <div className={`review-container-header`}>
        <span className="review-container-header__title">Отзывы</span>
        <div className="review-container-header__review-count">{props.reviewsCount || 0}</div>
        <div style={{flex: 1, textAlign: 'right'}}>
            <RaisedButton 
                onClick={() => {props.onClick("reviews")}}
                label="Написать отзыв"/>
        </div>
    </div>

    return props.leave === true ? leaveReviewPrerender : reviewListPrerender;
}

class ReviewsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leave: false,
            currentPage: 1,
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {

    }

    handleClick(type) {
        this.setState({
            leave: type == 'reviews' ? true : false
        });
    }

    handleIndexChange(index) {
        this.setState({
            currentPage: index
        });
    }

    handleReviewEvaluationClick(reviewId, useful) {
        // const collectionId = this.props.reviewsCollectionId || -1;
        // this.props.postReviewEvaluation(collectionId, reviewId, useful);
    }

    renderReviewList() {
        const reviewCollection = new ReviewCollection(this.props.reviewCollection);

        if(reviewCollection.reviewsCount > 0) {
            const reviewPage = reviewCollection.getReviewPage(this.state.currentPage);
            return <ReviewList
                reviews={reviewPage.reviews}
                pagesCount={reviewPage.pagesCount}
                currentPage={this.state.currentPage}
                onIndexChange={this.handleIndexChange.bind(this)}
                onClick={this.handleReviewEvaluationClick.bind(this)} />
        }

        return <NoReviews onClick={this.handleClick}/>;
    }
    
    render() {
        const reviewCollection = new ReviewCollection(this.props.reviewCollection);

        return(
            <div className="review-container">
                <Header
                    reviewsCount={reviewCollection.reviewsCount}
                    leave={this.state.leave}
                    onClick={this.handleClick} />
                {
                    this.state.leave == false ?
                    this.renderReviewList() :
                    <LeaveReview
                        onClick={this.props.handleReviewPost}/>
                }
            </div>
        )
    }
}

export default ReviewsContainer;