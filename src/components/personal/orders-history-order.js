import React            from 'react';
import { connect }      from 'react-redux';

import * as Grid        from '../../lib/grid';
import ProductTable     from '../utility/product-table';
import OrderHeader      from '../utility/order-header';
import Stepper          from '../utility/stepper';

import { SalesOrder }   from '../../store/__models';
import {
    actionCreators as SalesOrderStore
}                       from '../../store/salesOrder';

const OrderStatusView = (props) => {
    return(
        <ul>
            <li>{props.statusId}</li>
            <li>{props.title}</li>
        </ul>
    )
}

const OrderDetailView = (props) => {
    return(
        <ul>
            <li>{props.productId}</li>
            <li>{props.orderQty}</li>
            <li>{props.unitPrice}</li>
            <li>{props.unitPriceDiscount}</li>
            <li>{props.lineTotal}</li>
        </ul>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        // Загрузка ордера
        props.getSalesOrder(props.match.params.id);
    }

    render() {
        var salesOrder = new SalesOrder(this.props.salesOrder);
        return(
            <Grid.VerticalGrid className="order-container">
                <Stepper />
                <div className="order-separate-title"><span>{"Информация о заказе"}</span></div>
                <OrderHeader
                    orderNumber={this.props.salesOrder.salesOrderId}
                    orderStatus={this.props.salesOrder.orderStatus}
                    orderDate={this.props.salesOrder.orderDate}
                    orderTrackerNumber={this.props.salesOrder.trackerNumber}/>
                <div className="order-separate-title"><span>{"Товары"}</span></div>
                <ProductTable
                    lines={this.props.salesOrder.orderDetail}
                    orderInfo={this.props.salesOrder.orderInfo}/>
                <div className="order-separate-title"><span>{"Заказчик и доставка"}</span></div>
                <Grid.Row>
                    <Grid.Container>
                        <Grid.Col lg="8">
                            <ul className="order-info-ul">
                                <li><span>{"Имя:"}</span>{"Михаил"}</li>
                                <li><span>{"Фмилия:"}</span>{"Силантьев"}</li>
                                <li><span>{"E-mail:"}</span>{"vitam1nka@hotmail.com"}</li>
                                <li><span>{"Телефон:"}</span>{"+79059521001"}</li>
                            </ul>
                        </Grid.Col>
                        <Grid.Col lg="8">
                            <ul className="order-info-ul">
                                <li><span>{"Адрес:"}</span>{this.props.salesOrder.shipToAddress.addressLine1}</li>
                                <li><span>{"Город:"}</span>{this.props.salesOrder.shipToAddress.city}</li>
                                <li><span>{"Индекс:"}</span>{this.props.salesOrder.shipToAddress.postalCode}</li>
                                <li><span>{"Способ доставки:"}</span>{"Почта россии"}</li>
                            </ul>
                        </Grid.Col>
                    </Grid.Container>
                </Grid.Row>
            </Grid.VerticalGrid>
        )
    }
}

export default connect(state => state.salesOrder, SalesOrderStore)(Controller);