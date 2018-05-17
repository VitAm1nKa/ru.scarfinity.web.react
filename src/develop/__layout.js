import React from 'react';

import * as Grid            from '../lib/grid';

import Paper                from 'material-ui/Paper';

const View = (props) => {
    return(
        <Grid.VerticalGrid>
            <Grid.Row className="catalog-header">
                <Grid.Container style={{alignItems: 'center'}}>
                    <Grid.Col lg={8} md={8} sm={16}>
                        <h1>{props.title}</h1>
                    </Grid.Col>
                    <Grid.Col lg={8} md={8} sm={8}>
                        {props.navigation}
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
            <Grid.Row>
                <Grid.Container>
                    <Grid.Col>
                        <Paper style={{padding: 14}}>
                            {props.children}
                        </Paper>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        </Grid.VerticalGrid>
    )
}

export default View;