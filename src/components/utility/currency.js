import React from 'react';

class ChangeValueController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.value != this.state.value) {
            if(this.props.unmutable || newProps.unmutable) {
                return changeValue(newProps.value);
            }

            this.setState({value: newProps.value});
        }
    }

    changeValue({value}) {
        if(!this.props.unmutable) {
            if(!this.props.noanimation) {
                if(value != null && typeof(value) === 'number') {
                    if(value >= 0) {
                        let oldValue = this.state.value;
                        if(oldValue != value) {
                            let tickValue = (value - oldValue) / 30.0;
                            let iteration = 1;
                            let interval = setInterval(() => {
                                this.setState({ value: oldValue + Math.floor(iteration++ * tickValue) });
                                if(iteration > 30) {
                                    clearInterval(interval);
                                }
                            }, 10);
                        }
                    }
                }
            } else {
                this.setState({value});
            }
        }
    }

    render() {
        return(
            <div className={this.props.className} style={this.props.style}>{this.state.value}</div>
        )
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    currencyGlyph(currency) {
        switch(currency) {
            case "rub": return '₽';
            case "usd": return '$';
            case "eur": return '€';
            default: return '₽';
        }
    }

    sizeStyle(size) {
        switch(size) {
            case "xsmall": return "utility__currency--xsmall";
            case "small": return "utility__currency--small";
            case "medium": return "utility__currency--medium";
            case "large": return "utility__currency--large";
            case "xlarge": return "utility__currency--xlarge";
            case "xxlarge": return "utility__currency--xxlarge";
            case "xxxlarge": return "utility__currency--xxxlarge";
            default: return "utility__currency--medium";
        }
    }

    render() {
        return (
            <div 
                className={`utility__currency${
                    this.props.accent ? " utility__currency--accent" : ""}${
                    this.props.size ? ` ${this.sizeStyle(this.props.size)}` : ""    
                }`}
                style={{
                    fontSize: this.props.fontSize || 14,
                    fontWeight: this.props.fontWeight || 400
                }}>
                    <div className="utility__currency__conteiner">
                        <ChangeValueController
                            className={`utility__currency__value${this.props.glyphFull ? ' utility__currency__value--full' : ''}`}
                            value={this.props.sale || this.props.original}
                            style={{color: this.props.fontColor}}/>
                        {
                            this.props.sale != null && this.props.sale != 0 &&
                            <ChangeValueController
                                className="utility__currency__unsale-value"
                                value={this.props.original} />
                        }
                    </div>
                    <span className="utility__currency__subtitle">{this.props.subtitle}</span>
            </div>
        );
    }
}

export default Controller;