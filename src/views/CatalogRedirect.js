import React        from 'react';
import {
    Route
}                   from 'react-router-dom';
import Catalog      from './Catalog';
import ProductCard  from './ProductCard';
import PCT          from './ProductCardTest';

class Controller extends React.Component {
    componentWillReceiveProps(nextProps) {

    }

    render() {
        const lastNode = _.last(this.props.location.pathname.substr(1).replace(/\/$/, "").split('/')) || '';

        // Товар
        if(!isNaN(lastNode.charAt(0))) {
            return <Route path={this.props.location.pathname} component={PCT} />
            // return <Route path={this.props.location.pathname} component={ProductCard} />
        }

        // Каталог
        return <Route path={this.props.location.pathname} component={Catalog} />
    }
}

export default Controller;