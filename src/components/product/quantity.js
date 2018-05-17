import React        from 'react';

import IconButton   from 'material-ui/IconButton';
import Add          from 'material-ui/svg-icons/content/add';
import Remove       from 'material-ui/svg-icons/content/remove';

var style = {
    button: {
        width: 22, 
        height: 22, 
        padding: 3,
    },
    icon: {
        width: 16, 
        height: 16, 
        color: "#777",
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: props.quantity
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.quantity != this.state.quantity) {
            this.state.quantity = nextProps.quantity;
        }
    }

    handleChange(event) {
        var quantity = event.target.value || 0;
        var reg = /^\d+$/;
        if(/^\d+$/.test(quantity)) 
            this.setState({quantity: parseInt(quantity)});
    }

    handleKeyPress(event) {
        if(event.key === 'Enter') {
            event.target.blur();

            if(this.props.onChange)
                this.props.onChange(this.state.quantity);
        }
    }

    handleBlur() {
        if(this.props.onChange)
            this.props.onChange(this.state.quantity);
    }

    handleClick(event) {
        console.log(event.target.name);
        this.setState({
            quantity: this.state.quantity + (event.target.name == 'inc' ? 1 : -1)
        }, () => {
            if(this.props.onChange)
                this.props.onChange(this.state.quantity);
        });
    }

    render() {
        return(
            <div className="product-card-quantity">
                <input
                    className="product-card-quantity__value"
                    type="text"
                    value={this.state.quantity}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur} />
                <div className="product-card-quantity__control">
                    <div className="product-card-quantity__control__item">
                        <IconButton
                            name="dec"
                            iconStyle={style.icon} 
                            style={style.button}
                            disabled={this.state.quantity >= 999}
                            onClick={this.handleClick} >
                                <Add />
                        </IconButton>
                    </div>
                    <div className="product-card-quantity__control__item">
                        <IconButton
                            name="inc"
                            iconStyle={style.icon} 
                            style={style.button} 
                            disabled={this.state.quantity <= 0}
                            onClick={this.handleClick} >
                                <Remove />
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default Controller;
