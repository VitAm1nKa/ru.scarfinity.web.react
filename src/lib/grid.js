import React from 'react';

const withStyle = (base, style) => {
    if(base !== null && base !== 'undefined' && style !== null && style !== 'undefined') {
        return Object.assign({}, base, style);
    }

    return null;
}

const col_lg = (value, grid) => value != null ? `lg-${grid}_${value}` : '';
const col_md = (value, grid) => value != null ? `md-${grid}_${value}` : '';
const col_sm = (value, grid) => value != null ? `sm-${grid}_${value}` : '';
const col_xs = (value, grid) => value != null ? `xs-${grid}_${value}` : '';
const classN = (value) => value ? value : '';

export const Col = (props) => {
    let grid = props.grid || 16;
    let cols = "s-grid-col " + ` ${col_xs(props.xs, grid)} ${col_sm(props.sm, grid)} ${col_md(props.md, grid)} ${col_lg(props.lg, grid)}`.trim();
    let className = `${cols} ${classN(props.className)}`.trim();
    return(
        <div
            className={cols}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}>
                <div
                    className={`s-grid-box${props.className ? " " + props.className : "" }`}
                    style={withStyle(props.style, {})}>
                        {props.children}
                </div>
        </div>
    )
}

export const Container = (props) => {
    return(
        <div
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            className={`s-grid-container${props.fill === true ? "" : " fluid" } ${classN(props.className)}`.trim()}
            style={withStyle(props.style, {})}
            >{props.children}</div>
    )
}

export const Row = (props) => {
    return(
        <div
            {...props}
            className={`s-grid-row ${classN(props.className)}`.trim()}
            style={withStyle(props.style, {})}
            >{props.children}</div>
    )
}

export const Grid = (props) => {
    return(
        <div 
            className={`s-grid ${classN(props.className)}`.trim()}
            style={withStyle(props.style, {})}
            >{props.children}</div>
    )
}

export const VerticalGrid = (props) => {
    return(
        <div className={`s-grid-vertical ${classN(props.className)}`.trim()}>
            {
                _.map(_.filter(_.flatten([props.children]), child => child != false), (child, index) => 
                    <div
                        key={index}
                        className="s-grid-vertical__item">
                            {child}
                    </div>
                )
            }
        </div>
    )
}

export const GridLine = (props) => {
    return(
        <Row className={props.rowClassName || ''}>
            <Container className={props.containerClassName || ''}>
                <Col className={props.colClassName || ''}>
                    {props.children}
                </Col>
            </Container>
        </Row>
    )
}