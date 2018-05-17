import React from 'react';

import Star                 from 'material-ui/svg-icons/toggle/star';
import RadioButtonChecked   from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import IconButton           from 'material-ui/IconButton';

var colors = {
    starColor: "#f6b63a",
    textColor: "#303030",
    unckecked: "#aaaaaa",
    disabled: '#d7d7d7'
}

var iconStyle = {
    width: 20,
    height: 20,
}

const RatingCheckBoxView = (props) => {
    return(
        <div className="rating-check-box">
            <Star
                style={{
                    width: 18,
                    height: 18,
                }}
                color={!props.disabled ? colors.starColor : colors.disabled}/>
            <IconButton
                style={{
                    width: 34,
                    height: 34,
                    padding: '4px 0px',
                }}
                disabled={props.disabled}
                iconStyle={iconStyle}
                onClick={props.onClick}>
                {
                    props.cheched 
                        ? <RadioButtonChecked color={colors.starColor} />
                        : <RadioButtonUnchecked color={colors.unckecked} />
                }
            </IconButton>
            <span 
                className="rating-check-box__label" 
                style={{color: !props.disabled ? colors.textColor : colors.unckecked}}
            >{props.label}</span>
        </div>
    )
}
RatingCheckBoxView.defaultProps = {
    label: "5",
    cheched: false,
    onClick: () => {},
}

export const RatingCheckBox = (props) => {
    return(
        <RatingCheckBoxView
            label={props.label}
            cheched={props.checked}
            onClick={() => {props.onClick(!props.cheched)}}/>
    )
}

export class RatinCheckBoxWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ratings: [
                { value: 5, text: "5" },
                { value: 4, text: "4+" },
                { value: 3, text: "3+" },
                { value: 2, text: "2+" },
                { value: 1, text: "1+" }
            ]
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(index) {
        if(this.props.onIndexChange != null) {
            this.props.onIndexChange(index);
        }
    }

    render() {
        return(
            <div className="rating-check-box-widget">
                {
                    _.map(this.state.ratings, (rating, index) =>
                        <RatingCheckBoxView
                            key={rating.value}
                            label={rating.text}
                            cheched={rating.value == this.props.selectedIndex}
                            disabled={this.props.maxAverageRating < rating.value}
                            onClick={() => this.handleClick(5 - index)}/>
                    )
                }
            </div>
        )
    }
}

export default RatinCheckBoxWidget;