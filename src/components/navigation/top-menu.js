import React        from 'react';
import NavLink      from 'react-router-dom/NavLink';
import qs           from 'qs';
import * as Grid    from '../../lib/grid';

import Logo         from "../utility/logo";
import ContactUs    from "../utility/contact-us";
import {
    Search
}                   from '../utility/input';
import {
    Heart,
    Person
}                   from '../utility/icons';

const TopMenu = (props) => {
    const queryParams = qs.parse(props.location.search, {ignoreQueryPrefix: true});
    const pathName = _.trimEnd(props.location.pathname, '/');
    const signInPath = `${pathName}/${qs.stringify(Object.assign({}, queryParams, {a: 'sn'}), {addQueryPrefix: true})}`;
    const signUpPath = `${pathName}/${qs.stringify(Object.assign({}, queryParams, {a: 'su'}), {addQueryPrefix: true})}`;

    return(
        <Grid.Row className="top-menu">
            <Grid.Container style={{alignItems: 'center'}}>
                <Grid.Col lg={3} md={3}>
                    <Logo />
                </Grid.Col>
                <Grid.Col lg={3} md={3}>
                    <ContactUs />
                </Grid.Col>
                <Grid.Col lg={6} md={6}>
                    <Search
                        placeholder={"Поиск по сайту"}/>
                </Grid.Col>
                <Grid.Col lg={4} md={4} className="top-menu__right">
                    <NavLink
                        to={'/cart/wishlist'}
                        className="top-menu-favorite">
                            <div className="top-menu-favorite__icon">
                                <Heart />
                                <span className="top-menu-favorite__icon__bage">{props.favorite || 0}</span>
                            </div>
                            <p>
                                {"Список"}<br />{"желаний"}
                            </p>
                    </NavLink>
                    <div className="top-menu-account">
                        <div className="top-menu-account__icon">
                            <Person />
                        </div>
                        <div className="top-menu-account__content">
                            <div>
                                <NavLink to={signInPath}>{"Вход"}</NavLink>
                                <span className="top-menu-account__content__delim">{"|"}</span>
                                <NavLink to={signUpPath}>{"Регистрация"}</NavLink>
                            </div>
                            <NavLink to={'/'}>{"Мой аккаунт"}</NavLink>
                        </div>
                    </div>
                </Grid.Col>
            </Grid.Container>
        </Grid.Row>
    )
}

export default TopMenu;