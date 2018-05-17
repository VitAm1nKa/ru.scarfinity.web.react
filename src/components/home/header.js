import React        from 'react';

import * as Grid    from '../../lib/grid';
import Banner       from '../utility/banner';
import SpecialOffer from '../utility/special-offer';

import {
    PngLadyGray
}                   from '../utility/icons';

import './header.less';

class Controller extends React.Component {
    render() {
        return(
            <div className="home-header">
                <Grid.Row>
                    <Grid.Container>
                        <Grid.Col lg={3} md={3} sm={0} xs={0} ></Grid.Col>
                        <Grid.Col lg={10} md={10} sm={16} xs={16}>
                            <div className="home-header__test">
                                <Banner />
                            </div>
                        </Grid.Col>
                        <Grid.Col lg={3} md={3} sm={16} xs={16}>
                            <div className="home-header__test">
                                <SpecialOffer end={new Date('2018-03-02T15:00:00')} />
                            </div>
                        </Grid.Col>
                    </Grid.Container>
                </Grid.Row>
            </div>
        )
    }
}

export default Controller;