import React from 'react';

import './info-list.less';

class Controller extends React.Component {
    render() {
        const items = _.map(this.props.items, (item, index) =>
            <li key={index}>
                <span>{`${item.title}:`}</span>
                <div className="info-list__dots"></div>
                <span>{item.value}</span>
            </li>
        )

        return(
            <ul className={"info-list"}>
                {items}
            </ul>
        )
    }
}

export default Controller;