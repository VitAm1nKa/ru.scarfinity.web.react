import React        from 'react';
import { connect }  from 'react-redux';

import Header       from '../components/home/header';
import AboutUs      from '../components/home/about-us';
import StoresLine   from '../components/home/stores-line';
import Banner       from "../components/utility/banner";
import ProductRow   from '../components/catalog/product-row';
import * as Grid    from '../lib/grid';

const View = (props) => {
    return(
        <Grid.VerticalGrid>
            <Header />
            <Grid.Row>
                <Grid.Container>
                    <Grid.Col>
                        <Grid.VerticalGrid>
                            <ProductRow />
                        </Grid.VerticalGrid>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
            <AboutUs />
            <StoresLine />
        </Grid.VerticalGrid>
        
    )
}

const mstp = (state, ownProps) => {
    return {
        
    }
}

const mdtp = (dispatch) => {
    return {
        
    }
}

export default connect(mstp, mdtp)(View);