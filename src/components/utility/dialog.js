import React        from 'react';
import { Portal }   from 'react-portal';

import './dialog.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(this.props.open == true) {
            document.body.style.overflow = 'hidden';
        }
    }

    componentWillUnmount() {
        document.body.style.overflow = '';
    }

    render() {
        return(
            <Portal>
                <div
                    className={`dialog ${this.props.open ? 'dialog--open': ''}`}
                    onClick={this.props.onCloseRequest}>
                        <div className="dialog__container" onClick={e => e.stopPropagation()}>
                            {
                                this.props.open &&
                                this.props.children
                            }
                        </div>
                </div>
            </Portal>
        )
    }
}

export default Controller;