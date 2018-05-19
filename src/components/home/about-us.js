import React        from 'react';
import * as Grid    from '../../lib/grid';

import './about-us.less';

class Controller extends React.Component {
    render() {
        return(
            <Grid.Row className="about-us">
                <Grid.Container>
                    <Grid.Col className="about-us__container">
                        <h4>{"О компании"}</h4>
                        <p>{"Esse eiusmod veniam laboris excepteur irure non et elit magna. Velit aliqua qui minim minim in minim amet nisi magna eu est. Sint exercitation dolore laborum ad magna ipsum. Dolore non tempor Lorem commodo enim. Ea occaecat duis velit non aliqua mollit enim ipsum ut. Do nisi sint sint tempor. Amet aute deserunt qui eu pariatur ex."}</p>
                        <p>{"Commodo ut pariatur aliquip tempor aliqua est consectetur ipsum et. Ex ut nulla ipsum proident pariatur voluptate nisi dolor tempor sint tempor mollit veniam. Veniam adipisicing Lorem deserunt non aute esse tempor cupidatat non duis incididunt incididunt. Sunt quis esse aute sunt nostrud ex anim incididunt magna qui exercitation excepteur Lorem esse."}</p>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

export default Controller;