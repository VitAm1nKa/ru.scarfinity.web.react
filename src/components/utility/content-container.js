import React from 'react';



class Controller extends React.Component {
    render() {
        return(
            // Оболочка
            <div 
                className={`content-container${
                this.props.loading ? ' content-container--loading' : ''
            }`}>
                { this.props.children }
                {/* Слой индикатора загрузки */}
                <div className="content-container__loading"></div>
            </div>
        )
    }
}

export default Controller;