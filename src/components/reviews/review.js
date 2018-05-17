import React from 'react';

import RatingBox    from '../utility/rating-box';
import {
    Review
}                   from '../../store/__models';

const Controller = (props) =>  {
    const review = new Review(props.review);

    return(
        <div className="review">
            <div className="review__left-side">
                <div className="review__left-side__rating">
                    <RatingBox currentValue={review.rating}/>
                </div>
                <div className="review__left-side__avatar">
                    {
                        props.userInfo &&
                        <img src={props.userInfo.avatar} />
                    }
                </div>
            </div>
            <div className="review__right-side">
                <div className="review__right-side__top-row">
                    <span className="review__right-side__top-row__user-name">Михаил Силантьев</span>
                    <div className="review__right-side__top-row__rating">
                        <RatingBox iconSize={18} currentValue={review.rating}/>
                    </div>
                    <span className="review__right-side__top-row__date">{review.getAddedDate()}</span>
                </div>
                <div className="review__right-side__content">
                    <p className="review__right-side__content__text">
                        {review.body}
                    </p>
                </div>
                <div className="review__right-side__bottom-row">
                    <span className="review__right-side__bottom-row__question" 
                          data-normal="Был ли этот отзыв полезен Вам?"
                          data-small="Полезный отзыв?"></span>
                    <div
                        onClick={() => {props.onClick(true)}}
                        className="review__right-side__bottom-row__answer review__right-side__bottom-row__answer--yes"
                        data-value={`(${0})`}>да</div>
                    <div
                        onClick={() => {props.onClick(false)}}
                        className="review__right-side__bottom-row__answer review__right-side__bottom-row__answer--no"
                        data-value={`(${0})`}>нет</div>
                </div>
            </div>
        </div>
    );
}

export default Controller;