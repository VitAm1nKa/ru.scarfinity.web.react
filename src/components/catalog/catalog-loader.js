import React                from 'react';
import { connect }          from 'react-redux';

import * as CatalogState    from '../../store/catalog';

import * as Grid            from '../../lib/grid';
import LazyLoader           from '../utility/lazy-loader';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        addEventListener('scroll', this.handleScroll);
        this.props.load({
            // category
            ct: 1,
            gp: 1
            // group
            // type
        });
    }
    
    componentWillUnmount() {
        removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        let loadingGap = 600;
        let bounds = this.container.getBoundingClientRect();
        let windowHeight = document.documentElement.clientHeight;

        let topVisible = bounds.top > 0 && bounds.top < windowHeight;
        let bottomVisible = bounds.bottom < windowHeight && bounds.bottom > 0;

        // start loading
        if(bounds.bottom > 0 && bounds.bottom < (windowHeight + loadingGap)) {
            this.props.load({
                // category
                ct: 1,
                gp: 1
                // group
                // type
            });
        }
    }

    render() {
        return(
            <Grid.Row>
                <Grid.Container>
                    <Grid.Col>
                        <div
                            ref={ref => this.container = ref}
                            className="catalog-loader">
                            {
                                this.props.loading &&
                                <LazyLoader text={"Загрузка"} />
                            }
                        </div>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

const mstp = (state, ownProps) => {
    return {
        loading: state.catalog.loading
    }
}

const mdtp = CatalogState.actionCreators;

export default connect(mstp, mdtp)(Controller);