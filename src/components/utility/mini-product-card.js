import React                from 'react';

import ImageContainer       from './image-container';
import Currency             from './currency';
import { HorisontalRibbon } from './ribbon';

import './mini-product-card.less';

class Controller extends React.Component {
    render() {
        return(
            <div 
                className="mini-product-card">
                    <div className="mini-product-card__image">
                        <ImageContainer imageUrl={'http://192.168.1.198:55139/uploads/a3/69/1eade4a2-b695-4d21-9f20-4ab583525b2d.jpg'} />
                    </div>
                    <div 
                        className="mini-product-card__content">
                            <span className="mini-product-card__content__title">
                                {this.props.title}
                            </span> 
                            <div className="mini-product-card__content__pricing">
                                <div className="mini-product-card__content__pricing__price">
                                    <Currency
                                        original={this.props.price || 999}
                                        fontSize={14}
                                        fontWeight={600}
                                        glyphFull/>
                                </div>
                                <HorisontalRibbon size={11}/>
                            </div>
                    </div>
            </div>
        )
    }
}

export default Controller;