import React            from 'react';
import { connect }      from 'react-redux';
import { withRouter }   from 'react-router-dom';
import { isomorph }     from '../../lib/isomorphic';
import {
    environmentActionCreators
}                       from '../../store/environment';
import { PageMeta }     from '../../models/PageMeta';

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}

function pageId() {
    return `${s4()}-${s4()}-${s4()}`;
}

class EnvironmentMetaController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageId: pageId()
        }
    }

    componentWillMount() {
        // Add page meta to heap
        this.props.addPageMeta(new PageMeta({
            title: this.props.title,
            metaTags: this.props.metaTags,
            pageId: this.state.pageId
        }));
    }

    componentWillReceiveProps(nextProps) {
        // Update page meta
        this.props.updatePageMeta(new PageMeta({
            title: nextProps.title,
            metaTags: nextProps.metaTags,
            pageId: nextProps.pageId
        }));
    }

    componentWillUnmount() {
        // Remove page meta
        this.props.removePageMeta(new PageMeta({
            pageId: this.state.pageId
        }));
    }

    render() {
        return null;
    }
}

export const EnvironmentMeta = connect(state => {}, environmentActionCreators)(EnvironmentMetaController);

class EnvironmentCoreController extends React.Component {
    componentWillMount() {
        this.updateEnvironmentData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateEnvironmentData(nextProps);
    }

    updateEnvironmentData(props) {
        var pageMeta = _.last(props.meta);
        if(pageMeta != null) {
            isomorph(() => {
                document.title = pageMeta.title || document.title;
            });
        }
    }

    render() {
        return null;
    }
}

export const EnvironmentCore = connect(state => ({
    meta: state.environment.meta
}))(withRouter(EnvironmentCoreController));


/*

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="keywords" content="артикул ФД-1610, купить футболку оптом, Волжский трикотаж, детская летняя, для девочек, светло-серый, Россия">
<meta name="description" content="Артикул ФД-1610. Интернет-магазин УРРАА предлагает оптом купить детскую летнюю футболку Волжский трикотаж для девочек по цене от 94 руб. Страна производства - Россия. Бесплатная доставка от 80 000 руб. по России, в Республику Беларусь и Казахстан. Гарантия качества. Наши телефоны: +7 499 350-34-59, +7 800 333-58-93">
<meta property="og:title" content="Артикул ФД-1610 | Купить футболку детскую Волжский трикотаж летнюю (цвет: светло-серый) для девочек оптом в интернет-магазине УРРАА">
<meta property="og:description" content="Артикул ФД-1610. Интернет-магазин УРРАА предлагает оптом купить детскую летнюю футболку Волжский трикотаж для девочек по цене от 94 руб. Страна производства - Россия. Бесплатная доставка от 80 000 руб. по России, в Республику Беларусь и Казахстан. Гарантия качества. Наши телефоны: +7 499 350-34-59, +7 800 333-58-93">
<meta property="og:url" content="https://urraa.ru/catalog/kids-clothing/girls/futbolki_polo/1316721/">
<meta property="og:image" content="https://urraa.ru/upload/iblock/58b/58bb23258ea0da50f0ab897a79028712.jpg">
<meta property="og:site_name" content="URRAA">
<meta property="og:type" content="website">

*/