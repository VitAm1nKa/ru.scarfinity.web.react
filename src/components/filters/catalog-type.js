import React        from 'react';
import { connect }  from 'react-redux';

import CheckBoxList         from '../utility/check-box-list';
import FilterContainerView  from './filter-block';

const View = (props) => {
    return(
        <FilterContainerView
            title="Категория"
            buttonTitle="все"
            buttonAction={props.buttonAction}>
                <CheckBoxList items={props.items} />
        </FilterContainerView>
    )
}
const mstp = (state, ownProps) => {
    const { location } = ownProps;
    console.log("Catalog type", ownProps);
    let currentNode = state.navigation.root;

    _.each(location.pathname.substr(1).split('/'), node => {
            if(currentNode != null) 
                currentNode = _.find(currentNode.nodes, {seo: node});
        }
    )

    console.log(currentNode);

    return {
        items: currentNode ? _.map(currentNode.nodes, node => ({
            title: node.title,
            subTitle: `${0}`
        })) : []
    }
}

const mdtp = (dispatch) => {
    return {
        
    }
}

export default connect(mstp, mdtp)(View);