import React                from 'react';
import { NavLink }          from 'react-router-dom';

import Paper                from 'material-ui/Paper';
import KeyboardArrowUp      from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown    from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

const LeftMenuItemExpandItem = (props) => {
    return(
        <NavLink
            onMouseEnter={props.onMouseEnter}
            className={`left-menu-expand-item ${props.toggle && 'left-menu-expand-item--selected'}`}
            to='/'>
                {props.title}
        </NavLink>
    )
}

const LeftMenuItemExpand = (props) => {
    return(
        <div 
            className={`left-menu-expand`}>
                {
                    props.items &&
                    props.items.map((item, index) =>
                        <LeftMenuItemExpandItem
                            key={index}
                            onMouseEnter={() => {props.onMouseEnter(index)}}
                            title={item.title}
                            path={item.path}
                            toggle={props.selectedIndex === index}/>
                    )
                }
        </div>
    )
}
LeftMenuItemExpand.defaultProps = {
    items: ["Шарфы", "Витаминка", "Косынко", "Палантин"],
    toggle: false,
} 

export default LeftMenuItemExpand;

const LeftMenuItemHeader = (props) => {
    return(
        <div 
            className={`left-menu-item ${!props.expandable ? "left-menu-item--not-expandable" : ""}`}
            onClick={props.onClick}>
                <span className={`left-menu-item__title`}>{props.title}</span>
                {
                    <KeyboardArrowUp 
                        style={{
                            transform: `rotateZ(${props.toggle ? 180 : 0}deg)`,
                        }}/>
                }
        </div>
    )
}
LeftMenuItemHeader.defaultProps = {
    title: "Заголовок",
    toggle: false,
    expandable: false,
    onClick: () => {},
}

const LeftMenuItem = (props) => {
    const estimateItemHeight = 34;
    const estimateHederHeight = 45;
    let containerHeight = estimateHederHeight;
    if(props.items && props.toggle) {
        containerHeight = props.items.length * estimateItemHeight + estimateHederHeight + 20;
    }
    const expandable = props.items && props.items.length > 0 ? true : false
    return(
        <div 
            className="left-menu-item-container"
            style={{
                maxHeight: containerHeight,
            }}>
            <LeftMenuItemHeader
                title={props.title}
                toggle={props.toggle}
                expandable={expandable}
                onClick={props.onHeaderClick}/>
                {
                    expandable &&
                    <LeftMenuItemExpand
                        items={props.items}/>
                }
        </div>
    )
}
LeftMenuItem.defaultProps = {
    title: "",
    toggle: false,
    items: null,
    onHeaderClick: () => {}
}

const LeftMenuView = (props) => {
    return(
        <div className="left-menu">
            {
                props.items &&
                props.items.map((item, index) =>
                    <LeftMenuItem
                        key={index}
                        title={item.title}
                        items={item.items}
                        toggle={index == props.selectedIndex}
                        onHeaderClick={() => props.onItemHeaderClick(index)}/>
                )
            }
        </div>
    )
}
LeftMenuView.defaultProps = {
    items: null,
    selectedIndex: -1,
    onItemHeaderClick: () => {},
}

class LeftMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, props, {
            selectedIndex: -1,
        })

        this.handleItemHeaderClick = this.handleItemHeaderClick.bind(this);
    }

    handleItemHeaderClick(index) {
        if(this.state.selectedIndex == index)
            index = -1;
        this.setState({
            selectedIndex: this.state.selectedIndex == index ? -1 : index,
        })
    }

    render() {
        return(
            <Paper zDepth={1} style={{overflow: 'hidden'}}>
                <LeftMenuView
                    items={this.state.items}
                    selectedIndex={this.state.selectedIndex}
                    onItemHeaderClick={this.handleItemHeaderClick}/>
            </Paper>
        )
    }
}
LeftMenu.defaultProps = {
    items: [
        {
            title: "Женщинам",
            items: ["Шарфы", "Витаминка", "Косынко", "Палантин"],
        },
        {
            title: "Мужчинам",
            items: ["Шарфы", "Витаминка"],
        },
        {
            title: "Детям",
            items: ["Шарфы", "Витаминка", "Косынко"],
        },
        {
            title: "Корзина",
            items: null,
        },
    ]
}

//export default LeftMenu;