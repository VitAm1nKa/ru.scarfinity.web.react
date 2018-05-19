import React from 'react';

import {
    NavLink
}                   from 'react-router-dom';
import Badge        from './badge';

import Paper        from 'material-ui/Paper';
import IconButton   from 'material-ui/IconButton';
import Settings     from 'material-ui/svg-icons/action/settings';
import ExitToApp    from 'material-ui/svg-icons/action/exit-to-app';

import './personal-menu.less';

const styles = {
    button: {
        padding: 3,
        width: 30,
        height: 30
    },
    icon: {
        width: 24,
        height: 24,
        color: '#aaa'
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Paper
                className="personal-menu">
                    <div className="personal-menu__header">
                        <div className="personal-menu__button">
                            <NavLink to={this.props.settings || '/'}>
                                <IconButton style={styles.button} iconStyle={styles.icon}>
                                    <Settings />
                                </IconButton>
                            </NavLink>
                        </div>
                        <div>
                            <div className="personal-menu__avatar"></div>
                        </div>
                        <div className="personal-menu__button">
                            <NavLink to={this.props.logout || '/'}>
                                <IconButton style={styles.button} iconStyle={styles.icon}>
                                    <ExitToApp />
                                </IconButton>
                            </NavLink>
                        </div>
                    </div>
                    <div className="personal-menu__body">
                        <ul>
                            {
                                _.map(_.filter(this.props.links, l => l.use === true), (link, index) =>
                                    <li key={index}>
                                        <NavLink
                                            to={link.path}>
                                                <span>
                                                    <Badge value={link.badge} style={{
                                                        right: -26
                                                    }} />
                                                    {link.title}
                                                </span>
                                        </NavLink>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
            </Paper>
        )
    }
}

export default Controller;