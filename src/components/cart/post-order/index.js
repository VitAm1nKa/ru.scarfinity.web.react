import React    from 'react';

import {
    BasicButton
}               from '../../utility/buttons';       

import './post-order.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // После завершения маунтинга компонента, необходимо выполнить метод оформления заказа
        this.props.onPostOrder();
    }

    render() {
        var status = "Ничего";

        if(this.props.post) {
            status = "Обработка заказа";
        } else {
            if(this.props.postError == true) {
                status = <div>
                    <h1>{"Ошибка"}</h1>
                    <h3>{this.props.postErrorCode}</h3>
                    <p>{this.props.postErrorMessage}</p>
                    <BasicButton
                        title="Повторить попытку"
                        onClick={this.props.onPostOrder}/>
                </div>
            } else {
                if(this.props.salesOrder != null)
                    status = <div>
                        <h1>{"Заказ успешно размещен"}</h1>
                        <h3>{`Номер заказа: ${this.props.salesOrder.salesOrderNumber}`}</h3>
                    </div>
                else
                    status = "Ничего"
            }
        }

        return <div className="post-order">{status}</div>
    }
}

export default Controller;