import React            from 'react';

import { GrayButton }   from './buttons';
import Currency         from './currency';
import ImageContainer   from './image-container';
import {
    VerticalGrid
}                       from '../../lib/grid';

import './special-offer.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            remainig: this.props.end - Date.now()
        }

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        this.setState({remainig: this.props.end - Date.now()});
    }

    render() {
        var s = this.state.remainig;
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var seconds = s % 60;
        s = (s - seconds) / 60;
        var minutes = s % 60;
        var hours = (s - minutes) / 60;
        var timeString = `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;

        return(
            <div className="special-offer">
                <div className="special-offer__content">
                    <div className="special-offer-timer">
                        {"Истекает через:"}
                        <span className="special-offer-timer__time">{timeString}</span>
                    </div>
                    <div className="special-offer-image">
                        <ImageContainer imageUrl={'http://192.168.1.198:55139/uploads/a3/69/1eade4a2-b695-4d21-9f20-4ab583525b2d.jpg'}/>
                    </div>
                    <div className="special-offer-body">
                        <div className="special-offer-timer special-offer-timer--horisontal">
                            {"Истекает через:"}
                            <span className="special-offer-timer__time">{timeString}</span>
                        </div>
                        <span className="special-offer-title">{"Шарф платок палантин"}</span>
                        <div className="special-offer-price">
                            <div className="special-offer-price__info">
                                <span className="special-offer-price__info__header">{"Цена"}</span>
                                <span className="special-offer-price__info__content">
                                    <Currency
                                        original={3294}
                                        fontSize={15}
                                        glyphFull/>
                                </span>
                            </div>
                            <div className="special-offer-price__price">
                                <Currency
                                    original={899}
                                    fontSize={20}
                                    fontWeight={500}
                                    glyphFull/>
                            </div>
                            <div className="special-offer-price__info">
                                <span className="special-offer-price__info__header">{"Экономия"}</span>
                                <span className="special-offer-price__info__content">
                                    <Currency
                                        original={3294 - 899}
                                        fontSize={15}
                                        glyphFull/>
                                </span>
                            </div>
                        </div>
                        <div className="special-offer-button">
                            <GrayButton title={"В корзину"} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Controller;