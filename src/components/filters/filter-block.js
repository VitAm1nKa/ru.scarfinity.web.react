import React from 'react';
import Paper from 'material-ui/Paper';

const FilterContainerView = (props) => {
    return(
        <Paper className="filter-block">
            <div className="filter-block__header">
                <span className="filter-block__header__title">{props.title}</span>
                <div 
                    className="filter-block__header__reset-block"
                    onClick={props.buttonAction}
                >{props.buttonTitle}</div>
            </div>
            <div className="filter-block__delim"></div>
            <div className="filter-block__content">
                {props.children}
            </div>
        </Paper>
    )
}
FilterContainerView.defaultProps = {
    title: "Имя фильра",
    buttonTitle: "bTitle",
    buttonAction: () => {},
}

export default FilterContainerView;