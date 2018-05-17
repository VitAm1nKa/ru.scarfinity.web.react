import React        from 'react';
import NavLink      from 'react-router-dom/NavLink';
import * as Grid    from '../../lib/grid';

import './order-header.less';

class Controller extends React.Component {
    render() {
        return(
            <Grid.Row className="order-header">
                <Grid.Container>
                    <Grid.Col lg={8} className="order-header__info">
                        <ul>
                            <li><span>{"Номер заказа:"}</span>{this.props.orderNumber}</li>
                            <li><span>{"Сатус:"}</span>{this.props.orderStatus.title}</li>
                            <li><span>{"Дата:"}</span>{this.props.orderDate}</li>
                        </ul>
                    </Grid.Col>
                    <Grid.Col lg={8} className="order-header__tracker">
                        <span className="order-header__tracker__title">{"Треккер:"}</span>
                        <div className="order-header__tracker__number">
                            {
                                this.props.orderTrackerNumber ?
                                <NavLink
                                    to={'/'}
                                    className="order-header__tracker__number">
                                        {"123456789"}
                                </NavLink> : "000000000000"
                            }
                        </div>
                        <p className="order-header__tracker__info">{"Номер трекера отслеживания будет достуен после отправки заказа"}</p>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

export default Controller;