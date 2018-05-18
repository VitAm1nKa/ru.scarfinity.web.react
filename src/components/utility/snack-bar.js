import React from 'react';

import './snack-bar.less';

class Controller extends React.Component {
    render() {
        return(
            <div className={`snack-bar${this.props.show ? ' snack-show' : ''}`}>
                <div className="snack-bar-item snack-bar-item--success">
                    <div className="snack-bar-item__container">
                        <span className="alert-block-text">
                            {"Товар успешно добавлен"}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Controller;