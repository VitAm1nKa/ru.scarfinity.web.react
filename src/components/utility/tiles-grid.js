import React        from 'react';
import Tile         from './tile';
import * as Grid    from '../../lib/grid';

class Controller extends React.Component {
    render() {
        const gridSize = 12;

        return(
            <Grid.Row>
                <Grid.Container>
                    <Grid.Col grid={gridSize}></Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}