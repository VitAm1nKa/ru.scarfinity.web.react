import React                        from 'react';
import { connect }                  from 'react-redux';

import * as Grid                    from '../lib/grid';
import { PageHeader }               from '../components/utility/titles';
import CatalogOverviewGrid          from '../components/catalog/catalog-overview-grid';

import {
    breadCrumbsActions
}                                   from '../store/navigation';
import {
    catalogSchemaActionCreators
}                                   from '../store/catalog';
import { CatalogPageSchemaNode }    from '../models/CatalogPage';

class Controller extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.props.breadCrumbsPush({ seo: 'catalog', title: 'Каталог' });
        this.props.loadCatalogPageSchema();
    }

    componentWillUnmount() {
        this.props.breadCrumbsPop({ seo:'catalog', title: 'Каталог' });
    }

    render() {
        return(
            <div className="catalog">
                <Grid.VerticalGrid>
                    <Grid.GridLine>
                        <PageHeader title={"Каталог"}/>
                    </Grid.GridLine>
                    <CatalogOverviewGrid nodes={this.props.catalogPageSchema.nodes} />
                </Grid.VerticalGrid>
            </div>
        )
    }
}


export default connect(state => ({
    catalogPageSchema: new CatalogPageSchemaNode(state.catalog.catalogPageSchema)
}), Object.assign({}, 
    breadCrumbsActions,
    catalogSchemaActionCreators
))(Controller);