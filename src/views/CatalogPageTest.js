import React        from 'react';
import { connect }  from 'react-redux';
import {
    breadCrumbsActions
}                   from '../store/navigation';

import Dialog       from '../components/utility/dialog';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false
        }

        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    openDialog() {
        this.setState({ dialogOpen: true });
    }

    closeDialog() {
        this.setState({ dialogOpen: false });
    }

    render() {
        return(
            <div>
                <button onClick={this.openDialog}>{"Open dialog"}</button>
                <Dialog
                    open={this.state.dialogOpen}
                    onCloseRequest={this.closeDialog}>
                        <div>{"Dialog"}</div>
                </Dialog>
            </div>
        )
    }
}

export const View = connect(state => ({}), breadCrumbsActions)(Controller);
export default View;