import React        from 'react';
import Measure      from 'react-measure';
import SlickSlider  from 'react-slick';

import './slider.less';

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
        const itemsCount = Math.floor(this.state.dimensions.width / this.state.dimensions.height);
        const marginWidth = this.state.dimensions.width - this.state.dimensions.height * itemsCount;
        const itemMargin = marginWidth / itemsCount / 2
        const itemSize = this.state.dimensions.height;

        return(
            <Measure bounds onResize={this.handleResize}>
                {({measureRef}) =>
                    <div ref={measureRef} className="sc-slider">
                        <SlickSlider
                            arrows={false}
                            slidesToShow={itemsCount}
                            slidesToScroll={itemsCount}
                            infinite={this.props.infinite}>
                                {
                                    _.map(this.props.children, (child, index) => 
                                    <div
                                        key={index}
                                        style={{ height: itemSize, textAlign: 'center' }}>
                                            {child}
                                    </div>)
                                }
                        </SlickSlider>
                    </div>
                }
            </Measure>
        )
    }
}

export default Controller;