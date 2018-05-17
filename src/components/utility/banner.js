import React from 'react';

import './banner.less';

import {Row, Container, Col}        from '../../lib/grid';
import FiberManualRecord            from 'material-ui/svg-icons/av/fiber-manual-record';
import ArrowForward                 from 'material-ui/svg-icons/navigation/arrow-forward';
import ChevronLeft                  from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight                 from 'material-ui/svg-icons/navigation/chevron-right';
import Paper                        from 'material-ui/Paper';

var BannerWebWorker = require('worker-loader!./web-workers/banner.js');

var iconStyle = {
    circle: {
        width: 10,
        height: 14,
        padding: 4,
        flex: '0 0 20px',
    },
    arrow: {
        width: 16,
        height: 14,
        padding: 2,
        flex: '0 0 20px',
    },
    pagination: {
        width: 24,
        height: 24,
    }
    
}

var slideBarItem = [
    { color: "#bf4f79" },
    { color: "#ef8742" },
    { color: "#9cbf3e" },
    { color: "#2799c9" },
]

// Scale bar -------------------------------------------
class ScaleBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scaleWidth: 0,
            backgroundPosiotion: 0,
            first: props.first,
        }

        this.onResize = this.onResize.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    componentDidMount() {
        this.calculateWidth(this.container.offsetWidth);
    }

    onResize(e) {
        this.calculateWidth(this.container.offsetWidth);
    }

    calculateWidth(containerWidth) {
        const width = Math.floor((containerWidth - 10) / 5) * 5;
        const cWidth = width - (width % 10) + 1;
        this.setState({
            scaleWidth: width + 1,
            backgroundPosiotion: (containerWidth - width) / 2,
        });
    }

    render() {
        return(
            <div
                className={"banner-scale-item"}
                ref={cont => this.container = cont}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundPosition: `-${this.state.first ? 2 : 0}px 0px`,
                }}>
                <div
                    className={"banner-scale-item__scale"}
                    style={{
                        height: 20,
                        width: this.state.scaleWidth,
                        backgroundPosition: `0px 0px`,
                    }}></div>
            </div>
        )
    }
}
ScaleBar.defaultProps = {
    first: false,
}

const ScaleBarContainer = (props) => {
    return(
        <div className="banner-scale-container">
            {
                Array.apply(null, Array(props.count)).map((item, index) =>
                    <ScaleBar
                        key={index}
                        first={index == 0} />
                )
            }
        </div>
    )
}
ScaleBarContainer.defaultProps = {
    count: 4,
}
// -----------------------------------------------------

const BannerItem = (props) => {
    let state = "";
    if(props.preFocus) state = "banner-item-simple__content--pre-focus";
    if(props.active) state = "";
    if(props.afterFocus) state = "banner-item-simple__content--after-focus";
    return(
        <div className="banner-item-simple">
            <div className={`banner-item-simple__content ${state}`}>
                <div className="banner-item-simple__content__image">
                </div>
                {/* <span className="banner-item-simple__content__primary">{props.primary}</span>
                <span className="banner-item-simple__content__secondary">{props.secondary}</span>
                <span className="banner-item-simple__content__subtitle">{props.subtitle}</span>
                <div className="banner-item-simple__content__button">
                    <button className="banner-button banner-button--third">
                        <span className="banner-button__text">{props.buttonTitle}</span>
                    </button>
                </div> */}
            </div>
        </div>
    )
}
BannerItem.defaultProps = {
    primary: "Harder, Better,",
    secondary: "Faster, stronger.",
    subtitle: "Why, sometimes I've believed as many as six impossible things before breakfast.",
    buttonTitle: "Купить",
    preFocus: true,
    active: false,
    afterFocus: false,
}

const BannerMenuItem = (props) => {
    const indexString = `0${props.index + 1}`;
    return(
        <div
            className="banner-menu-item"
            data-index={indexString}>
                <div 
                    className={`banner-menu-item__title banner-menu-item__title--style${indexString} ${props.active ? `banner-menu-item__title--active${indexString}` : ""}`}
                    onClick={props.onClick}>
                        {
                            props.active
                            ? <ArrowForward style={iconStyle.arrow} />
                            : <FiberManualRecord style={iconStyle.circle} />
                        }
                    <span className="banner-menu-item__title__text">{props.title}</span>
                </div>
                <span 
                    className="banner-menu-item__subtitle"
                    onClick={props.onClick}
                    >{props.subtitle}</span>
        </div>
    )
}
BannerMenuItem.defaultProps = {
    title: "",
    subtitle: "",
    index: 0,
    active: false,
    onClick: () => {},
}

