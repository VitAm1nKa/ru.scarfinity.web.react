import React        from 'react';
import {connect}    from 'react-redux';
import update       from 'immutability-helper';

import {
    BasicInput,
    PhoneInput,
    EmailInput
}                   from '../utility/input';
import {
    BasicButton
}                   from '../utility/buttons';
import {
    PageHeader
}                   from '../utility/titles';
import {
    BreadCrumb
}                   from '../navigation/bread-crumbs';

import Paper        from 'material-ui/Paper';

import Validate     from '../../lib/validation';
import * as Grid    from '../../lib/grid';

class Controller extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const inputName = event.target.name;
        const inputValue = event.target.value;
    }

    render() {
        return(
            <Grid.VerticalGrid>
                <BreadCrumb seo='change-password' title='Сменить пароль'/>
                <PageHeader title="Сменить пароль"/>  
                <Paper className="personal-paper">
                </Paper>
            </Grid.VerticalGrid>
        )
    }
}

export default connect(
    state => state.person
)(Controller);