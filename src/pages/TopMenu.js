import React        from 'react';
import { connect }  from 'react-redux';

import TopMenu      from '../components/navigation/top-menu';

class Controller extends React.Component {
    componentWillMount() {

    }

    componentWillReceiveProps(newProps) {

    }

    render() {
        return(
            <TopMenu
                login={this.props.account.login}
                userId={this.props.userInfo.userId}/>
        )
    }
}

const mstp = (state, ownProps) => {
    return {
        account: state.account,
        userInfo: state.user
    }
}

const mdtp = Object.assign({});

export default connect(mstp, mdtp)(Controller);