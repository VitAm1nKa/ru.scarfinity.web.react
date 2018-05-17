import React    from 'react';
import Measure  from 'react-measure';

import './slide-container.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
            height: 0
        }

        this.timer = undefined;

        this.handleResize = this.handleResize.bind(this);
        this.slideDown = this.slideDown.bind(this);
        this.slideUp = this.slideUp.bind(this);
        this.animation = this.animation.bind(this);
    }

    handleResize(contentRect) {
        this.setState({dimensions: contentRect.bounds});
    }

    slideDown() {
        this.animation(this.state.dimensions.height);
    }

    slideUp() {
        this.animation(0);
    }

    animation(toValue, speed = 100) {
        // Время анимации 1 секунда 1000 милесекунд
        // Анимация займет 1000 / 10, 100 итераций
        clearInterval(this.timer);

        const height = this.state.height;
        const step = (toValue - height) / speed;
        
        this.timer = setInterval(() => {
            const newHeight = this.state.height + step;
            console.log(newHeight);
            if((newHeight > toValue && step > 0) || (newHeight < toValue && step < 0)) {
                return this.setState({height: toValue}, () => {
                    clearInterval(this.timer);
                });
            }

            this.setState({height: newHeight})
        }, 10);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.open != this.props.open) {
            if(nextProps.open == true)
                this.slideDown();
            else
                this.slideUp();
        }
    }

    render() {
        const style = {
            maxHeight: this.state.height,
            padding: this.props.open ? 7 : 0,
            margin: this.props.open ? -7 : 0
        }

        return(
            <div className="slide-container" style={style}>
                <Measure
                    bounds
                    onResize={this.handleResize}>
                        {({measureRef}) => 
                            <div
                                className="slide-container__content"
                                ref={measureRef}>
                                    {this.props.children}
                            </div>
                        }
                </Measure>
            </div>
        )
    }
}

export default Controller;