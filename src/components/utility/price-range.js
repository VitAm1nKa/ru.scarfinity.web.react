import React from 'react';

// import Utility__Currency from './Utility__Currency.jsx';
import SwapHoriz from 'material-ui/svg-icons/action/swap-horiz';

// Slider components
const PriceRangeSliderPill = (props) => {
    return(
        <div 
            style={{
                position: 'absolute',
                pointerEvents: 'none',
                top: (props.parentHeight - props.height) / 2,
                bottom: (props.parentHeight - props.height) / 2,
                left: props.parentHeight / 2,
                right: props.parentHeight / 2,
                border: '1px solid #ccc',
                background: `linear-gradient(90deg, transparent ${props.leftValue}%, ${props.color} ${props.leftValue}%, ${props.color} ${props.rightValue}%, transparent ${props.rightValue}%)`,
                borderRadius: props.height / 2,
            }}
        ></div>
    )
}
PriceRangeSliderPill.defaultProps = {
    height: 9,
    parentHeight: 0,
    leftValue: 0,
    rightValue: 90,
    color: '#d76f31',
}

const PriceRangeSliderRound = (props) => {
    return(
        <div 
            style={{
                position: 'absolute',
                pointerEvents: 'none',
                width: props.parentHeight,
                height: props.parentHeight,
                top: 0,
                left: `calc(${props.valuePosition}% - ${props.parentHeight * props.valuePosition / 100}px)`,
                borderRadius: 50,
                background: '#fefefe',
                boxShadow: `rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.20) 0px 1px 2px`,
            }}>
                <div style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    width: props.parentHeight / 3,
                    height: props.parentHeight / 3,
                    top: props.parentHeight / 3,
                    left: props.parentHeight / 3,
                    borderRadius: 50,
                    background: '#d76f31',
                    boxShadow: `inset rgba(0, 0, 0, 0.24) 0px 1px 2px`,
                }}></div>
            </div>
    )
}
PriceRangeSliderRound.defaultProps = {
    parentHeight: 0,
    valuePosition: 100,
}

const PriceRangeSlider = (props) => {
    return(
        <div
            className="price-range-widget-noselect"
            style={{
                position: 'relative',
                height: props.height,
                userFocus: 'none',
            }}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            ref={props.sliderRef}
        >{props.children}</div>
    )
}
PriceRangeSlider.defaultProps = {
    height: 40,
    sliderRef: null,
    onMouseDown: () => {},
    onTouchStart: () => {},
}

class PriceRangeSliderController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leftValue: props.leftValue,
            rightValue: props.rightValue,
            mouseDown: false,
            touchStart: false,
            height: props.height,
        }

        this.clientX = 0;
        this.sliderOffsetPosirion = 0;

        this.onValueChange = props.onValueChange;

        // mouse
        this.handleSliderMouseDown = this.handleSliderMouseDown.bind(this);
        this.handleSliderMouseUp = this.handleSliderMouseUp.bind(this);
        this.handleSliderMouseMove = this.handleSliderMouseMove.bind(this);

        // touch
        this.handleSliderTouchStart = this.handleSliderTouchStart.bind(this);
        this.handleSliderTouchMove = this.handleSliderTouchMove.bind(this);
        this.handleSliderTouchEnd = this.handleSliderTouchEnd.bind(this);
        this.handleSliderTouchCancel = this.handleSliderTouchCancel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            leftValue: nextProps.leftValue,
            rightValue: nextProps.rightValue,
        });
    }

    // utility, sort state values
    sort(a, b) {
        const keyA = a.diff;
        const keyB = b.diff;

        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    }

    getValue(callback) {
        let {width} = this.sliderRef.getBoundingClientRect();
        let {leftValue, rightValue} = this.state;

        let offsetX = this.clientX - this.sliderOffsetPosirion;

        const sliderOffset = this.state.height / 2;
        const sliderWorkWidth = width - this.state.height;
        const percent = Math.round((Math.max(Math.min(offsetX, width - sliderOffset), sliderOffset) - sliderOffset) / sliderWorkWidth * 100);

        if(Math.abs(leftValue - percent) < Math.abs(rightValue - percent))
            this.state.leftValue = percent;
        else 
            this.state.rightValue = percent;

        if(callback) callback();
    }

    setStateAction(stateData = {}) {
        this.getValue(() => {
            this.setState(stateData, () => {
                this.onValueChange({
                    leftValue: this.state.leftValue,
                    rightValue: this.state.rightValue,
                });
            });
        });
    }

    // global mouse heandler
    componentWillMount() {
        window.addEventListener("mousemove", this.handleSliderMouseMove);
        window.addEventListener("mouseup", this.handleSliderMouseUp);
        window.addEventListener("pointercancel", this.handleSliderMouseUp);
        window.addEventListener("pointerup", this.handleSliderMouseUp);

        // touches
        window.addEventListener("touchmove", this.handleSliderTouchMove);
        window.addEventListener("touchend", this.handleSliderTouchEnd);
        window.addEventListener("touchcancel", this.handleSliderTouchCancel);
    }

    componentWillUnmount() {
        window.removeEventListener("mousemove", this.handleSliderMouseMove);
        window.removeEventListener("mouseup", this.handleSliderMouseUp);
        window.removeEventListener("pointercancel", this.handleSliderMouseUp);
        window.removeEventListener("pointerup", this.handleSliderMouseUp);

        // touches
        window.removeEventListener("touchmove", this.handleSliderTouchMove);
        window.removeEventListener("touchend", this.handleSliderTouchEnd);
        window.removeEventListener("touchcancel", this.handleSliderTouchCancel);
    }

    // mouse handlers
    handleSliderMouseDown(event) {
        this.clientX = event.nativeEvent.clientX;
        this.sliderOffsetPosirion = this.clientX - event.nativeEvent.offsetX;

        this.setStateAction({mouseDown: true});
    }

    handleSliderMouseMove(event) {
        if(this.state.mouseDown) {
            this.clientX = event.clientX;
            this.setStateAction();
        }
    }

    handleSliderMouseUp(event) {
        if(this.state.mouseDown) {
            this.setState({mouseDown: false});
            this.setStateAction();
            if(this.props.onMouseUp != null) {
                this.props.onMouseUp(this.state.leftValue, this.state.rightValue);
            } 
        }
            // this.setStateAction({values: this.getValue(event), mouseDown: false});
        
    }

    // touch handlers
    handleSliderTouchStart(event) {
        this.clientX = event.touches[0].clientX;
        this.sliderOffsetPosirion = event.target.getBoundingClientRect().left
        this.setStateAction({touchStart: true});
    }

    handleSliderTouchMove(event) {
        if(this.state.touchStart) {
            this.clientX = event.touches[0].clientX;
            this.setStateAction();
        }
    }

    handleSliderTouchEnd() {
        if(this.state.touchStart)
            this.setStateAction({touchStart: false});
    }

    handleSliderTouchCancel() {
        if(this.state.touchStart)
            this.setStateAction({touchStart: false});
    }
    
    render() {
        return(
            <PriceRangeSlider
                height={this.state.height}
                sliderRef={slider => this.sliderRef = slider}
                onMouseDown={this.handleSliderMouseDown}
                onTouchStart={this.handleSliderTouchStart}>
                <PriceRangeSliderPill 
                    leftValue={this.state.leftValue} 
                    rightValue={this.state.rightValue}
                    parentHeight={this.state.height}/>
                        <PriceRangeSliderRound valuePosition={this.state.leftValue} parentHeight={this.state.height} />
                        <PriceRangeSliderRound valuePosition={this.state.rightValue} parentHeight={this.state.height} />
            </PriceRangeSlider>
        )
    }
}
PriceRangeSliderController.defaultProps = {
    leftValue: 10,
    rightValue: 20,
    height: 24,
    onValueChange: () => {},
}

