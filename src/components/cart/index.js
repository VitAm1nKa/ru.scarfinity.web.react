import React                    from 'react';
import { 
    Switch, 
    Route,
    Redirect 
}                               from 'react-router-dom';
import { connect }              from 'react-redux';
import update                   from 'immutability-helper';
import qs                       from 'qs';
import {
    actionCreators as ShoppingCartActions
}                               from '../../store/shoppingCart';

import Paper                    from 'material-ui/Paper';

import Requisites               from './requisites';
import Products                 from './products';
import Payments                 from './payments';
import PostOrder                from './post-order';
import HeaderNavigation         from './header-navigation';
import BottomNavigation         from './bottom-navigation';

import Validate                 from '../../lib/validation';

import {
    SalesOrderPost
}                               from '../../store/__models';

import './cart.less';

class CartDataModel extends SalesOrderPost {
    constructor(model = {}) {
        super(model);

        this.validationModel = {
            'shoppingCartId': [ {type: 'required'} ],
            'address1': [ {type: 'required'} ],
            'postalCode': [ {type: 'required'} ],
            'shipMethodId': [ {type: 'required'} ],
            'firstname': [ {type: 'required'}, {type: 'regexp', value: /^[a-zа-я ,.'-]+$/i} ],
            'lastname': [ {type: 'required'}, {type: 'regexp', value: /^[a-zа-я ,.'-]+$/i} ],
            'email': [ {type: 'required'}, {type: 'email'} ],
            'phone': [ {type: 'required'}, {type: 'phone'} ],
            'paymentMethodId': [ {type: 'required'} ]
        };

        this.updateData = this.updateData.bind(this);
        this.fieldValue = this.fieldValue.bind(this);
        this.fieldValid = this.fieldValid.bind(this);
    }

    fieldValid(name) {
        return Validate(this.fieldValue(name), this.validationModel[name]);
    }

    updateData(name, value) {
        switch(name) {
            case 'shoppingCartId': this.shoppingCartId = value; break;
            case 'lastname': this.person.lastName = value; break;
            case 'firstname': this.person.firstName = value; break;
            case 'email': this.person.emailAddress.emailAddress = value; break;
            case 'phone': this.person.phoneNumber = value; break;
            case 'stateProvinceId': this.shipToAddress.stateProvinceId = value; break;
            case 'city': this.shipToAddress.city = value; break;
            case 'address1': this.shipToAddress.addressLine1 = value; break;
            case 'address2': this.shipToAddress.addressLine2 = value; break;
            case 'postalCode': this.shipToAddress.postalCode = value; break;
            case 'side': this.shipToAddress.side = value; break;
            case 'shipMethodId': this.shipMethodId = value; break;
            case 'paymentMethodId': this.paymentMethodId = value; break;
        }
    }

    fieldValue(name) {
        switch(name) {
            case 'shoppingCartId': return this.shoppingCartId;
            case 'lastname': return this.person.lastName;
            case 'firstname': return this.person.firstName;
            case 'email': return this.person.emailAddress.emailAddress;
            case 'phone': return this.person.phoneNumber;
            case 'stateProvinceId': return this.shipToAddress.stateProvinceId;
            case 'city': return this.shipToAddress.city;
            case 'address1': return this.shipToAddress.addressLine1;
            case 'address2': return this.shipToAddress.addressLine2;
            case 'postalCode': return this.shipToAddress.postalCode;
            case 'side': return this.shipToAddress.side;
            case 'shipMethodId': return this.shipMethodId;
            case 'paymentMethodId': return this.paymentMethodId;
        }
    }

    validate(type) {
        const fields = {
            'products': ['shoppingCartId'],
            'requisites': ['lastname', 'firstname', 'email', 'phone', 'address1', 'postalCode', 'shipMethodId'],
            'payments': ['paymentMethodId'],
            '': []
        }

        return _.reduce(fields[type || ''], (s, n) => s && this.fieldValid(n), true);
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        // Необходимо хранить информацию о вводимых пользователем данных локально
        // 
        // Информация о товарах, находящихся в корзине хранится в Redux стейте
        // Информация об адресе доставки хранится в локальном стейте
        // Информация персоональные данные хранится в локальном стейте
        // Информация об способе доставки хранится в локальном стейте
        // Информация об способе оплаты хранится в локальном стейте

        // Переменная, в которой хранится состояние данных, вводимых пользователем
        this.cartDataModel = new CartDataModel({orderType: 'r'});

        this.handleStep = this.handleStep.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);

        this.postOrder = this.postOrder.bind(this);
    }

    componentWillMount() {
        // Базовые загрузки данный
        // Необходимо получить информацию о способох доставки(базовых)
        this.props.getShipMethods();
    }

    componentWillReceiveProps(nextProps) {
        // Есть вероятность что данные о корзине не сразу прогрузятся
        // Поэтому, обновить инфо в локальном стейте об id корзины
        if(this.cartDataModel.fieldValue('shoppingCartId') == null && nextProps.shoppingCartStore.shoppingCart != null && nextProps.shoppingCartStore.loading == false) {
            this.cartDataModel.updateData('shoppingCartId', nextProps.shoppingCartStore.shoppingCart.shoppingCartId);
        }  
    }

    getShipMethodCost() {
        const shipMethod = _.find(this.props.shoppingCartStore.shipMethods, m => m.id == this.cartDataModel.fieldValue('shipMethodId'));
        return shipMethod ? shipMethod.shipBase : 0;
    }

    handleChange(event) {
        // Обновление данных в локальном стейте
        this.cartDataModel.updateData(event.target.name, event.target.value);
        
        // В случае, если обновляется срока адреса, обнулять индекс
        // Так же обнулить способ доставки
        if(event.target.name == 'address1') {
            this.cartDataModel.updateData('postalCode', '');
            this.cartDataModel.updateData('shipMethodId', null);
        }

        // Перерисовка компонента
        this.forceUpdate();
    }

    handleAddressChange(placeInfo) {
        if(placeInfo != null) {
            _.each(placeInfo.address_components, component => {
                _.each(component.types, type => {
                    // Получение индекса из информации о данном месте
                    if(type == 'postal_code') {
                        this.cartDataModel.updateData('postalCode', component.long_name);
                    }
                    // Получение информации о городе
                    if(type == 'locality') {
                        this.cartDataModel.updateData('city', component.long_name);
                    }
                    // Информация о стране
                    if(type == 'country') {
                        this.cartDataModel.updateData('stateProvinceId', component.short_name);
                    }
                })
            });

            // Получение строки адреса места
            this.cartDataModel.updateData('address1', placeInfo.formatted_address);

            // Запрос на способы доставки
            // В дальнейшем необходимо передавать в метод инфо о городе, области, стране...
            // Для точного подбора способов доставки и их стоимости
            this.props.getShipMethods();

            // Перерисовка компонента
            this.forceUpdate();
        }
    }

    handleStep(step) {
        // Функция проверяющая, можно ли попасть на данный шаг
        // Чтобы попасть на уровень с товарами, никаких проверок делать не надо
        // Чтобы попасть на уровень реквизитов, нужно пройти валидацию товаров
        // Чтобы попасть на уровень способа оплаты, нужно прости валидацию товаров и реквизитов
        const steps = {
            '': { prev: null, path: '/cart' },
            'products': { prev: null, path: '/cart' },
            'requisites': { prev: 'products', path: '/cart/requisites' },
            'payments': { prev: 'requisites', path: '/cart/payments' },
            'post': { prev: 'payments' }
        }

        if(steps[step] == null) {
            return null;
        }

        const stepValidate = (step) => {
            if(step != null) {
                const prevValidate = stepValidate(steps[step].prev);

                if(prevValidate.validate == false) {
                    return prevValidate;
                } else {
                    return {
                        validate: this.cartDataModel.validate(step),
                        redirect: steps[step].path
                    }
                }
            }

            return { validate: true };
        }

        return stepValidate(steps[step].prev);
    }

    handleQuantityChange(productId, quantity) {
        // Установка значения количества товара в корзине
        // Минимальное начение 0, максимальное значение 999
        // Для удаления товара из корзины, достаточно просто установить его количество в 0
        this.props.setProductQty(productId, Math.min(Math.max(quantity, 0), 999));
    }

    // Метод оформления заказа
    postOrder() {
        // Метод будет выполнен сразу после того, как пользователь попадет на 4 шаг
        // Он не сможет на него попать, без валидации предыдущих шагов
        // Выполенние это метода - гарантия что все данные введены

        // В случае каких либо ошибок, например отсутствия интернета, пользователь сможет повторно отправить данные
        // Он не покинет шаг отправки заказа, но и данные останутся введенными
        // И даже в том случае, если произойдет подмена данных, сервер вернет ошибку

        this.props.postSalesOrder(new SalesOrderPost(this.cartDataModel));
    }

    render() {
        // Необходимо выполнить проверку шага
        // Можно ли попать на данный шаг
        const stepValidation = this.handleStep(this.props.match.params.step || '');
        console.log(stepValidation, this.props.match.params.step);
        if(stepValidation == null)
            return <Redirect to={`/cart`} />
        if(!stepValidation.validate) 
            return <Redirect to={`${stepValidation.redirect}?v=1`} />

        // Флаг, указывающий на то, что страница отоброжена редиректом
        // А следовательно завалидирована
        const pageValidated = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).v == '1';

        // Информация о стоимости доставки, стоимости товаров, общей стоимости
        const productSubTotal = this.props.shoppingCartStore.shoppingCart.subTotal;
        const shipMethodCost = this.getShipMethodCost();

        // Страницы корзины: товары, реквизиты, способ оплаты, публикация заказа
        const products = {
            header: <HeaderNavigation step={0} />,
            body: <Products
                shoppingCart={this.props.shoppingCartStore.shoppingCart}
                onQuantityChange={this.handleQuantityChange}
                onProductRemove={this.handleProductRemove}/>,
            bottom: <BottomNavigation
                prevLink={{path: '/catalog/ladies', title: 'Вернуться к покупкам'}}
                nextLink={{path: '/cart/requisites', title: 'Доставка'}}/>
        };

        const requisites = {
            header: <HeaderNavigation step={1} />,
            body: <Requisites
                shipMethods={this.props.shoppingCartStore.shipMethods}
                shipMethodsFetch={this.props.shoppingCartStore.shipMethodsFetch}
                productsTotal={productSubTotal}
                deliveryTotal={shipMethodCost}
                fieldValue={this.cartDataModel.fieldValue}
                fieldValid={name => pageValidated ? this.cartDataModel.fieldValid(name) : null}
                onValueChange={this.handleChange}
                onAddressChange={this.handleAddressChange}/>,
            bottom: <BottomNavigation
                prevLink={{path: '/cart', title: 'Корзина'}}
                nextLink={{path: '/cart/payments', title: 'Способ оплаты'}}/>
        };

        const payments = {
            header: <HeaderNavigation step={2} />,
            body: <Payments
                fieldValue={this.cartDataModel.fieldValue}
                fieldValid={name => pageValidated ? this.cartDataModel.fieldValid(name) : null}
                onValueChange={this.handleChange}/>,
            bottom: <BottomNavigation
                orderTotal={productSubTotal + shipMethodCost}
                prevLink={{path: '/cart/requisites', title: 'Доставка'}}
                nextLink={{path: '/cart/post', title: 'Оформить заказ'}}/>
        };

        const postOrder = {
            header: null,
            body: <PostOrder
                post={this.props.shoppingCartStore.post}
                postError={this.props.shoppingCartStore.postError}
                postErrorCode={this.props.shoppingCartStore.postErrorCode}
                postErrorMessage={this.props.shoppingCartStore.postErrorMessage}
                salesOrder={this.props.shoppingCartStore.salesOrder}
                onPostOrder={this.postOrder} />,
            bottom: null
        }

        const pageRender = page => {
            return(
                <Paper
                    className="cart" 
                    zDepth={1}>
                        {page.header}
                        <div className="cart__container">{page.body}</div>
                        {page.bottom}
                </Paper>
            )
        };

        return(
            <Switch>
                <Route path='/cart' exact render={() => pageRender(products)}/>
                <Route path='/cart/requisites' exact render={() => pageRender(requisites)}/>
                <Route path='/cart/payments' exact render={() => pageRender(payments)}/>
                <Route path='/cart/post' exac render={() => pageRender(postOrder)} />
            </Switch>
        )
    }
}

export default connect((state, ownProps) => {
    return {
        shoppingCartStore: state.shoppingCart,
    }
}, Object.assign({}, ShoppingCartActions))(Controller);