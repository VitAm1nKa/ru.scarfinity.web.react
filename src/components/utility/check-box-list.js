import React    from 'react';
import CheckBox from './check-box';  

import './check-box-list.less';

const View = (props) => {
    return(
        <div className="check-box-list">
            {
                _.map(props.items, (item, index) =>
                    <div
                        key={index} 
                        className="check-box-list__item">
                            <CheckBox
                                {...item}
                                onChange={checked => props.onChange(item.id, checked)}/>
                    </div>
                )
            }
        </div>
    )
}

export default View;