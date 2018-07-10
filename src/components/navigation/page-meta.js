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
            pageId: pageId(),
            prevPageMeta: null
        }
    }

    componentWillMount() {
        // Когда компонент создается, он получает данные о текужем состоянии меты
        // Компонент сохраняет предыдущее состояние в стейт
        // И заменяет в сторе своими данными
        // if(this.props.seo != this.props.meta.seo) {
        //     this.state.prevPageMeta = this.props.meta;
        //     this.props.setPageMeta(new PageMeta({
        //         seo: this.props.seo,
        //         title: this.props.title,
        //         metaTags: this.props.metaTags
        //     }));
        // }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.meta.seo == nextProps.seo) {
            this.props.setPageMeta(new PageMeta({
                seo: this.props.seo,
                title: this.props.title,
                metaTags: this.props.metaTags
            }));
        }
    }

    componentWillUnmount() {
        // Remove page meta
        this.props.setPageMeta(this.state.prevPageMeta);
    }

    render() {
        return null;
    }
}

export const EnvironmentMeta = connect(state => ({
    meta: state.environment.meta
}), environmentActionCreators)(EnvironmentMetaController);






class EnvironmentCoreController extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.updateEnvironmentData(this.props.pages);
    }

    componentWillReceiveProps(nextProps) {
        this.updateEnvironmentData(nextProps.pages);
    }

    updateEnvironmentData(pages) {
        const lastPage = _.last(pages);
        if(lastPage != null) {
            isomorph(() => {
                const meta = lastPage.pageMeta;
                if(meta != null) {
                    document.title = meta.title || document.title;
                }
            });
        }
    }

    render() {
        return null;
    }
}

export const EnvironmentCore = connect(state => ({
    pages: state.environment.pageMetaList
}))(EnvironmentCoreController);

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