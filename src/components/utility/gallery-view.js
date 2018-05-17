import React    from 'react';
import Dialog   from 'material-ui/Dialog';
import {
    NavLink
}               from 'react-router-dom';

import './gallery-view.less';

class Controller extends React.Component {
    render() {
        return(
            <Dialog
                bodyClassName="gallery-view-body"
                contentClassName="gallery-view-content"
                paperClassName="gallery-view-transparent"
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.onClose}>
                    <div
                        className="gallery-view-container">
                            <div className="gallery-view-container__container">
                                {this.props.children}
                            </div>
                    </div>
            </Dialog>
        )
    }
}

export default Controller;