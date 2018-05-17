import React from 'react';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            success: false,
            loading: true,
            image: null,
            width: 'auto',
            height: 'auto'
        }

        // this.loadImage(props.imageUrl);
    }

    loadImage(imageSrc) {
        if(imageSrc != null) {
            var image = new Image();
            image.onload = e => {
                const {width, height} = e.target;

                this.setState({
                    success: true,
                    loading: false,
                    image: e.target,
                    width: width <= height ? '100%' : 'auto',
                    height: width > height ? '100%' : 'auto'
                })
            }
            image.src = imageSrc;
        } else {
            this.setState({
                success: false,
                loading: false
            })
        }
    }

    render() {
        return(
            <div
                className="image-container">
                <div className="image-container__container">
                    {
                        this.props.imageUrl &&
                        <img
                            src={this.props.imageUrl}/>
                    }
                </div>
            </div>
        );
    }
}

export default Controller;
