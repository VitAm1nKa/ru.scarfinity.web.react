import React from 'react';

import './countdown.less';

const FlipCard = (props) => {
    return(
        <div className="cd-fc">
            <span className="cd-fc--top cd-fc--current"></span>
            <span className="cd-fc--top cd-fc--next"></span>
            <span className="cd-fc--bottom cd-fc--current"></span>
            <span className="cd-fc--bottom cd-fc--next"></span>
            <div></div>
        </div>
    )
}

class Controller extends React.Component {
    render() {
        return(
            <div className="countdown">
                <FlipCard />
            </div>
        )
    }
}

export default Controller;