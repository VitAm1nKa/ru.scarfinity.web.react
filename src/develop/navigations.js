import React                from 'react';
import MobileCatalogMenu    from '../components/navigation/mobile-catalog-menu';
import SlickCarousel        from 'react-slick';
import Slider               from '../components/utility/slider';

class Controller extends React.Component {
    render() {
        return(
            <div>
                <div className="mcm-container">
                    <Slider>
                        <div>
                            <h3>1</h3>
                            </div>
                            <div>
                            <h3>2</h3>
                            </div>
                            <div>
                            <h3>3</h3>
                            </div>
                            <div>
                            <h3>4</h3>
                            </div>
                            <div>
                            <h3>5</h3>
                            </div>
                            <div>
                            <h3>6</h3>
                        </div>
                    </Slider>
                </div>
            </div>
        )
    }
}

export default Controller;