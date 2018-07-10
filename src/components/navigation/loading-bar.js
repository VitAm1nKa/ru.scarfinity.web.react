import React            from 'react';
import { connect }      from 'react-redux';
import LoadingBar       from '../utility/loading-bar';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("FASDFASDFASDFASDFASDF", this.props);

        return(
            <LoadingBar progress={this.props.pageLoadingProgress} />
        )
    }
}

export default connect(state => ({
    pageLoading: state.navigation.pageLoading,
    pageLoadingProgress: state.navigation.pageLoadingProgress,
    nav: state.navigation
}))(Controller);