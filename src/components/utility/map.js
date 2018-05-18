import React from 'react';

import './map.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.handleMapClick = this.handleMapClick.bind(this);
    }

    componentDidMount() {
        var map = new google.maps.Map(document.getElementById(this.props.id), {
            zoom: 5
        })

        var bounds = new google.maps.LatLngBounds();

        _.each(this.props.markets, (market, index) => {
            var marker = new google.maps.Marker({
                position: market.position,
                map: map
            });

            bounds.extend(marker.position);

            google.maps.event.addListener(marker, 'click', this.handleMapClick(marker, index, map));
        });

        map.fitBounds(bounds);
    }

    handleMapClick(marker, index, map) {
        var infowindow = new google.maps.InfoWindow();  

        return function() {
            infowindow.setContent(this.props.markets[index].description);
            infowindow.open(map, marker);
        }.bind(this);
    }

    render() {
        return(
            <div
                id={this.props.id}
                className="google-map">
            </div>
        )
    }
}
Controller.defaultProps = {
    id: 'google-map',
    markets: [
        {
            position: {lat: 55.0424283, lng: 83.0349714},
            title: 'Восток',
            description: 'Оптовая точка'
        },
        {
            position: {lat: 55.0388876, lng: 83.0176797},
            title: 'Дружба',
            description: 'Розничная точка. Пункт самовывоза'
        },
        {
            position: {lat: 55.135396, lng: 82.9882923},
            title: 'НОРДМОЛЛ',
            description: 'Розничная точка. Оптовая точка. Пункт самовывоза'
        }
    ]
}

//55.0424283,83.0349714
//55.135396,82.9882923

export default Controller;