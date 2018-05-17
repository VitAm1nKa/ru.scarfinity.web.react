import React                from 'react';
import { connect }          from 'react-redux';
import qs                   from 'qs';
import jwtDecoder           from 'jwt-decode';
import sha1                 from 'sha1';
import Redirect             from 'react-router-dom/Redirect';

import Dialog               from '../components/utility/dialog';
import SignForm             from '../components/utility/sign-form';

import * as AccountStore    from '../store/account';
import * as CartStore       from '../store/cart';
import * as UserStore       from '../store/user';
import {
    actionCreators as ShoppingCartActions
}                           from '../store/shoppingCart';


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
        // Логин пользователя
        const userEmail = localStorage.getItem("user-email");
        const userToken = localStorage.getItem("user-token");

        if(userToken == null || userToken == '') {
            // Зарос на новый токен
            this.props.login(userEmail);
        } else {
            // Проверка токена
            // Проверка на тип пользователя и срок действия
            // Если срок действия не истек, просто получить информацию о пользователе
            const decoded = jwtDecoder(userToken);
            const datetime = Date.now();
            const roles = _.flatten([decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']]) || [''];
            console.log(roles);
            const role = (_.head(roles)).toUpperCase();

            if(decoded.exp * 1000 < datetime) {
                // Если срок действия истек, запросить новый токен
                // Автоматически это возможно только в случае, если пользователь анонимный
                // Если пользователь не анонимный, разлогинить данного пользователя и получить токен для анонимного
                if(role != 'ANONYMOUS') {
                    // Разлогинить польователя
                    this.props.signOut();
                } else {
                    // Иначе, получить новый токен анонимного пользователя
                    this.props.login(userEmail);
                }
            } else {
                this.props.continue(role);
            }
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
            this.props.getShoppingCart();
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
        userInfo: state.user
    }
}

const mdtp = Object.assign({}, 
    AccountStore.actionCreators,
    ShoppingCartActions,
    UserStore.actionCreators);

export default connect(mstp, mdtp)(Controller);
