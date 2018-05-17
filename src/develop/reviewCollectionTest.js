import React                        from 'react';
import {connect}                    from 'react-redux';
import ReviewsContainer             from '../components/reviews/reviews-container';

import * as ReviewCollectionStore   from '../store/reviewCollection';

class ReviewCollectionTest extends React.Component {
    constructor(props) {
        super(props);

        console.log("DSFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

    }

    componentWillMount() {
        this.props.getReviewCollection(1);
    }

    render() {
        return(<ReviewsContainer
            reviewCollection={this.props.reviewCollection} />);
    }
}

export default connect(state => state.reviewCollection, ReviewCollectionStore.actionCreators)(ReviewCollectionTest);