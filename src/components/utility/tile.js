import React from 'react';



class Controller extends React.Component {
    render() {
        return(
            <div className={`tile${this.props.size ? ` tile--w-${this.props.size}` : ''}`}>
                <div className="tile__container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Controller;