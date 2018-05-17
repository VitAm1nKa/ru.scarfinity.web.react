import React    from 'react';
import Measure  from 'react-measure';
import update   from 'immutability-helper';

const ColorPickerIcon = (props) => {
    return(
        <svg
            style={{
                transition: 'all 0.3s ease',
            }}
            xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 300 300">
            <circle
                style={{
                    fill: props.outside,
                }}
                cx="150" cy="150" r="140"/>
            <circle
                style={{
                    fill: props.inside,
                }}
                cx="150" cy="150" r="126"/>
            <path
                style={{
                    fill: props.icon,
                    transition: 'fill 0.2s ease',
                }}
                d="M206.243,132.531l-57.184,56.931-6.075,6.037a8.618,8.618,0,0,1-12.148,0l-6.075-6.037L94.389,159.209a8.538,8.538,0,0,1,0-12.1l6.075-6.037a8.62,8.62,0,0,1,12.149,0l24.3,24.193,51.111-50.885a8.591,8.591,0,0,1,12.148,0l6.075,6.041A8.549,8.549,0,0,1,206.243,132.531Z"/>
        </svg>
    )
}
ColorPickerIcon.defaultProps = {
    outside: "red",
    inside: "blue",
    icon: "green",
}

const colorStyle = function(colorCode) {
    switch (colorCode.hue) {
        case '0': return {outside: "#1bb869", inside: "#1bb869", icon: "#ffffff"};
        case '1': return {outside: "#9cbf3e", inside: "#9cbf3e", icon: "#ffffff"};
        case '2': return {outside: "#f6b63a", inside: "#f6b63a", icon: "#ffffff"};
        case '3': return {outside: "#ef8742", inside: "#ef8742", icon: "#ffffff"};
        case '4': return {outside: "#e05543", inside: "#e05543", icon: "#ffffff"};
        case '5': return {outside: "#bf4f79", inside: "#bf4f79", icon: "#ffffff"};
        case '6': return {outside: "#8869ca", inside: "#8869ca", icon: "#ffffff"};
        case '7': return {outside: "#2799c9", inside: "#2799c9", icon: "#ffffff"};
        case '8': return {outside: "#303030", inside: "#303030", icon: "#ffffff"};
        default: return {outside: "#aaaaaa", inside: "#ffffff", icon: "#aaaaaa"};
    }
}

const parceColorCode = (colorCode) => {
    const hue = colorCode.substr(0, 1);

    return {
        hue
    }
}

const toString = (colorCode) => {
    return `${colorCode.hue}`;
}

const ColorPickerItem = (props) => {
    const handleClick = () => {
        if(!props.unselectable) {
            if(props.onClick != null) {
                props.onClick(toString(props.colorCode), props.selected);
            }
        }
    }

    const iconStyle = colorStyle(props.colorCode);

    return (
        <div
            className={`color-picker-item${
                props.disabled ? ' color-picker-item--disabled' : ''
            }`}
            onClick={handleClick}>
                <div className="color-picker-item__container">
                    <ColorPickerIcon
                        inside={iconStyle.inside}
                        outside={iconStyle.outside}
                        icon={props.selected ? iconStyle.icon : iconStyle.inside}/>
                </div>
        </div>
    );
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
        this.setState({dimensions: contentRect.bounds});
    }

    render() {
        // Просчет ширины отдельного кружка с цветом
        // Входные данные: макс/мин цветов в ряд, макс/мин ширина кружка
        const { width } = this.state.dimensions;

        // Количество кружков в линии, при заданной ширине кружка
        const lineCountConstWidth = width / Math.max(this.props.itemWidth, 26);
        // Приблезительное и точное значение
        const calcLineCount = this.props.estimate ? Math.floor(lineCountConstWidth) : Math.round(lineCountConstWidth);
        const lineCount = Math.min(Math.min(calcLineCount, this.props.lineCount == null ? calcLineCount : this.props.lineCount), 32);

        var unmapped = _.uniq(this.props.colors) || [];

        // presets
        if(this.props.pure) unmapped = update(unmapped, {$push: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']});

        return(
            <Measure bounds onResize={this.handleResize}>
                {({measureRef}) => 
                    <div ref={measureRef} className={`color-picker color-${lineCount}`} style={{marginLeft: this.props.left ? -4 : 0}}>
                        {
                            _.map(_.filter(unmapped, colorCode => colorCode != null && typeof(colorCode) == 'string' && colorCode.length > 0), colorCode => {
                                const selected = _.indexOf(this.props.selectedColors, colorCode) != -1;
                                const disabled = _.indexOf(this.props.avalibleColors, colorCode) == -1 && this.props.filter;
                    
                                return(
                                    <div className="color-picker__item" key={colorCode}>
                                        <ColorPickerItem
                                            selected={selected}
                                            disabled={disabled}
                                            colorCode={parceColorCode(colorCode)}
                                            unselectable={this.props.unselectable || disabled}
                                            onClick={this.props.onSelectChange} />
                                    </div>
                                );
                            })
                        }
                    </div>
                }
            </Measure>
        )
    }
}
Controller.defaultProps = {
    lineCount: null,
    itemWidth: 36
}

export default Controller;