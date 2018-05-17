import React from 'react';

import { fetch, addTask }   from 'domain-task';
import __request            from '../store/__request';
import update               from 'immutability-helper';

import Layout               from './__layout';

import Paper                from 'material-ui/Paper';

const OrderProductLine = (props) => {
    return(
        <ul>
            {
                _.map(props.items, item =>
                    <li key={item.productId}>
                        {`Модель: ${item.productId} Количество: ${item.quantity}`}
                    </li>
                )
            }
        </ul>
    )
}

const OrderLine = (props) => {
    const {productList} = props;
    const created = (new Date(props.created)).toLocaleString();
    const modified = (new Date(props.lastModified)).toLocaleString();
    return(
        <tr>
            <td>{props.orderId}</td>
            <td><OrderProductLine items={productList} /></td>
            <td>{created}</td>
            <td>{modified}</td>
        </tr>
    )
}

const OrderTable = (props) => {
    return(
        <table>
            <thead>
                <tr>
                    <th>Номер</th>
                    <th>Инфо</th>
                    <th>Создан</th>
                    <th>Изменен</th>
                </tr>
            </thead>
            <tbody>
                {
                    _.map(props.orders, item =>
                        <OrderLine
                            key={item.orderId}
                            {...item}/>
                    )
                }
            </tbody>
        </table>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orders: []
        }
    }

    componentWillMount() {
        __request({
            method: 'GET',
            url: `api/order`
        })
        .then(response => response.json())
        .then(({type, data}) => {
            this.setState({
                orders: update(this.state.orders, {$set: data})
            });
        });
    }

    render() {
        return(
            <Layout title={"Заказы(все)"}>
                <OrderTable
                    orders={this.state.orders}/>
            </Layout>
        )
    }
}

export default Controller;