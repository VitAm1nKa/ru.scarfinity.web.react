import React        from 'react';
import { connect }  from 'react-redux';

import * as Grid    from '../../lib/grid';
import {
    PageHeader
}                   from '../utility/titles';
import Map          from '../utility/map';
import InfoLine     from '../utility/info-line';

// _.map(infoLines, (line, index) => <InfoLine key={index} {...line} />)

class Controller extends React.Component {

    

    render() {
        // отображение списка магазинов
        const shops = (() => {
            if(this.props.match.params.id == null) {
                // отображение всех магаинов
                return _.map(this.props.shop.shops, shop => ({
                    postion: { lat: shop.addresss.location.lat, lon: shop.address.location.lon }
                }))
            } else {
                const shop = _.find(this.props.shop.shops, s => s.shopId == parseInt(this.props.match.params.id));
                if(shop != null) {
                    return [{ position: { lat: shop.addresss.location.lat, lon: shop.address.location.lon } }];
                } else {
                    return null;
                }
            }
        })();

        if(shops == null) {

        }

        return(
            <Grid.VerticalGrid>
                <Grid.Row>
                    <Grid.Container>
                        <Grid.Col>
                            <PageHeader title="Контакты"/>
                        </Grid.Col>
                    </Grid.Container>
                </Grid.Row>
                <Map
                    id="google-map-main"
                    markets={markets}/>
                <Grid.Row>
                    <Grid.Container>
                        <Grid.Col>
                            <Grid.VerticalGrid>
                                {
                                    _.map(infoLines, (line, index) => <InfoLine key={index} {...line} />)
                                }
                            </Grid.VerticalGrid>
                        </Grid.Col>
                    </Grid.Container>
                </Grid.Row>
            </Grid.VerticalGrid>
        );
    }
}

export default connect(store => ({
    shop: store.shop
}), {})(Controller);