// PriceRange input
const PriceRangeInput = (props) => {
    return(
        <div className="price-range-input">
            {props.value}
            {/* <Utility__Currency value={props.value} fontSize={15} noanimation/> */}
        </div>
    )
}
PriceRangeInput.defaultProps = {
    value: 700,
}

const PriceRangeWidgetView = (props) => {
    return(
        <div style={{background: "#fefefe"}}>
            <div className="price-range-widget">
                <PriceRangeSliderController
                    height={18}
                    leftValue={props.leftValue}
                    rightValue={props.rightValue}
                    onValueChange={props.onValueChange}
                    onMouseUp={props.onMouseUp}/>
                <div className="price-range-widget__body">
                    <PriceRangeInput value={props.inputLeftValue} />
                    <SwapHoriz color="#ccc" />
                    <PriceRangeInput value={props.inputRightValue} />
                </div>
            </div>
        </div>
    )
}
PriceRangeWidgetView.defaultProps = {
    leftValue: 10,
    rightValue: 90,
    inputLeftValue: 0,
    inputRightValue: 0,
    onValueChange: () => {},
}

class PriceRangeWidget extends React.Component {
    constructor(props) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(leftValue, rightValue) {
        if(this.props.onValueChange != null) {
            if(Math.max(this.props.maxValue - this.props.minValue, 0) > 0) {
                const range = this.props.maxValue - this.props.minValue;
                const valuePerPoint = range / 100;

                this.props.onValueChange({
                    leftValue: Math.floor(leftValue * valuePerPoint + this.props.minValue),
                    rightValue: Math.floor(rightValue * valuePerPoint + this.props.minValue)
                });
            }
        }
    }

    render() {
        const diff = Math.max(this.props.maxValue - this.props.minValue, 0);
        const leftValue = Math.min(Math.max(this.props.leftValue, this.props.minValue), diff);
        const rightValue = Math.min(this.props.rightValue, this.props.maxValue);
        const range = this.props.maxValue - this.props.minValue;
        const valuePerPoint = Math.max(range / 100, 1);
        const normilizeLeftValue = (leftValue - this.props.minValue) / valuePerPoint;
        const normilizeRightValue = 100 - (this.props.maxValue - rightValue) / valuePerPoint;

        return(
            <div className="price-range-widget">
                <PriceRangeSliderController
                    height={18}
                    leftValue={normilizeLeftValue}
                    rightValue={normilizeRightValue}
                    // onValueChange={this.handleValueChange}
                    onMouseUp={this.handleValueChange}/>
                <div className="price-range-widget__body">
                    <PriceRangeInput value={leftValue} />
                    <SwapHoriz color="#ccc" />
                    <PriceRangeInput value={rightValue} />
                </div>
            </div>
        )
    }
}

export default PriceRangeWidget;