import React        from 'react';
import { connect }  from 'react-redux';
import NavLink      from 'react-router-dom/NavLink';
import {
    breadCrumbsActions
}                   from '../../store/navigation';

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
    }

    render() {
        return null;
    }
}

//  -- --
//  Оболочка с эксопртом, коннект со стором
export const BreadCrumb = connect(state => ({
    breadCrumbs: state.navigation.breadCrumbs
}), breadCrumbsActions)(BreadCrumbController);

//  -- --
//  Класс, рендеренга списка хлебныйх крошек
class BreadCrumbsController extends React.Component {
    render() {
        const dispaly = (this.props.breadCrumbs || []).length > 1;
        const currentBreadCrumb = _.last(this.props.breadCrumbs) || { title: '', topOffset: 0 };

        return(
            <div
                className={`bread-crumbs${!dispaly ? ' bread-crumbs--hide': ''}`}
                style={{marginTop: currentBreadCrumb.topOffset}}>
                {
                    _.map(_.initial(this.props.breadCrumbs), (crumb, index) => {
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
    breadCrumbs: state.navigation.breadCrumbs
}))(BreadCrumbsController)