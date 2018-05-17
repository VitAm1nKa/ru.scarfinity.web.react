import React        from 'react';
import { connect }  from 'react-redux';

class Controller extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>Каталог Overview</div>
        )
    }
}

const mstp = state => ({
    
})

const mdtp = (dispatch) => {
    return {
    
    }
}

export default connect(mstp, mdtp)(Controller);