const BannerMenu = (props) => {
    return(
        <div className="banner-menu">
            {
                props.items &&
                props.items.map((item, index) =>
                    <BannerMenuItem
                        key={index}
                        index={index}
                        title={item.title}
                        subtitle={item.subtitle}
                        active={props.activeIndex == index}
                        onClick={() => {props.onItemClick(index)}}/>
                )
            }
        </div>
    )
}
BannerMenu.defaultProps = {
    items: [
        {title: "Новая осенняя коллекция", subtitle: "уккуце"},
        {title: "Второе", subtitle: "укеук ц"},
        {title: "Третье", subtitle: "цукеуцке к"},
        {title: "Четвертое", subtitle: "еуке цукеуцк к"},
    ],
    activeIndex: -1,
    onItemClick: () => {},
}

// Slide bar -------------------------------------------
class BannerSlideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            slideIndex: props.slideIndex,
            slides: props.slides,
            start: false,
        }

        this.slides = Array.apply(null, Array(props.slides)).map((item, index) => (
            {
                color: slideBarItem[index].color,
            }
        ));

        this.changeIndex = this.changeIndex.bind(this);
        this.start = this.start.bind(this);
    }

    componentWillReceiveProps(props) {
        if(this.state.slideIndex !== props.slideIndex) {
            this.changeIndex(props.slideIndex);
        }

        if(props.start == true) {
            this.setState({
                start: true,
            });
        }
    }

    changeIndex(index) {
        this.setState({
            slideIndex: index,
        });
    }

    start() {
        if(!this.state.start) {
            this.setState({
                start: true,
            });
        }
    }

    getState(index, slideIndex) {
        if(this.state.start) {
            if(slideIndex < 0)
                return "empty";

            if(index < slideIndex) 
                return "fill";

            if(index == slideIndex)
                return "fillup";

            if(index > slideIndex)
                return "empty";
        } else {
            return "empty";
        }

        return "empty";
    }

    render() {
        return(
            <div className="banner-slide">
                {
                    this.slides &&
                    this.slides.map((slide, index) =>
                        <BannerSlideBarItem
                            key={index}
                            color={slide.color}
                            state={this.getState(index, this.state.slideIndex)} />
                    )
                }
            </div>
        )
    }
}
BannerSlideBar.defaultProps = {
    slideIndex: -1,
    slides: 4,
}

const BannerSlideBarItem = (props) => {
    let style = {
        transform: 'scale3d(1, 1, 1)',
    };
    switch(props.state) {
        case "empty": style = {
            transform: 'scale3d(1, 1, 1)',
            opacity: 1,
        }; break;
        case "fillup": style = {
            transform: 'scale3d(0, 1, 1)',
            transitionProperty: 'transform',
            transitionDuration: `${1000 * props.animationDuration}ms`,
            transitionTimingFunction: 'linear',
        }; break;
        case "filldown": style = {
            transform: 'scale3d(1, 1, 1)',
            transitionProperty: 'transform',
            transitionDuration: `${1000 * props.animationDuration}ms`,
            transitionTimingFunction: 'linear',
        }; break;
        case "fill": style = {
            transform: 'scale3d(1, 1, 1)',
            opacity: 0,
        }; break;
    }

    return(
        <div 
            className="banner-slide-item"
            style={{
                backgroundColor: props.color,
            }}>
            <div 
                className="banner-slide-item__white"
                style={style}
                ></div>
        </div>
    )
}
BannerSlideBarItem.defaultProps = {
    state: "empty",
    color: "#fff",
    animationDuration: 5,
}
// -----------------------------------------------------

const BannerNavigation = (props) => {
    return(
        <div className="banner__menu">
            <BannerSlideBar
                ref={props.slideBarRef}
                slideIndex={props.index} />
            <ScaleBarContainer />
            <BannerMenu
                activeIndex={props.index}
                onItemClick={props.onMenuItemClick}/>
        </div>
    )
}
BannerNavigation.defaultProps = {
    index: -1,
    onMenuItemClick: () => {},
    slideBarRef: null,
}

