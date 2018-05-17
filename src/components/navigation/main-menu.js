import React 				from 'react';
import { connect }			from 'react-redux';
import { NavLink }			from 'react-router-dom';
import { matchPath }        from 'react-router';

import {
	PNG
}							from '../utility/icons';
import MenuListGrid			from '../utility/menu-list-grid';
import CartPopup			from '../utility/cart-popup';
import MiniProductCard		from '../utility/mini-product-card';

import * as Grid 			from '../../lib/grid';
import { count__cartItems }	from '../../lib/currying'; 
import * as CartS			from '../../store/cart';

// 
class MainMenuNavigationCart extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			hover: false
		}

		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleClearHover = this.handleClearHover.bind(this);
	}

	handleMouseEnter() {
		this.setState({hover: true});
	}

	handleMouseLeave() {
		this.setState({hover: false})
	}

	handleClearHover() {
		this.setState({hover: false})
	}

	render() {
		const linesCount = this.props.shoppingCart.lines.length;

		let first = "Ваша корзина";
		let last = "пустая";
		
		if(linesCount != 0) {
			last = "в корзине";
			first = `${linesCount} ${count__cartItems(linesCount)}`;
		}

		return(
			<div
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onMouseUp={this.handleClearHover}
				className={`main-menu-cart${this.state.hover ? ' hovered': ''}`}>
					<NavLink to={'/cart'}>
						<span>{first}</span>
						<span className="main-menu-cart__sub-title">
							&nbsp;{last}
						</span>
					</NavLink>
					<CartPopup
						shoppingCart={this.props.shoppingCart}
						onProductRemove={this.props.onCartProductRemove}/>
			</div>
		)
	}
}

// 
const MainMenuLeftMenu = (props) => {
	var icons = ['lady', 'gent', 'child']
    return(
		<div className={`float-container`} onMouseUp={props.onClearHover}>
			<div 
				className="main-menu-left">
				{
					_.map(props.catalogNodes.nodes, (node, index) =>
						<div
							key={node.productCategoryId}
							className="main-menu-left__item">
								<NavLink
									to={node.path}
									className="main-menu-left__item__container">
										<PNG name={[icons[index]]} />
										<span>{node.title}</span>
								</NavLink>
								<MainMenuNavigationContent
									index={index}
									catalogNode={node}/>
						</div>
					)
				}
			</div>
		</div>
    )
}

// Список популярных товаров в категории
const MainMenuPopularItems = (props) => {
	const tmp = [
		{title: 'Шарфик хомут', price: 470},
		{title: 'Палантин красивый', price: 920},
		{title: 'Аксессуар для шали', price: 120},
		{title: 'Шарфик хомут', price: 690},
		{title: 'Палантин красивый', price: 3260} ];

	return(
		<div className="main-menu-popular-items">
			{
				_.map(props.products || tmp, (product, index) => 
					<MiniProductCard
						key={index}
						title={product.title}
						price={product.price}/>)
			}
		</div>
	)
}

// Контент меню
const MainMenuNavigationContent = (props) => {
	return(
		<div className={`float-container-center trr-${props.index}`}>
			<div className="main-menu-float-sub">
				<div className="main-menu-float-sub__container">
					<MenuListGrid nodes={props.catalogNode.nodes}/>
					<MainMenuPopularItems />
				</div>
				<div className="main-menu-float-sub__footer">
					<NavLink
						className="main-menu-float-sub__footer__button"
						to={props.catalogNode.path}>
							{
								`Все товары в категории: ${props.catalogNode.title}`
							}
					</NavLink>
				</div>
			</div>
		</div>
	)
}

class Controller extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			hover: false
		}

		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleClearHover = this.handleClearHover.bind(this);
	}

	componentWillMount() {
		this.setState({open: matchPath(this.props.location.pathname, { path: '/', exact: true, strict: true }) != null});
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.location.pathname !== nextProps.location.pathname) {
			this.setState({open: matchPath(nextProps.location.pathname, { path: '/', exact: true, strict: true }) != null});
		}
	}

	handleMouseEnter() {
		this.setState({hover: true});
	}

	handleMouseLeave() {
		this.setState({hover: false})
	}

	handleClearHover() {
		this.setState({hover: false})
	}

	render() {
		return(
			<div className="main-menu-wraper">
				<Grid.Row className="main-menu">
					<Grid.Container
						className="main-menu-container">
						<Grid.Col lg={3} md={3}>
							<span
								className={`main-menu-catalog-button${this.state.hover ? ' hovered': ''} ${this.state.open ? ' open' : ''}`}
								onMouseEnter={this.handleMouseEnter}
								onMouseLeave={this.handleMouseLeave}
								onMouseUp={this.handleClearHover}>
									{"Каталог товаров"}
									<MainMenuLeftMenu
										catalogNodes={this.props.catalogNodes}
										onClearHover={this.handleClearHover}/>
							</span>
						</Grid.Col>
						<Grid.Col
							className="main-menu-ul"
							lg={10} md={10}>
								{
									_.map(['Новинки', 'Акции', 'Зима 2017', 'Новости', 'Блог'], (item, index) =>
									<div
										key={index}
										className="main-menu-button"
										to={item}>
											<span>{item}</span>
									</div>
									)
								}
						</Grid.Col>
						<Grid.Col lg={3} md={3}>
							<MainMenuNavigationCart
								shoppingCart={this.props.shoppingCartStore.shoppingCart}
								onCartProductRemove={this.props.setCartOrderProduct}/>
						</Grid.Col>
					</Grid.Container>
				</Grid.Row>
			</div>
		)
	}
}

const mstp = state => {
	return {
		root: state.navigation.root,
		shoppingCartStore: state.shoppingCart,
		cartOrder: state.cart.order
	}
}

export default connect(mstp, CartS.actionCreators)(Controller);

