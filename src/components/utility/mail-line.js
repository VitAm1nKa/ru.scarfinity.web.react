import React        from 'react';
import * as Grid    from '../../lib/grid';
import {
    BasicInput
}                   from './input';
import {
    BasicButton
}                   from './buttons';

import './mail-line.less';

class View extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: props.email
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState({
            email: value
        })
    }

    handleSubmit() {
        if(this.props.handleSubmit) {
            this.props.handleSubmit();
        }

        this.setState({
            email: ''
        });
    }

    render() {
        return(
            <div className="mail-line">
                <div className="mail-line__line"></div>
                <Grid.Row 
                    className="mail-line__body">
                        <Grid.Container>
                            <Grid.Col lg={2}></Grid.Col>
                            <Grid.Col lg={4}>
                                <div className="mail-line__banner-container">
                                    <div className="mail-line__banner">
                                        <div className="mail-line__banner__top">
                                            <span className="mail-line__blue">{"Новости"}</span>
                                            <span>{"&"}</span>
                                            <span className="mail-line__green">{"Скидка 10%"}</span>
                                        </div>
                                        <div className="mail-line__banner__bottom">
                                            {"подпишитесь на рассылку"}
                                        </div>
                                    </div>
                                </div>
                            </Grid.Col>
                            <Grid.Col lg={5}>
                                <BasicInput 
                                    type={"email"}
                                    placeholder={"Введите Ваш e-mail"}
                                    onChange={this.handleChange}
                                    value={this.state.email}/>
                            </Grid.Col>
                            <Grid.Col lg={3}>
                                <BasicButton
                                    title={"Подписаться"}
                                    color={"orange"}
                                    onClick={this.handleSubmit}/>
                            </Grid.Col>
                            <Grid.Col lg={2}></Grid.Col>
                        </Grid.Container>
                </Grid.Row>
            </div>
        )
    }
}

export default View;