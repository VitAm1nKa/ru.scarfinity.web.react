import React            from 'react';

import * as Grid        from '../../lib/grid';
import ProductTable     from '../utility/product-table';
import OrderHeader      from '../utility/order-header';
import Stepper          from '../utility/stepper';

import { SalesOrder }   from '../../models/SalesOrder';
import { __salesOrder } from '../../store/api-requests';

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

        this.state = {
            salesOrderFetch: false,
            salesOrder: null,
            salesOrderError: null
        }

        this.reloadSalesOrder = this.reloadSalesOrder.bind(this);
    }

    componentWillMount() {
        this.reloadSalesOrder(this.props.match.params.salesOrderId);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.salesOrderId != nextProps.match.params.salesOrderId) {
            this.reloadSalesOrder(nextProps.match.params.salesOrderId);
        }
    }

    reloadSalesOrder(salesOrderId) {
        if(!this.salesOrderFetch) {
            this.setState({
                salesOrderFetch: true,
                salesOrderError: null
            }, () => {
                __salesOrder.Get.Single(salesOrderId)(data => {
                    this.setState({
                        salesOrderFetch: false,
                        salesOrder: new SalesOrder(data)
                    })
                }, error => {
                    this.setState({
                        salesOrderFetch: false,
                        salesOrderError: `Error: [${error.type}][${error.message}]`
                    })
                });
            })
        }
    }

    render() {
        if(this.state.salesOrderFetch) {
            return (<div>{"Loading..."}</div>);
        } else if(this.state.salesOrderError != null) {
            return (<div>{"Load error: " + this.state.salesOrderError}</div>);
        } else {
            return(
                <Grid.VerticalGrid className="order-container">
                    <Stepper />
                    <div className="order-separate-title"><span>{"Информация о заказе"}</span></div>
                    <OrderHeader
                        orderNumber={this.state.salesOrder.salesOrderId}
                        orderStatus={this.state.salesOrder.orderStatus}
                        orderDate={this.state.salesOrder.orderDate}
                        orderTrackerNumber={this.state.salesOrder.trackerNumber}/>
                    <div className="order-separate-title"><span>{"Товары"}</span></div>
                    <ProductTable
                        lines={this.state.salesOrder.orderDetail}
                        orderInfo={this.state.salesOrder.orderInfo}/>
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
                                    <li><span>{"Адрес:"}</span>{this.state.salesOrder.shipToAddress.addressLine1}</li>
                                    <li><span>{"Город:"}</span>{this.state.salesOrder.shipToAddress.city}</li>
                                    <li><span>{"Индекс:"}</span>{this.state.salesOrder.shipToAddress.postalCode}</li>
                                    <li><span>{"Способ доставки:"}</span>{"Почта россии"}</li>
                                </ul>
                            </Grid.Col>
                        </Grid.Container>
                    </Grid.Row>
                </Grid.VerticalGrid>
            )
        }
    }
}

export default Controller;