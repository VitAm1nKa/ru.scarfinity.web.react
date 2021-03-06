import React                from 'react';
import { withRouter }       from 'react-router-dom'
import { connect }          from 'react-redux';
import qs                   from 'qs';
import jwtDecoder           from 'jwt-decode';
import sha1                 from 'sha1';
import { withCookies }      from 'react-cookie';

import Dialog               from '../components/utility/dialog';
import SignForm             from '../components/utility/sign-form';

import * as AccountStore    from '../store/account';
import * as CartStore       from '../store/cart';
import * as UserStore       from '../store/user';
import {
    actionCreators as ShoppingCartActions
}                           from '../store/shoppingCart';
import * as ClientData      from '../lib/client-data';


// Класс отвечающий за первоночальную загрузку всех данных об аккаунте
// Аутентификация пользователя
// Информация о пользователе
// Так же загрузка корзины

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            openCount: -1,
            type: '',
            email: '',
            password: ''
        }

        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillMount() {
        if(this.props.account.auth) {
            this.props.cookies.set('user-email', this.props.account.userEmail);
            this.props.cookies.set('user-name', this.props.account.userName);
            this.props.cookies.set('user-token', this.props.account.userToken);

            // Запросить данные о клиенте
            if(this.props.account.userInfo == null) {
                this.props.getUserInformation();
            }

            // Корзина пользователя
            // Корзина загружается только один раз, при старте приложения
            if(this.props.shoppingCart.shoppingCart == null) {
                this.props.getShoppingCart('create'); 
            }
        }

        // Редиректим приложение, без параметров для соц.аутентификации
        console.log(this.props.location);
        const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        if(query.code != null || query.lp != null) {
            this.props.history.push(`${this.props.location.pathname}${qs.stringify(_.omit(query, ['code', 'lp']), { addQueryPrefix: true })}`);
        }
    }

    componentWillReceiveProps(newProps) {
        // Анализ пути
        // Если в строке есть параметр a, значит необходимо открыть окно логина/регистрации
        const queryParams = qs.parse(newProps.location.search, {ignoreQueryPrefix: true});
        const aParam = _.trim(queryParams['a']).toLowerCase();
        const pathname = _.trimEnd(newProps.location.pathname, '/');

        if(aParam != null && aParam != '' && (aParam == 'sn' || aParam == 'su' || aParam == 'rp')) {
            if(newProps.account.signIn == true) {
                if(this.state.open == false) {
                    queryParams['a'] = undefined;
                    newProps.history.push(_.trimEnd(`${pathname}/${qs.stringify(queryParams, { addQueryPrefix: true })}`, '/'));
                } else {
                    this.handleClose();
                }
            } else if(this.state.open == false) {
                // Если форма открывается, задать параметр open и позицию в истории
                // При закрытии формы, история должна вернуться на позицию в которой была открыта
                this.setState({open: true, openCount: -1, type: aParam});
            } else if(this.state.open == true && this.state.type != aParam) {
                // Инкремент шагов истории, если меняется тип окна
                this.setState({openCount: this.state.openCount - 1, type: aParam});
            }
        } else if(this.state.open == true) {
            this.setState({open: false, openCount: -1});
        } 

        // Новый пользователь аутентифицирован
        const newUserAuth = newProps.account.auth != this.props.account.auth && newProps.account.auth == true;
        // Новый пользователь залогинин
        const newUserSignIn = newProps.account.signIn != this.props.account.signIn && newProps.account.signIn == true;

        if(newUserAuth || newUserSignIn) {
            // Получение данных пользователя
            this.props.getUserInfo();
            // Загрузка данных корзины
            this.props.getShoppingCart(true);
        }    
    }

    handleSignIn(email, password) {
        this.props.signIn({email, password: sha1(password)});
    }

    handleRegistration(email, password) {
        this.props.registration({
            name: localStorage.getItem('user-name'),
            email, password: sha1(password)
        });
    }

    handleClose() {
        console.log("Тут должно было закрыться");
        if(this.state.open == true) {
            console.warn('Close signIn. Back to:', -Math.min(Math.abs(this.state.openCount), this.props.history.length + this.state.openCount));
            this.setState({open: false, openCount: -1});
            this.props.history.go(-Math.min(Math.abs(this.state.openCount), this.props.history.length + this.state.openCount));
        }
    }

    render() {
        return null;
        // Анализ пути
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const aParam = _.trim(queryParams['a']).toLowerCase();
        const pathname = _.trimEnd(this.props.location.pathname, '/');

        const path = code => {
            queryParams['a'] = code || undefined;
            return `${pathname}/${qs.stringify(queryParams, {addQueryPrefix: true})}`
        }

        return(
            <Dialog
                open={this.state.open}
                onCloseRequest={this.handleClose}>
                    <SignForm
                        type={aParam}
                        navLinkPath={path}
                        signIn={this.props.account.signIn}
                        signInFetch={this.props.account.signInFetch}
                        signInError={this.props.account.signInError}
                        signInErrorMessages={this.props.account.signInErrorMessages}
                        registraionFetch={this.props.account.registrationFetch}
                        registrationError={this.props.account.registrationError}
                        registrationErrorMessages={this.props.account.registrationErrorMessages}
                        onSignIn={this.handleSignIn}
                        onRegistration={this.handleRegistration}
                        onClose={this.handleClose}/>
            </Dialog>
        )
    }
}

const mstp = (state, ownProps) => {
    return {
        account: state.account,
        userInfo: state.user,
        shoppingCart: state.shoppingCart
    }
}

const mdtp = Object.assign({}, 
    AccountStore.actionCreators,
    ShoppingCartActions);

export default withRouter(connect(mstp, mdtp)(withCookies(Controller)));
