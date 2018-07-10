import React        from 'react';
import { connect }  from 'react-redux';
import {
    NavLink, 
    withRouter
}                   from 'react-router-dom';
import {
    breadCrumbsActions
}                   from '../../store/navigation';

import './bread-crumbs.less';

//  -- --
//  Класс отвечающий за добавление, удаление елемента в хлебные крошки
//  Должен быть использован на страницах, которые должны иерарархически попадать в список
class BreadCrumbController extends React.Component {
    currentNode(source) {
        if(source.seo != null && source.title != null) {
            return {
                seo: source.seo,
                title: source.title,
                topOffset: source.topOffset || 0
            }
        }

        return null;
    };

    nodes(source) {
        return _.compact(_.concat(source.nodes, this.currentNode(source)));
    }

    process(action, source) {
        _.forEach(this.nodes(source || this.props), node => action(node));
    }

    componentWillMount() {
        this.process(this.props.breadCrumbsPush);
    }

    componentWillUnmount() {
        this.process(this.props.breadCrumbsPop);
    }
    
    componentWillReceiveProps(nextProps) {
        if(_.differenceBy(this.nodes(this.props), this.nodes(nextProps), 'seo').length > 0) {
            this.process(this.props.breadCrumbsPop, this.props);
            this.process(this.props.breadCrumbsPush, nextProps);
        }
        // this.process(this.props.breadCrumbsPush, nextProps);
    }

    render() {
        return null;
    }
}

//  -- --
//  Оболочка с эксопртом, коннект со стором
export const BreadCrumb = connect(state => ({
    breadCrumbs: state.navigation.breadCrumbs
}), breadCrumbsActions)(withRouter(BreadCrumbController));


//  -- --
//  Класс, рендеренга списка хлебныйх крошек
class BreadCrumbsController extends React.Component {
    render() {
        const breadCrumbs = _.reduce(this.props.pages, (s, b) => _.concat(s, _.concat(b.baseBreadCrumbs, b.breadCrumbs)), []);
        const dispaly = true;
        const currentBreadCrumb = _.last(breadCrumbs) || { title: '', topOffset: 0 };

        return(
            <div
                className={`bread-crumbs${!dispaly ? ' bread-crumbs--hide': ''}`}
                style={{marginTop: currentBreadCrumb.topOffset}}>
                {
                    _.map(_.initial(breadCrumbs), (crumb, index) => {
                        return(
                            <div
                                key={index} 
                                className="bread-crumbs__item">
                                    <NavLink
                                        to={_.trimEnd(`/${crumb.path}`, '/')}>
                                            {crumb.title}
                                    </NavLink>
                            </div>
                        )
                    })
                }
                <div className="bread-crumbs__item bread-crumbs__item--end">
                    <span>{currentBreadCrumb.title}</span>
                </div>
            </div>
        )
    }
}

//  -- --
//  Оболочка с эксопртом, коннект со стором
export const BreadCrumbs = connect(state => ({
    pages: state.environment.pageMetaList
}))(BreadCrumbsController);


//----------------------------------------------------------
class BreadCrumbsBuilderController extends React.Component {
    constructor(props) {
        super(props);

        // node {} or nodes [{}, {} ...] 
        this.state = {
            prevNodes: [],
            selfNodes: []
        }

        this.nodes = this.nodes.bind(this);
        this.currentNode = this.currentNode.bind(this);
        this.process = this.process.bind(this);
    }

    currentNode(source) {
        if(source.seo != null && source.title != null) {
            return {
                seo: source.seo,
                title: source.title,
                topOffset: source.topOffset || 0
            }
        }

        return null;
    };

    nodes(source) {
        return _.compact(_.concat(source.nodes, this.currentNode(source)));
    }

    process(action, source) {
        _.forEach(this.nodes(source || this.props), node => action(node));
    }

    componentWillMount() {
        // this.process(this.props.breadCrumbsPush);
        // this.setState({
        //     prevNodes: _.map(this.props.breadCrumbs, b => b),
        //     selfNodes: this.nodes(this.props)
        // });
    }

    componentWillUnmount() {
        // this.process(this.props.breadCrumbsPop);
    }
    
    componentWillReceiveProps(nextProps) {
        // if(_.differenceBy(this.nodes(this.props), this.nodes(nextProps), 'seo').length > 0) {
        //     this.process(this.props.breadCrumbsPop, this.props);
        //     this.process(this.props.breadCrumbsPush, nextProps);
        // }
        // this.process(this.props.breadCrumbsPush, nextProps);
        // this.setState({
        //     selfNodes: this.nodes(nextProps)
        // })
    }

    render() {
        const breadCrumbs = _.concat(this.state.prevNodes, this.state.selfNodes);
        const currentBreadCrumb = _.last(breadCrumbs) || { title: '', topOffset: 0 };
        return null;

        return(
            <div
                className={`bread-crumbs${this.props.dispaly == false ? ' bread-crumbs--hide': ''}`}
                style={{marginTop: currentBreadCrumb.topOffset}}>
                {
                    _.map(_.initial(breadCrumbs), (crumb, index) => {
                        return(
                            <div
                                key={index} 
                                className="bread-crumbs__item">
                                    <NavLink
                                        to={_.trimEnd(`/${crumb.path}`, '/')}>
                                            {crumb.title}
                                    </NavLink>
                            </div>
                        )
                    })
                }
                <div className="bread-crumbs__item bread-crumbs__item--end">
                    <span>{currentBreadCrumb.title}</span>
                </div>
            </div>
        )
    }
}

export const BreadCrumbsBuilder = connect(state => ({
    breadCrumbs: state.navigation.breadCrumbs
}), breadCrumbsActions)(withRouter(BreadCrumbsBuilderController));

//------------

// function withBreadCrumbs(WrappedComponent) {
//     return class extends React.Component {
//         constructor(props) {
//             super(props);

//         }

//         componentDidMount() {

//         }

//         componentWillUnmount() {

//         }

//         setBreadCrumbs() {

//         }

//         unsetBreadCrumbs() {

//         }

//         render() {
//             return <WrappedComponent {...this.props} />;
//         }
//     }
// }