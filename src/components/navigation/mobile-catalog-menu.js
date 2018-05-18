import React            from 'react';
import Measure          from 'react-measure';
import SlickSlider      from 'react-slick';
import MenuListGrid	    from '../utility/menu-list-grid';
import { Person }       from '../utility/icons';
import Currency         from '../utility/currency';
import ImageContainer   from '../utility/image-container';
import Slider           from '../utility/slider';

import './mobile-catalog-menu.less';

const ProductCard = (props) => {
    return(
        <div className="mobile-catalog-menu-product-card">
            <div className="mobile-catalog-menu-product-card__image">
                <ImageContainer />
            </div>
            <div className="mobile-catalog-menu-product-card__content">
                <span className="mobile-catalog-menu-product-card__content__title">
                    {"Назавние товара"}
                </span>
                <Currency
                    original={999}
                    fontSize={12}
                    fontWeight={500}/>
            </div>
        </div>
    )
}

const ProductCardList = (props) => {
    return(
        <div className="mobile-catalog-menu-product-card-container">
            {
                _.map(new Array(4), product => <ProductCard />)
            }
        </div>
    )
}

const Tabs = (props) => {
    return(
        <div className="mobile-catalog-menu-tabs">
            {
                _.map(props.tabs, (tab, index) =>
                    <div
                        key={index}
                        className={`mobile-catalog-menu-tabs__tab${
                            index == props.tabIndex ? ' mobile-catalog-menu-tabs__tab--active' : ''
                        }`}
                        onClick={() => props.onChange(index)}>
                            <div className="mobile-catalog-menu-tabs__tab__icon">
                                <Person />
                            </div>
                            <span>{tab.title}</span>
                    </div>
                )
            }
        </div>
    )
}

class StickyFooter extends React.Component {
    render() {
        return(
            <div className="mobile-catalog-menu-products-list">
                <Slider infinite={false}>
                    {
                        _.map(new Array(6), (item, index) => 
                            <div
                                key={index}
                                className="mobile-catalog-menu-products-list__item">
                                    <div className="mobile-catalog-menu-products-list__item__image">
                                        <ImageContainer imageUrl={'http://192.168.1.198:55139/uploads/a3/69/1eade4a2-b695-4d21-9f20-4ab583525b2d.jpg'}/>
                                    </div>
                                </div>
                        )
                    }
                </Slider>
            </div>
        )
    }
}

const NodesList = (props) => {
    return(
        <div className="mobile-catalog-menu-nodes-list">
            {
                _.map(props.nodes, (node, nIndex) => 
                    <div key={nIndex} className="mobile-catalog-menu-nodes-list__block">
                        <span
                            className="mobile-catalog-menu-nodes-list__block__title">
                                {node.title}
                        </span>
                        {
                            _.map(_.take(node.nodes, 5), (subNode, snIndex) =>
                                <span
                                    key={snIndex}
                                    className="mobile-catalog-menu-nodes-list__block__item">
                                        {subNode.title}
                                </span>
                            )
                        }
                        {
                            <span
                                className="mobile-catalog-menu-nodes-list__block__more">
                                    {"Смотреть еще"}
                            </span>
                        }
                    </div>
                )
            }
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tabStep: {
                index: 0
            }
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        const categories = [
            {seo: 'ladies', title: 'Женщинам'},
            {seo: 'gents', title: 'Мужчинам'},
            {seo: 'kids', title: 'Детям'},
            {seo: 'accesories', title: 'Аксессуары'},
            {seo: 'juwerly', title: 'Бижутерия'}
        ];

        this.productCategories = _.map(new Array(5), (cateory, index) => (
            {seo: categories[index].seo, title: categories[index].title, nodes: _.map(new Array(13), (node, nIndex) => (
                {seo: '', title: `${categories[index].title.substr(0, 1)} Категория ${nIndex}`, nodes: _.map(new Array(7), (subNode, snIndex) => ({ seo: '', title: `Подкатегория ${nIndex}${snIndex}` }))}
            ))}
        ));
    }

    handleChange(tabIndex) {
        this.setState({
            tabStep: {index: tabIndex}
        })
    }

    render() {
        return(
            <div className="mobile-catalog-menu">
                <div className="mobile-catalog-menu__container">
                    <Tabs
                        tabs={_.map(this.productCategories, category => ({
                            title: category.title
                        }))}
                        tabIndex={this.state.tabStep.index}
                        onChange={this.handleChange}/>
                    <div className="mobile-catalog-menu-container">
                        <div className="mobile-catalog-menu-container__body">
                            <NodesList
                                nodes={this.productCategories[this.state.tabStep.index].nodes}/>
                        </div>
                        <div className="mobile-catalog-menu-container__sticky-footer">
                            <StickyFooter />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Controller;