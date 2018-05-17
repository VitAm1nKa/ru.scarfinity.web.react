import React            from 'react';
import NavLink          from 'react-router-dom/NavLink';
import { Cross }        from './icons';

import {
    VerticalGrid
}                       from '../../lib/grid';
import Paper            from 'material-ui/Paper';
import CheckBox         from './check-box';
import {
    InputSignMail,
    InputSignPassword
}                       from './input';
import OverlayLoader    from './loader';

import './sign-form.less';

const SignBody = (props) => {
    return(
        <Paper className="sign-in">
            <div className="sign-in__header">
                <span className="sign-in__header__title">{props.title}</span>
                <NavLink
                    to={props.actionPath}
                    className="sign-in__header__action">
                        {props.action}
                </NavLink>
            </div>
            <div className="sign-in__body">
                {props.children}
            </div>
            <div
                className="sign-in__close"
                onClick={props.onClose}>
                    <Cross />
            </div>
        </Paper>
    )
}

const leadingZero = value => `0${value}`.slice(-2);

const autouser = () => {
    const date = new Date(Date.now());
    return `user${leadingZero(date.getDate())}${leadingZero(date.getMonth())}${leadingZero(date.getFullYear())}${leadingZero(date.getHours())}${leadingZero(date.getMinutes())}@mail.ru`;
}

const emailV = (email) => 
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: autouser(),
            password: '1234',
            password2: '1234',
            remember: false,
            errors: [],
            validate: false
        }

        this.validationModel = {
            'email': [ {type: 'required'}, {type: 'email'} ],
            'password': [ {type: 'required'}, {type: 'length', value: 18} ],
            'password2': [ {type: 'required'} ]
        };

        this.navigation = {
            sn: {
                title: 'Вход',
                actionTitle: 'Зарегистрироваться',
                actionPath: 'su',
                buttonTitle: 'Войти'
            },
            su: {
                title: 'Регистрация',
                actionTitle: 'Вход',
                actionPath: 'sn',
                buttonTitle: 'Зарегистрироваться'
            },
            rp: {
                title: 'Восстановить пароль',
                actionTitle: 'Вход',
                actionPath: 'sn',
                buttonTitle: 'Восстановить'
            },
            default: {
                title: '',
                actionTitle: '',
                actionPath: '',
                buttonTitle: ''
            }
        }

        this.valid = this.valid.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validate() {
        const errors = [];

        if(this.state.email == null || this.state.email.length == 0)
            errors.push({for: 'email', message: 'Введите email'});
        else if(emailV(this.state.email) == false)
            errors.push({for: 'email', message: 'Неверно введен email'});

        if(this.props.type == 'sn' || this.props.type == 'su') {
            if(this.state.password == null || this.state.password.length == 0)
                errors.push({for: 'password', message: 'Введите пароль'});
        }

        if(this.props.type == 'su') {
            if(this.state.password2 == null || this.state.password2.length == 0)
                errors.push({for: 'password2', message: 'Повторите пароль'});
            else if(this.state.password != this.state.password2) 
                errors.push({for: 'password2', message: 'Пароли не совпадают'});
        }

        this.setState({validate: true, errors });

        return errors.length == 0;
    }

    valid(name) {
        if(this.state.validate == true) {
            return _.filter(this.state.errors, e => e.for == name).length == 0;
        }

        return null;
    }

    handleSubmit() {
        if(this.validate()) {
            switch(this.props.type) {
                case 'sn': this.props.onSignIn(this.state.email, this.state.password); break;
                case 'su': this.props.onRegistration(this.state.email, this.state.password); break;
                case 'rp': break;
            }
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const naviationValues = this.navigation[this.props.type] || this.navigation.default;
        const errors = _.compact(_.concat(_.map(this.state.errors, error => error.message), this.props.signInErrorMessages, this.props.registrationErrorMessages));
        return(
            <SignBody
                title={naviationValues.title}
                action={naviationValues.actionTitle}
                actionPath={this.props.navLinkPath(naviationValues.actionPath)}
                onClose={this.props.onClose}>
                    <VerticalGrid>
                        <InputSignMail
                            value={this.state.email}
                            type="email"
                            name="email"
                            valid={this.valid('email')}
                            onChange={this.handleChange}
                            placeholder={"E-mail"}/>
                        {
                            (this.props.type == 'sn' || this.props.type == 'su') &&
                            <InputSignPassword 
                                value={this.state.password}
                                name="password"
                                valid={this.valid('password')}
                                onChange={this.handleChange}
                                placeholder={"Пароль"}/>
                        }
                        {
                            this.props.type == 'su' &&
                            <InputSignPassword 
                                value={this.state.password2}
                                name="password2"
                                valid={this.valid('password2')}
                                onChange={this.handleChange}
                                placeholder={"Повторите пароль"}/>
                        }
                        {
                            this.props.type == 'sn' &&
                            <CheckBox
                                title="Запомнить меня"
                                name="remember"
                                onChange={this.handleChange}
                                checked={this.state.remember}/>   
                        }
                        <div
                            className={`sign-in-error${errors.length > 0 ? ' open': ''}`}>
                                <div className="sign-in-error__container">
                                    {_.map(errors, (error, index) => <p key={index}>{error}</p>)}
                                </div>
                        </div>
                        <button
                            className={`button-sign-in ${this.props.type}`}
                            onClick={this.handleSubmit}>
                                {naviationValues.buttonTitle}
                        </button>
                        {
                            this.props.type == 'sn' &&
                            <NavLink
                                to={this.props.navLinkPath('rp')}
                                className="sign-in__fogPass">
                                    {"Забыли пароль?"}
                            </NavLink>
                        }
                    </VerticalGrid>
                    <OverlayLoader show={this.props.signInFetch || this.props.registrationFetch}/>
            </SignBody>
        )
    }
}
Controller.defaultProps = {
    onSignIn: () => null
}

export default Controller;