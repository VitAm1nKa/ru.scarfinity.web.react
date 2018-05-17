import React        from 'react';
import FlatButton   from './flat-button';

const Pagination = (props) => {
    const c = props.currentPage;
    const max = props.pagesCount;
    const sideCount = props.sideCount || 2;

    const start = Math.max(c - sideCount, 1);
    const end = Math.min(c + sideCount, max);
    const hasFirst = start !== 1;
    const hasLast = end < max;

    let indices = [];
    for(var i = start; i <= end; i++) {
        indices.push(i);
    }

    const pages = 
        <div className="s-pagination">
            {hasFirst && <span onClick={() => {props.onClick(1)}} className="def">1</span>}
            {hasFirst && <span className="dtt">...</span>}
            {
                indices.map(item =>
                    <span
                        key={item}
                        className={`${item == c ? "crr" : "def"}`}
                        onClick={() => {props.onClick(item)}}>
                            {item}
                    </span>
                )
            }
            {hasLast && <span className="dtt">...</span>}
            {hasLast && <span onClick={() => {props.onClick(max)}} className="def">{max}</span>}
        </div>

    return(
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{flex: 1}}>
                {   
                    c > 1 &&
                    <FlatButton
                        label={"Предыдущая"}
                        chevronLeft
                        onClick={() => {props.onClick(c - 1)}} />
                }
            </div>
            {pages}
            <div style={{flex: 1, textAlign: 'right'}}>
                {
                    c < max && 
                    <FlatButton
                        label={"Следующая"}
                        chevronRight
                        onClick={() => {props.onClick(c + 1)}} />
                }
            </div>
        </div>
    )
}

export default Pagination;