import React from 'react';
import Modal from './modal';

import './dialog.less';

class Controller extends React.Component {
    render() {
        const dialog = this.props.open ? (
            <Modal>
                <div
                    className="dialog"
                    onClick={this.props.onCloseRequest}>
                        <div className="dialog__container" onClick={e => e.stopPropagation()}>
                            {this.props.children}
                        </div>
                </div>
            </Modal>
        ) : null;

        return dialog;
    }
}

export default Controller;