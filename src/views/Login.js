import React        from 'react';
import { connect }  from 'react-redux';
import sha1         from 'sha1';
import * as Grid    from '../lib/grid';
import qs           from 'qs';

import {
    actionCreators as AccountActions
}                   from '../store/account';
import __request    from '../store/__request';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: 'user20020159@mail.ru',
            password: '1qaz@WSX',
            password2: '1qaz@WSX',
            vkAuthUri: '/'
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleVkAuth = this.handleVkAuth.bind(this);
        this.vkAuthorization = this.vkAuthorization.bind(this);
    }

    componentWillMount() {
        // Получение данных об сроке атентификации ВК
        /*const query = qs.stringify({ redirect: 'http://192.168.1.198:8095/#/login/' }, { addQueryPrefix: true });
            const url = "http://oauth.vk.com/authorize?client_id=6471031&redirect_uri=http://192.168.1.198:8095/#/login&display=popup&response_type=code";
            const request =
                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                    mode: 'cors'
                })
                .then(response => response.json())
                .then(({type, message, data}) => {
                    if(type == 'success') {
                        console.log(data);
                        this.setState({vkAuthUri: data});
                    }
                });*/
        console.log(this.props);
        this.setState({vkAuthUri: 'http://oauth.vk.com/authorize?client_id=6471031&redirect_uri=http://192.168.1.198:8095/%23/login&display=popup&response_type=code'});
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleClear() {
        this.setState({
            email: '',
            password: '',
            password2: ''
        });
    }

    handleSignIn() {
        if(this.state.email != '') {
            if(this.state.password != '' && this.state.password2 != '' && this.state.password == this.state.password2) {
                this.props.signIn({
                    email: this.state.email,
                    password: sha1(this.state.password)
                })
            }
        }
    }

    handleSignOut() {
        this.props.signOut();
    }

    handleVkAuth() {
        this.vkAuthorization();
    }

    vkAuthorization(uri = null) {
        if(uri == null) {
            //  encodeURI(`http://localhost:50146/api/token/VKAuthUrl?redirect=${"http://192.168.1.198:8095/#/login"}`);
            const query = qs.stringify({ redirect: 'http://192.168.1.198:8095/#/login' }, { addQueryPrefix: true });
            const url = `http://localhost:50146/api/token/VKAuth${query}`;
            console.log(url);
            const request =
                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                    mode: 'cors'
                })
                .then(response => response.json())
                .then(({type, message, data}) => {
                    if(type == 'success') {
                        console.log('vkAuthorization: success', data);
                        this.vkAuthorization(data);
                    }
                })
        } else {
            console.log('vkAuthorization: has uri', uri);
            fetch(uri);
        }
    }

    render() {
        const userEmail = localStorage.getItem("user-email");
        const userToken = localStorage.getItem("user-token");

        return(
            <Grid.Row>
                <Grid.Container>
                    <Grid.Col>
                        <div className="login">
                            <ul>
                                <li>{`LocalStorage: UserEmail: ${userEmail}`}</li>
                                <li className="login__token">{`LocalStorage: UserToken: ${userToken}`}</li>
                            </ul>
                            {
                                this.props.account.signInError &&
                                <p>{this.props.account.signInError.message}</p>
                            }
                            <input name="email" placeholder="e-mail" value={this.state.email} onChange={this.handleChange}/>
                            <input name="password" type="password" placeholder="password" value={this.state.password} onChange={this.handleChange}/>
                            <input name="password2" type="password" placeholder="confirm password" value={this.state.password2} onChange={this.handleChange}/>
                            <button onClick={this.handleClear}>{"Clear"}</button>
                            <button onClick={this.handleSignIn}>{"SignIn"}</button>
                            <button onClick={this.handleSignOut}>{"SignOut"}</button>
                            <button onClick={this.handleVkAuth}>{"Vk Auth"}</button>
                            <a href={this.state.vkAuthUri}>{"Vk Auth"}</a>
                        </div>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

export default connect(state => ({
    account: state.account,
    user: state.user
}), Object.assign({}, AccountActions))(Controller);