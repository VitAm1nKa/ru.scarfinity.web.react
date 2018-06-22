import React    from 'react';
import View     from './shared/View';

class Controller extends React.Component {
    render() {
        return(
            <View title="Hello world. Blank">
                <h1>{"Blank"}</h1>
            </View>
        )
    }
}

export default Controller;