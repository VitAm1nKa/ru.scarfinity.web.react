import React        from 'react';
import { NavLink }  from 'react-router-dom';
import Measure      from 'react-measure';

import * as Grid    from '../../lib/grid';

import './catalog-overview-grid.less';

const Title = (props) => {
    return(
        <NavLink to={props.path} className="catalog-overview-grid__item__title">
            <span className="catalog-overview-grid__item__title__icon"></span>
            <span className="catalog-overview-grid__item__title__text">{props.title}</span>
        </NavLink>
    )
}

const Content = (props) => {
    return(
        <div className="catalog-overview-grid__item__content">
            <ul className="catalog-overview-grid__item__content__list">
                {_.map(props.nodes, node =>
                    <li key={node.catalogPageId}>
                        <NavLink to={node.path}>{node.title}</NavLink>
                    </li>
                )}
            </ul>
        </div>
    )
}

const Item = (props) => {
    return(
        <div className="catalog-overview-grid__item">
            <Title title={props.title} path={props.path}/>
            <Content nodes={props.nodes}/>
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: {
                width: -1,
                height: -1
            }
        }

        this.handleResize = this.handleResize.bind(this);
    }

    handleResize(contentRect) {
        this.setState({ dimensions: contentRect.bounds });
    }

    chunkSize(width) {
        if(width >= 1200) return 4;
        if(width >= 992) return 4;
        if(width >= 768) return 3;
        if(width >= 576) return 2;
        if(width < 576) return 2;
    }

    render() {
        const chunks = _.chunk(this.props.nodes, this.chunkSize(this.state.dimensions.width));

        return(
            <Measure bounds onResize={this.handleResize}>
            {({ measureRef }) => 
                <div ref={measureRef}>
                {
                    <Grid.Row>
                        <Grid.Container>
                        {
                            _.map(chunks, chunk => 
                                <React.Fragment>
                                    {_.map(chunk, item =>
                                        <Grid.Col grid={12} lg={3} md={3} sm={4} xs={6}><Item {...item} /></Grid.Col>
                                    )}
                                    <Grid.Col grid={12} lg={12} md={12} sm={12} xs={12}>{"............................................"}</Grid.Col>
                                </React.Fragment>
                            )
                        }
                        </Grid.Container>
                    </Grid.Row>
                }
                </div>
            }
            </Measure>
        )
    }
}

export default Controller;