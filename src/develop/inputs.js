import React        from 'react';
import * as Grid    from '../lib/grid';
import PhoneInput   from '../components/utility/input-phone';

class Controller extends React.Component {
    hanldeChange(phoneNumberModel) {
        console.log(phoneNumberModel);
    }
    
    render() {
        return(
            <Grid.GridLine>
                <Grid.VerticalGrid>
                    <PhoneInput 
                        onChange={this.hanldeChange}/>
                </Grid.VerticalGrid>
            </Grid.GridLine>
        )
    }
}

export default Controller;