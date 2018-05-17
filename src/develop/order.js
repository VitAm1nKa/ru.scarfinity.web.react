import React from 'react';

import { fetch, addTask }   from 'domain-task';
import __request            from '../store/__request';
import update               from 'immutability-helper';

import Layout               from './__layout';

const ProductTableRow = (props) => {
    const quantity = props.quantity || 0;
    const price = props.price || 0;
    return(
        <tr>
            <td>{props.productTitle}</td>
            <td>{props.productModel}</td>
            <td>{quantity}</td>
            <td>{price}</td>
            <td>{quantity * price}</td>
        </tr>
    )
}

const ProductTable = (props) => {
    return(
        <table>
            <thead>
                <tr>
                    <th>Товар</th>
                    <th>Модель</th>
                    <th>Количество</th>
                    <th>Цена за ед.</th>
                    <th>Сумма</th>
                </tr>
            </thead>
            <tbody>
                {
                    _.map(props.products, item =>
                        <ProductTableRow
                            key={item.productId}
                            {...item} />
                    )
                }
                <tr>
                    <td colSpan={4} style={{textAlign: "right"}}>{"Подитог"}</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td colSpan={4} style={{textAlign: "right"}}>{"Доставка"}</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td colSpan={4} style={{textAlign: "right"}}>{"Итого"}</td>
                    <td>0</td>
                </tr>
            </tbody>
        </table>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orderInfo: {}
        }
    }

    componentWillMount() {
        __request({
            method: 'GET',
            url: `api/order/${this.orderNumber()}`
        })
        .then(response => response.json())
        .then(({type, data}) => {
            this.setState({
                orderInfo: data
            });
        });
    }

    orderNumber() {
        return this.props.match.params.id;
    }

    render() {
        return(
            <Layout title={`Заказ (#${this.orderNumber()})`}>
                <ProductTable products={this.state.orderInfo.productList}/>
            </Layout>
        )
    }
}

export default Controller;