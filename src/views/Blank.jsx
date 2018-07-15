import React        from 'react';
import { connect }  from 'react-redux';
import {
    sitePageActionCreators
}                   from '../store/sitePage';
import {
    valuesActionCreators
}                   from '../store/values';

class Controller extends React.Component {
    componentWillMount() {
        // this.props.taskTest();
        this.props.getSitePageInfo('allo')
            .then(() => {
                console.error('!!!!!!!!!!!!!!!!!!!!!!!'); 
            });
    }

    render() {
        return(
            <div>{'Hello world!'}</div>
        )
    }
}

export default connect(state => ({}), Object.assign({}, sitePageActionCreators, valuesActionCreators))(Controller);