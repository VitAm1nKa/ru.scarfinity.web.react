import React                    from 'react';
import { NavLink }              from 'react-router-dom';

import * as Grid                from '../../lib/grid';
import FlatButton               from 'material-ui/FlatButton';
import Paper                    from 'material-ui/Paper';
import ItemRow                  from './item-row';
import ImageContainer           from './image-container';

import './recenly-viewed.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Paper className="recenly-viewed2">
                <Gird.VerticalGrid>
                    <div className="recenly-viewed2__header">
                        <div className="recenly-viewed2__header__title">
                            {"Недавно просмотренные"}
                        </div>
                        <NavLink
                            to={"/"}
                            className="recenly-viewed2__header__button"></NavLink>
                    </div>
                    <ItemRow />
                </Gird.VerticalGrid>
            </Paper>
        )
    }
}

export default Controller;