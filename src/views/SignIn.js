import React        from 'react';

import Dialog       from 'material-ui/Dialog';
import {SignIn}     from '../components/utility/sign-form';

class Controller extends React.Component {
    render() {
        return(
            <Dialog>
                <SignIn />
            </Dialog>
        )
    }
}

export default Controller;