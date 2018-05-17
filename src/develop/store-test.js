import React        from 'react';
import { connect }  from 'react-redux';
import {
    actionCreators as ShoppinCartActions
}                   from '../store/shoppingCart'

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getShoppingCart();
    }

    render() {
        return null;
    }
}

const mstp = (state, ownProps) => {
    return {
        
    }
}

export default connect(mstp,
    Object.assign({}, ShoppinCartActions)
)(Controller);