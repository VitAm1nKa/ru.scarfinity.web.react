import React        from 'react';
import NavLink      from 'react-router-dom/NavLink';
import * as Grid    from '../../lib/grid';

import './info-menu.less';

class Controller extends React.Component {
    render() {
        return(
            <Grid.Row className="info-menu">
                <Grid.Container>
                    <Grid.Col className="info-menu__container">
                        <div className="info-menu-navigation">
                            <NavLink to={"/"}>{"О компании"}</NavLink>
                            <NavLink to={"/"}>{"Олата"}</NavLink>
                            <NavLink to={"/"}>{"Доставка"}</NavLink>
                            <NavLink to={"/"}>{"Опт"}</NavLink>
                        </div>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

export default Controller;