class BannerConatiner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            banners: props.banners,
            bannerIndex: props.bannerIndex,
            prepare: false,
            show: false,
            prepareIndex: -1,
            releaseIndex: -1,
            showIndex: -1,
        }

        this.bannersLenth = (this.state.banners) ? this.state.banners.length : 0;

        this.goNext = this.goNext.bind(this);
        this.goPrev = this.goPrev.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.goToIndexPreare = this.goToIndexPreare.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.showIndex !== this.state.showIndex || nextState.bannerIndex !== this.state.bannerIndex) {
            return true;
        }

        return false;
    }

    goNext() {
        const nextIndex = (this.state.bannerIndex + 1) % this.bannersLenth;
        return this.goToIndexPreare(nextIndex);
    }

    goPrev() {
        const prevIndex = this.state.bannerIndex - 1;
        return this.goToIndexPreare(prevIndex >= 0 ? prevIndex : this.bannersLenth - 1);
    }

    goToIndexPreare(nextIndex) {
        this.setState({
            showIndex: this.state.bannerIndex,
            releaseIndex: this.state.bannerIndex,
            prepareIndex: nextIndex,
        }, () => {
            this.state.showIndex = -1;
            this.state.releaseIndex = -1;
            this.state.prepareIndex = -1;
        });

        return () => {this.goToIndex(nextIndex)};
    }

    goToIndex(index) {
        this.setState({
            showIndex: index,
            bannerIndex: index,
        }, () => {
            this.state.showIndex = -1;
        });
    }

    render() {
        return(
            <div className="banner-container">
                {
                    this.state.banners.map((banner, index) => {
                        return(
                            <div 
                                className={`banner-container__item ${index === this.state.bannerIndex ? "banner-container__item--active" : ""}`}
                                key={index}>
                                    <BannerItem
                                        primary={`Harder, ${index} Better,`}
                                        preFocus={this.state.prepareIndex === index}
                                        active={this.state.showIndex === index}
                                        afterFocus={this.state.releaseIndex === index}/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
BannerConatiner.defaultProps = {
    banners: ["", "", "", ""],
    bannerIndex: 0,
    state: "iddle",
}

class Banner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            navigationIndex: 0,
            itemsCount: 4,
        }

        this.banner = null;
    }

    componentDidMount() {
        // Add web worker
        if(typeof(Worker) !== 'undefined') {
            if(typeof(this.worker) == 'undefined') {
                console.log("Here");
                this.worker = new BannerWebWorker();
                this.worker.onmessage = this.onWebWorker.bind(this);
                this.worker.postMessage({
                    message: "start",
                    props: {
                        delay: 1000,
                        stepLength: 5,
                        stepCount: 4,
                    }
                });
            }
        } else {
            console.error("Web worker no support...");
        }
    }

    changeIndex(index) {
        if(index != this.state.navigationIndex) {
            this.worker.postMessage({
                message: "gotoindex",
                nextIndex: index,
            })
            this.bannerCallback = this.banner.goToIndexPreare(index);
        }
    }

    handleMenuItemClick(index) {
        this.changeIndex(index);
    }

    handleNextClick() {
        let newIndex = (this.state.navigationIndex + 1) % this.state.itemsCount;
        this.changeIndex(newIndex);
    }

    handlePrevClick() {
        let newIndex = this.state.navigationIndex - 1;
        this.changeIndex(newIndex >= 0 ? newIndex : this.state.itemsCount - 1);
    }

    onWebWorker(event) {
        switch(event.data.message) {
            case "prepare": {
                this.bannerCallback = this.banner.goNext();
            }; break;
            case "change": {
                this.setState({
                    navigationIndex: event.data.index,
                }, () => {
                    if(this.bannerCallback) {
                        this.bannerCallback();
                        this.bannerCallback = undefined;
                    }
                })
            }; break;
            case "unpause": {
                this.setState({
                    navigationIndex: event.data.index,
                }, () => {
                    if(this.bannerCallback) {
                        this.bannerCallback();
                        this.bannerCallback = undefined;
                    }
                });
            }; break;
            case "started": {
                if(this.slideBarRef) {
                    this.slideBarRef.start();
                }
            }; break;
            default: ;
        }
    }

    componentWillUnmount() {
       if(this.worker) {
            this.worker.terminate();
            this.worker = undefined;
       }
    }

    render() {
        return(
            <div className="banner">
                <div className="banner__content">
                    <div 
                        className="banner__content__side"
                        onClick={this.handlePrevClick.bind(this)}>
                        <ChevronLeft style={iconStyle.pagination} />
                    </div>
                    <div className="banner-content">
                        <div className="banner-content__container">
                            <BannerConatiner ref={banner => {if(this.banner == null) this.banner = banner}}/>
                        </div>
                    </div>
                    <div 
                        className="banner__content__side"
                        onClick={this.handleNextClick.bind(this)}>
                        <ChevronRight style={iconStyle.pagination} />
                    </div>
                </div>
                <BannerNavigation
                    index={this.state.navigationIndex}
                    onMenuItemClick={this.handleMenuItemClick.bind(this)}
                    slideBarRef={slideBar => {this.slideBarRef = slideBar}}/>
            </div>
        )
    }
}

export default Banner;