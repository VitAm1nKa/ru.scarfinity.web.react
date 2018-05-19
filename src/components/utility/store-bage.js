import React    from 'react';
import NavLink  from 'react-router-dom/NavLink';
import { Pin }  from './icons';

import './store-bage.less';

class Controller extends React.Component {
    render() {
        return(
            <NavLink
                to={this.props.path || '/contacts'}
                className="store-bage">
                    <div className="store-bage__title">
                        <Pin />
                        <span>{this.props.store.title}</span>
                    </div>
                    <div className="store-bage__body">
                        <span className="store-bage__subtitle">{"Адрес:"}</span>
                        <p>{this.props.store.address.addressLine1}</p>
                        {
                            this.props.store.addressLine2 != '' &&
                            <p>{this.props.store.address.addressLine2}</p>
                        }
                        <span className="store-bage__subtitle">{"Часы работы:"}</span>
                        <p>{this.props.store.workPlan}</p>
                    </div>
            </NavLink>
        )
    }
}

export default Controller;