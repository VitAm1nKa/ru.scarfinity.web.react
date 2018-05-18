import React from 'react';

import {
    BasicInput,
    SearchInputGoogle
}                               from '../../utility/input';
import PhoneInput               from '../../utility/input-phone'
import RadioBoxGroup            from '../../utility/radio-box-group';
import PriceCalculation         from '../../utility/price-calculation';
import * as Grid                from '../../../lib/grid';

import './requisites.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="requisites">
                <div className="requisites-row">
                    <div className="requisites-row__left">
                        <span className="requisites-title"><b>Адрес </b>доставки</span>
                        <Grid.VerticalGrid>
                            <Grid.Row>
                                <Grid.Container className="requisites-postal-line">
                                    <Grid.Col>
                                        <SearchInputGoogle
                                            types="address"
                                            country="ru"
                                            name="address1"
                                            value={this.props.fieldValue("address1")}
                                            valid={this.props.fieldValid("address1")}
                                            placeholder="Введите адрес"
                                            onChange={this.props.onValueChange}
                                            onPlaceChanged={this.props.onAddressChange}/>
                                    </Grid.Col>
                                    <Grid.Col>
                                        <p className="requisites-annotaion">
                                            {"Вводите адрес "}<span className="accent">одной</span>{" строкой. Не обязательно указывать страну, достаточно просто ввести улицу и номер дома. Например: "}
                                            <i><b>{"Дягтерева 19/1"}</b></i>
                                        </p>
                                    </Grid.Col>
                                    <Grid.Col lg={5}>
                                        <BasicInput
                                            value={this.props.fieldValue("postalCode")}
                                            valid={this.props.fieldValid("postalCode")}
                                            name="postalCode"
                                            type="text"
                                            placeholder="Индекс"
                                            onChange={this.props.onValueChange}/>
                                    </Grid.Col>
                                    <Grid.Col lg={11}>
                                        <p className="requisites-annotaion">
                                            {'Обязательно проверте, правельно ли определен '}
                                            <span className="accent">индекс</span>
                                            {'. Если индекс не определился, введите его сами.'}
                                        </p>
                                    </Grid.Col>
                                    <Grid.Col lg={4}>
                                        <BasicInput
                                            value={this.props.fieldValue("side")}
                                            name="side"
                                            type="text"
                                            placeholder="Корпус"
                                            onChange={this.props.onValueChange}/>
                                    </Grid.Col>
                                    <Grid.Col lg={4}>
                                        <BasicInput
                                            value={this.props.fieldValue("apartments")}
                                            name="apartments"
                                            type="text"
                                            placeholder="Квартира"
                                            onChange={this.props.onValueChange}/>
                                    </Grid.Col>
                                    <Grid.Col lg={8}>
                                        <p className="requisites-annotaion">
                                            {'Укажите корпус и номер квартиры. Поля не обязательны к заполнению.'}
                                        </p>
                                    </Grid.Col>
                                </Grid.Container>
                            </Grid.Row>
                            <RadioBoxGroup
                                title={"Способы доставки"}
                                items={_.map(this.props.shipMethods, shipMethod => ({
                                    id: shipMethod.id,
                                    title: shipMethod.title,
                                    price: shipMethod.shipBase,
                                    subTitle: shipMethod.deliveryDue 
                                }))}
                                loading={this.props.shipMethodsFetch}
                                name="shipMethodId"
                                value={this.props.fieldValue("shipMethodId")}
                                valid={this.props.fieldValid("shipMethodId")}
                                onChange={this.props.onValueChange}/>
                        </Grid.VerticalGrid>
                    </div>
                    <div className="requisites-row__middle requisites-row__middle--delim"></div>
                    <div className="requisites-row__right">
                        <span className="requisites-title"><b>Контактная </b>информация</span>
                        <BasicInput
                            value={this.props.fieldValue("lastname")}
                            valid={this.props.fieldValid("lastname")}
                            name="lastname"
                            type="text"
                            placeholder="Фамилия"
                            onChange={this.props.onValueChange}/>
                        <BasicInput
                            value={this.props.fieldValue("firstname")}
                            valid={this.props.fieldValid("firstname")}
                            name="firstname"
                            type="text"
                            placeholder="Имя"
                            onChange={this.props.onValueChange}/>
                        <BasicInput
                            value={this.props.fieldValue("email")}
                            valid={this.props.fieldValid("email")}
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            onChange={this.props.onValueChange}/>
                        <PhoneInput
                            name="phone"
                            value={this.props.fieldValue("phone")}
                            valid={this.props.fieldValid("phone")}
                            placeholder="Телефон"
                            onChange={this.props.onValueChange}/>
                        <PriceCalculation
                            productsTotal={this.props.productsTotal}
                            deliveryTotal={this.props.deliveryTotal}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Controller;