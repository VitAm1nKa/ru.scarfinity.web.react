import React                    from 'react';
import { NavLink }              from 'react-router-dom';
import { connect }              from 'react-redux';
import {
    actionCreators as RecenlyViewedActions
}                               from '../../store/recenlyViewed';

import {
    VerticalGrid
}                               from '../../lib/grid';
import FlatButton               from 'material-ui/FlatButton';
import Paper                    from 'material-ui/Paper';
import ItemRow                  from '../utility/item-row';
import ImageContainer           from '../utility/image-container';

import './recenly-viewed-small.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getRecenlyViewed();
    }

    render() {
        return(
            <Paper className="recenly-viewed-small">
                <VerticalGrid>
                    <div className="recenly-viewed-small__header">
                        <div className="recenly-viewed-small__header__title">
                            {"Недавно просмотренные"}
                        </div>
                        <NavLink
                            to={"/"}
                            className="recenly-viewed-small__header__button">{"Посмотреть все"}</NavLink>
                    </div>
                    <ItemRow
                        minWidth={110}
                        items={
                            _.map(this.props.productModels, productModel => {
                                return(
                                    <NavLink
                                        to={productModel.path()}
                                        key={productModel.id}
                                        className="recenly-viewed-small__item">
                                        <ImageContainer
                                            imageUrl={productModel.image.getPreview()}/>
                                    </NavLink>
                                )
                            })
                        }/>
                </VerticalGrid>
            </Paper>
        )
    }
}

export default connect(state => state.recenlyViewed, RecenlyViewedActions)(Controller);