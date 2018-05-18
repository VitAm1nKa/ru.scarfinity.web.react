import React from 'react';

import './contact-us.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="contact-us">
                <div className="contact-us__line">{"Новосибирск: "}<span className="contact-us__line__value">{"+7 905 952-10-01"}</span></div>
                <div className="contact-us__line">{"Регионы: "}<span className="contact-us__line__value">{"+7 905 952-10-01"}</span></div>
                <div className="contact-us__phone">{"Часы работы: с 08:00 до 18:00"}</div>
            </div>
        )
    }
}

export default Controller;