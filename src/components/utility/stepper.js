import React from 'react';

import './stepper.less';

const colors = ["#f6b63a", "#ef8742", "#bf4f79", "#8869ca"];

class Controller extends React.Component {
    render() {
        return(
            <div className={`stepper st-${this.props.step}`}>
                <div className="stepper__step">
                    <div className="stepper__step__icon">
                        <span className={`stepper__step__icon__text cnt-right cl-1 ${this.props.step < 1 && 'dis'}`}>{"1"}</span>
                    </div>
                    <span className={`${this.props.step == 1 ? 'sel' : this.props.step > 1 ? 'done' : '' }`}>{"Оформление заказа"}</span>
                </div>
                <div className="stepper__gap"></div>
                <div className="stepper__step">
                    <div className="stepper__step__icon">
                        <span className={`stepper__step__icon__text cnt-left cnt-right cl-2 ${this.props.step < 2 && 'dis'}`}>{"2"}</span>
                    </div>
                    <span className={`${this.props.step == 2 ? 'sel' : this.props.step > 2 ? 'done' : '' }`}>{"Олата"}</span>
                </div>
                <div className="stepper__gap"></div>
                <div className="stepper__step">
                    <div className="stepper__step__icon">
                        <span className={`stepper__step__icon__text cnt-left cnt-right cl-3 ${this.props.step < 3 && 'dis'}`}>{"3"}</span>
                    </div>
                    <span className={`${this.props.step == 3 ? 'sel' : this.props.step > 3 ? 'done' : '' }`}>{"Отправка"}</span>
                </div>
                <div className="stepper__gap"></div>
                <div className="stepper__step">
                    <div className="stepper__step__icon">
                        <span className={`stepper__step__icon__text cnt-left cl-4 ${this.props.step < 4 && 'dis'}`}>{"4"}</span>
                    </div>
                    <span className={`${this.props.step == 4 ? 'sel' : this.props.step > 4 ? 'done' : '' }`}>{"Завершение заказа"}</span>
                </div>
            </div>
        )
    }
}
Controller.defaultProps = {
    step: 1
}

export default Controller;