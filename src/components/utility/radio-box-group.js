import React                    from 'react';
import {connect}                from 'react-redux';

import Currency                 from './currency';

import './radio-box-group.less';

const RadioIcon = (props) => {
    const styles = {
        checked: {
            outside: "#1bb869",
            inside: "#ffffff",
            round: "1bb869",
        },
        unchecked: {
            outside: "#aaaaaa",
            inside: "#ffffff",
            round: "#ffffff",
        },
    }

    const style = props.checked ? styles.checked : styles.unchecked;

    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 300 300" style={{marginRight: 10}}>
            <circle
                style={{
                    fill: style.outside,
                }}
                cx="150" cy="150" r="144"/>
            <circle
                style={{
                    fill: style.inside,
                }}
                cx="150" cy="150" r="130"/>
            <circle
                style={{
                    fill: style.round,
                    transition: 'all 0.3s ease',

                }}
                cx="150" cy="150" r="65"/>
        </svg>
    )
}
RadioIcon.defaultProps = {
    checked: false,
    size: 16,
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        if(this.props.value != value) {
            if(this.props.onChange) {
                this.props.onChange({
                    target: {
                        name: this.props.name,
                        value: value
                    }
                });
            }
        }
    }

    render() {
        const items = _.map(this.props.items, item => {
            return(
                <div
                    key={item.id}
                    className={`radio-box-group__item
                        ${item.checked ? " radio-box-group__item--selected": ""}
                        ${item.disabled ? " radio-box-group__item--disabled" : ""}`
                    }
                    onClick={() => {this.handleChange(item.id)}}>
                        <RadioIcon checked={item.id == this.props.value}/>
                        {
                            item.price != null &&
                            <Currency
                                original={item.price}
                                fontSize={15}
                                fontWeight={500} />
                        }
                        <span className="radio-box-group__item__title">{item.title}</span>
                        <span className="radio-box-group__item__duration">{item.subTitle}</span>
                </div>
            )
        });

        const loading = <div className="">
            {"Загрузка"}
        </div>

        const splashScreen = <div className="radio-box-group__splash-screen">
            {
                this.props.loading === true ? loading :
                <div className="radio-box-group__splash-screen__nothing">{"нет данных"}</div> 
            }
        </div>

        return(
            <div
                className={`radio-box-group
                ${
                    this.props.valid === true ? " radio-box-group--success" :
                    this.props.valid === false ? " radio-box-group--error" : ""
                }`}>
                <span className="radio-box-group__title">{this.props.title}</span>
                {
                    items.length > 0 ? items : splashScreen
                }
            </div>
        )
    }
}

export default Controller;
