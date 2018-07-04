import React            from 'react';
import ReactDOM         from 'react-dom';
import { canUseDOM }    from '../../lib/isomorphic';

export class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.el = document.createElement('div');
    }

    componentWillMount() {
        document.getElementById('modal-root').appendChild(this.el);
        document.body.style.overflow = 'hidden';
    }

    componentWillUnmount() {
        document.getElementById('modal-root').removeChild(this.el);
        document.body.style.overflow = '';
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
}

class Controller extends React.Component {
    render() {
        if(canUseDOM) {
            return(<Modal>{this.props.children}</Modal>) 
        } else {
            return null;
        }
    }
}

export default Controller;