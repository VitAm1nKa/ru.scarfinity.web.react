import React from 'react';
import './titles.less';

export const H1 = (props) => <h1 className="titles__h1">{props.value}</h1>
export const PageHeader = (props) => {
    return(
        <div className="page-header">
            <h1>{props.title}</h1>
        </div>
    )
}