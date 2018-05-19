import React        from 'react';
import * as Grid    from '../../lib/grid';
import NavLink      from 'react-router-dom/NavLink';
import Currency     from './currency';

import './order-card.less';

class Controller extends React.Component {
    render() {
        let orderStatusClass = "order-card__status";
        switch(this.props.salesOrder.orderStatus.statusId) {
            case 1: orderStatusClass += ' order-card__status--processed'; break;
            case 5: orderStatusClass += ' order-card__status--delivered'; break;
            case 6: orderStatusClass += ' order-card__status--canceled'; break;
            default: break;
        }

        return(
            <NavLink
                className="order-card"
                to={`/personal/orders-history/${this.props.salesOrder.salesOrderId}`}>
                    <Grid.Row>
                        <Grid.Container className="order-card__container">
                            <Grid.Col lg={7} md={7} sm={7} xs={7}>
                                <span className="order-card__number">
                                    {`#${this.props.salesOrder.salesOrderNumber ||''}`}
                                </span>
                            </Grid.Col>
                            <Grid.Col lg={9} md={9} sm={9} xs={9}>
                                <span className="order-card__date">
                                    {(new Date(this.props.salesOrder.orderDate)).toLocaleDateString()}
                                </span>
                            </Grid.Col>
                            <Grid.Col className="order-card__separate">
                                <span className={orderStatusClass}>
                                    {this.props.salesOrder.orderStatus.title}
                                </span>
                            </Grid.Col>
                            <Grid.Col>
                                <ul className="order-card__info">
                                    <li><span>{"Адрес:"}</span>{this.props.salesOrder.shipToAddress.addressLine1}</li>
                                    <li><span>{"Город:"}</span>{this.props.salesOrder.shipToAddress.city}</li>
                                    <li><span>{"Индекс:"}</span>{this.props.salesOrder.shipToAddress.postalCode}</li>
                                    <li><span>{"Способ доставки:"}</span>{"Почта россии"}</li>
                                    <li><span>{"Имя:"}</span>{"Михаил"}</li>
                                    <li><span>{"Фмилия:"}</span>{"Силантьев"}</li>
                                    <li><span>{"Телефон:"}</span>{"+79059521001"}</li>
                                </ul>
                            </Grid.Col>
                            <Grid.Col>
                                <div className="order-card__total">
                                    <Currency
                                        original={this.props.salesOrder.orderInfo.totalDue}
                                        fontSize={32}
                                        fontWeight={600}/>
                                </div>
                            </Grid.Col>
                        </Grid.Container>
                    </Grid.Row>
            </NavLink>
        )
    }
}

export default Controller;