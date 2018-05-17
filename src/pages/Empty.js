import React            from 'react';
import { GridLine }     from '../lib/grid';
import MobileMainMenu   from '../components/navigation/mobile-main-menu';

class Controller extends React.Component {
    render() {
        return(
            <GridLine>
                <MobileMainMenu />
                <h1>{"Пустая страница"}</h1>
            </GridLine>
        )
    }
}

export default Controller;