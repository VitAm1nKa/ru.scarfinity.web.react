import React   from 'react';
import NavLink from 'react-router-dom/NavLink';

class Controller extends React.Component {
    render() {
        return(
            <div>
                <div>
                    <NavLink to="/about">About</NavLink>
                </div>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Controller;

