import React        from 'react';
import { connect }  from 'react-redux';
import {
    Switch,
    Route,
    NavLink
}                   from 'react-router-dom';

import * as Grid    from '../lib/grid';
import {
    BreadCrumb,
    BreadCrumbs
}                   from '../components/navigation/bread-crumbs';

const Payments = (props) => {
    return(
        <div>
            <BreadCrumb seo='payments' title='Способы оплаты' />
            <h3>{"Способы оплаты"}</h3>
        </div>
    )
}

const Shipping = (props) => {
    return(
        <div>
            <BreadCrumb seo='shipping' title='Способы доставки' />
            <h3>{"Способы доставки"}</h3>
        </div>
    )
}

const Warranty = (props) => {
    return(
        <div>
            <BreadCrumb seo='warranty' title='Гарантия качества' />
            <h3>{"Гарантия качества"}</h3>
        </div>
    )
}

const Faq = (props) => {
    return(
        <div>
            <BreadCrumb seo='faq' title='Вопрос-ответ' />
            <h3>{"Вопрос-ответ"}</h3>
        </div>
    )
}

const Contacts = (props) => {
    return(
        <div>
            <BreadCrumb seo='contacts' title='Контакты' />
            <h3>{"Контакты"}</h3>
        </div>
    )
}

const About = (props) => {
    const pathname = _.trim(props.match.path, '/');
    return(
        <div>
            <BreadCrumb seo='about' title='О нас' />
            <div className="bread-navigation">
                <NavLink to={`/${pathname}/contacts`}>{"Контакты"}</NavLink>
            </div>
            <h3>{"О нас"}</h3>
            <div className="bread-container">
                <Switch>
                    <Route path={`/${pathname}/contacts`} component={Contacts}/>
                </Switch>
            </div>
        </div>
    )
}

const Help = (props) => {
    const pathname = _.trim(props.match.path, '/');
    return(
        <div>
            <BreadCrumb seo='help' title='Помощь' />
            <div className="bread-navigation">
                <NavLink to={`/${pathname}/payments`}>{"Способы оплаты"}</NavLink>
                <NavLink to={`/${pathname}/shipping`}>{"Способы доставки"}</NavLink>
                <NavLink to={`/${pathname}/warranty`}>{"Гарантия качества"}</NavLink>
            </div>
            <h3>{"Помощь"}</h3>
            <div className="bread-container">
                <Switch>
                    <Route path={`/${pathname}/payments`} component={Payments}/>
                    <Route path={`/${pathname}/shipping`} component={Shipping}/>
                    <Route path={`/${pathname}/warranty`} component={Warranty}/>
                </Switch>
            </div>
        </div>
    )
}

const Info = (props) => {
    const pathname = _.trim(props.match.path, '/');
    return(
        <div>
            <BreadCrumb seo='info' title='Информация' />
            <div className="bread-navigation">
                <NavLink to={`/${pathname}/faq`}>{"Вопрос-ответ"}</NavLink>
                <NavLink to={`/${pathname}/about`}>{"О нас"}</NavLink>
            </div>
            <h3>{"Информация"}</h3>
            <div className="bread-container">
                <Switch>
                    <Route path={`/${pathname}/faq`} component={Faq}/>
                    <Route path={`/${pathname}/about`} component={About}/>
                </Switch>
            </div>
        </div>
    )
}

//182-162-552 57

class Controller extends React.Component {
    render() {
        const pathname = 'bread';
        return(
            <Grid.Row>
                <Grid.Container>
                    <Grid.Col>
                        <div>
                            <BreadCrumb seo='bread' title='Хлебные крошки(тест)' />
                            <h3>{"Главная"}</h3>
                            <div className="bread-navigation">
                                <NavLink to={`/${pathname}/info`}>{"Иформация"}</NavLink>
                                <NavLink to={`/${pathname}/help`}>{"Помощь"}</NavLink>
                            </div>
                            <div className="bread-container">
                                <Switch>
                                    <Route path={`/${pathname}/info`} component={Info}/>
                                    <Route path={`/${pathname}/help`} component={Help}/>
                                </Switch>
                            </div>
                        </div>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

export default Controller;