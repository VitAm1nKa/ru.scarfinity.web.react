import React                from 'react';

import ColorPicker          from '../utility/color-picker';
import FilterContainerView  from './filter-block';

class Controller extends React.Component {
    render() {
        return(
            <FilterContainerView
                title={"Цвет"}
                buttonTitle={"сброс"}
                buttonAction={this.props.onReset}>
                    <ColorPicker
                        lineCount={6}
                        pure
                        filter
                        selectedColors={this.props.selectedColors}
                        avalibleColors={this.props.avalibleColors}
                        onSelectChange={this.props.onSelectChange}/>
            </FilterContainerView>
        )
    }
}

export default Controller;