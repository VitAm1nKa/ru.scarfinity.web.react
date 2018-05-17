import React                from 'react';
import { connect }          from 'react-redux';
import {
    Route,
    Switch,
    NavLink
}                           from 'react-router-dom';
import * as ProductState    from '../../store/product';

const ProductView = (props) => {
    const color = props.cl;
    const hue = color.substr(0, 1);
    const light = color.substr(1, 1);
    return(
        <tr>
            <td>{props.title}</td>
            <td>{props.shortDescription}</td>
            <td>{props.description}</td>
            <td>{props.art}</td>
            <td><div className={`cl hue-${hue}`}></div></td>
        </tr>
    )
}

const ProductViewInfo = (props) => {
    return(
        <div>
            <h2>{props.title}</h2>
            <h3>{props.shortDescription}</h3>
            <p>{props.description}</p>
        </div>
    )
}

class Product extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getProduct();
    }

    render() {
        const productInfo = _.find(this.props.list, x => x.cl === this.props.match.params.id);
        return(
            <div>
                <h4>Товаров сгрупированно: {this.props.list.length}</h4>
                <table>
                    <tbody>
                        <tr>
                            <td>Наименование</td>
                            <td>Кр. описание</td>
                            <td>Описание</td>
                            <td>Арт</td>
                            <td>Цвет</td>
                        </tr>
                        {
                            this.props.list &&
                            this.props.list.map((item, index) => <ProductView key={index} {...item} />)
                        }
                    </tbody>
                </table>
                <ul>
                    {
                        this.props.list &&
                        this.props.list.map((item, index) =>
                            <li key={index}><NavLink to={`/product/${item.cl}`}>{item.cl}</NavLink></li>
                        )
                    }
                </ul>
                <ProductViewInfo {...productInfo}/>
            </div>
        )
    }
}
const code = '110101-0001';
const mstp = (state, ownProps) => {
    const code = '110101-0001';
    const colorCode = ownProps.colorCode || ownProps.match.params.id;
    return {
        colorCode: ownProps.match.params.id,
        list: _.filter(state.products, x => ProductState.utilities.compareCodes(x, code))
    }
}

const mdtp = ProductState.actionCreators;

export default connect(mstp, mdtp)(Product);