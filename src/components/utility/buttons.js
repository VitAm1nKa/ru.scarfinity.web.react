import React        from 'react';
import update       from 'immutability-helper';
import {
    NavLink
}                   from 'react-router-dom';
import { Basket }   from './icons';

import LazyLoader   from './lazy-loader';

export class CatalogProductCartButton extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            processed: false
        }
        
        this.handleClick = this.handleClick.bind(this);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.processed != nextState.processed;
    }

    handleClick() {
        if(this.props.end) {
            if(this.props.completeClick != null) {
                this.props.completeClick();        
            }
        } else if(!this.state.processed) {
            this.setState({processed: true});
            setTimeout(() => this.setState({
                processed: false
            }), 700);

            if(this.props.onIddleClick != null) this.props.onIddleClick();
        }
    }

    render() {
        return(
            <button
                className={`product-card-catalog-button${
                    this.props.completed ? " complete" :
                    this.state.processed ? " loading"  : ""
                }`}
                onClick={this.handleClick}>
                {
                    this.props.completed ? this.props.completeLabel :
                    this.state.processed ? <LazyLoader size={6} />  :
                    this.props.iddleLabel
                }
            </button>
        )
    }
}

export class ProductCartButton extends React.Component {
    render() {
        return(
            <button
                className={'product-card-button'}
                disabled={this.props.inCart}
                onClick={this.props.onClick}>
                    {
                        !this.props.inCart ?
                        this.props.iddleTitle :
                        this.props.inCartTitle
                    }
                    <NavLink to='/cart'/>
            </button>
        )
    }
}

export class BasicButton extends React.Component {
    render() {

        const className = "button-basic" + (color => {
            switch(color) {
                case 'orange': return ' button-basic--orange';
                default: return '';
            }
        })(this.props.color);

        console.log(className);

        return(
            <button
                className={className}
                onClick={this.props.onClick}>
                    {this.props.title}
            </button>
        )
    }
}

export const ButtonChevronRight = (props) => {
    return(
        <NavLink to={props.to || '/'}>
            <button
                className={"button-chevron-right"}>
                    {props.title}
            </button>
        </NavLink>
    )
}

export class ProductCartButtonTest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: [],
            text: '',
            processing: false
        }

        this.queue = this.queue.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const value = (Math.random() * 2);
        this.setState({queue: [...this.state.queue, value]}, () => {
            if(this.state.processing == false) {
                this.queue(value);
            }
        });
    }

    queue(time) {
        this.setState({
            processing: true,
            text: time
        }, () => {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                const queue = _.tail(this.state.queue);
                const first = _.first(queue) || 0;
                this.setState({
                    queue, 
                    text: '',
                    processing: false
                });
    
                if(queue.length > 0) this.queue(first);
            }, time * 1000);
        })
    }

    render() {
        console.warn("render...", this.state);
        return(
            <div className="buttonTestTest">
                <div className="buttonTestTest__text">{this.state.text}</div>
                <BasicButton
                    title="Еще"
                    onClick={this.handleClick}/>
                <ol>
                    {
                        _.map(this.state.queue, (item, index) => <li key={index}>{`${item.toFixed(2)} sec`}</li>)
                    }
                </ol>
            </div>
        )
    }
}

export class GrayButton extends React.Component {
    render() {
        return(
            <div className="gray-button">
                <Basket />
                <span>{this.props.title}</span>
            </div> 
        )
    }
}