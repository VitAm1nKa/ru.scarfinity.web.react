import React        from 'react';
import { connect }  from 'react-redux';
import {
    NavLink
}                   from 'react-router-dom';
import * as Grid    from '../../lib/grid';
import Currency     from '../utility/currency';
import OrderCard    from '../utility/order-card';

import './orders-history-orders.less';

const OrderNumber = (props) => {
    return(
        <div className="order-number">
            <NavLink
                className="order-number__number"
                to={props.link}>
                    {"#" + props.salesOrderNumber}
            </NavLink>
        </div>
    )
}

const OrderStatus = (props) => {
    let orderStatusClass = "order-status";
    switch(props.statusId) {
        case 1: orderStatusClass += ' order-status--processed'; break;
        case 5: orderStatusClass += ' order-status--delivered'; break;
        case 6: orderStatusClass += ' order-status--canceled'; break;
        default: break;
    }

    return(
        <div className={orderStatusClass}>
            {props.title}
        </div>
    )
}

const OrderLineView = (props) => {
    return(
        <div className="order-line">
            <Line
                lineClassName="order-line-center"
                number={
                    <OrderNumber 
                        salesOrderNumber={props.salesOrderNumber}
                        link={`${props.basePath}/${props.salesOrderId}`}/>
                }
                status={
                    <OrderStatus {...props.orderStatus}/>
                }
                orderDate={(new Date(props.orderDate)).toLocaleDateString()}
                shipAddress={"Новосибирск новосибирск новосибирск"}
                shipType={"Почта россии"}
                totalDue={
                    <Currency
                        original={4320}
                        fontSize={15}
                        fontWeight={500}
                        glyphFull/>
                }/>
        </div>
    )
}

const Line = (props) => {
    return(
        <Grid.Row className={props.className}>
            <Grid.Container className={props.lineClassName}>
                <Grid.Col lg={2} md={2} xs={4}>{props.number}</Grid.Col>
                <Grid.Col lg={2} md={2} xs={8}>{props.status}</Grid.Col>
                <Grid.Col lg={2} md={2} xs={4}>{props.orderDate}</Grid.Col>
                <Grid.Col lg={5} md={5} xs={12}>{props.shipAddress}</Grid.Col>
                <Grid.Col lg={3} md={3} xs={12}>{props.shipType}</Grid.Col>
                <Grid.Col lg={2} md={2} xs={4}>{props.totalDue}</Grid.Col>
            </Grid.Container>
        </Grid.Row>
    )
}

const View1 = (props) => {
    return(
        <div className="orders-history-orders">
            <Line
                className="orders-history-header"
                number={"Номер заказа"}
                status={"Статус"}
                orderDate={"Дата"}
                shipAddress={"Адрес доставки"}
                shipType={"Способ доставки"}
                totalDue={"Итого"}/>
            {
                _.map(props.salesOrders, salesOrder => 
                    <OrderLineView
                        key={salesOrder.salesOrderId}
                        basePath={props.match.path}
                        {...salesOrder}/>
                )
            }
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Grid.Row>
                <Grid.Container>
                    {
                        _.map(this.props.salesOrders, salesOrder =>
                            <Grid.Col
                                key={salesOrder.salesOrderId}
                                grid={12} lg={3} md={3} sm={4} xs={12}>
                                    <OrderCard
                                        key={salesOrder.salesOrderId}
                                        salesOrder={salesOrder}/>
                            </Grid.Col>
                        )
                    }
                </Grid.Container>
            </Grid.Row>
        )
    }
}

export default connect(state => state.salesOrders)(Controller);

