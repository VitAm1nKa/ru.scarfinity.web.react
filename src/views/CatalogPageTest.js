import React    from 'react';
import {
    Switch,
    Route,
    NavLink
}               from 'react-router-dom';
import {
    EnvironmentMeta
}               from '../components/navigation/page-meta';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const id = parseInt(this.props.match.params['id']) || 0;
        const title = `Page ${id}`;
        return(
            <div>
                <div style={{ display: 'flex' }}>
                    <NavLink to={`${this.props.location.pathname}/${id + 1}`}>{"Go deep..."}</NavLink>
                </div>
                <h1>{title}</h1>
                <EnvironmentMeta title={title} />
                <div style={{ border: '1px solid #f7f7f7' }} >
                    <Switch>
                        <Route path={`${this.props.match.path}/:id`} component={Controller} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default Controller;