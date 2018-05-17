import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from 'react-sticky';

let i = 0;
class Header extends React.Component {
  render() {
    return (
      <div
        style={Object.assign({},{
          height: 80,
          overflow: "auto",
          background: "#aaa"
        }, this.props.style)}
      >
        <h2>
          <span className="pull-left">
            &lt;Sticky /&gt; <small>(invocation: #{i++})</small>
          </span>
        </h2>
      </div>
    );
  }
}

class Document extends React.Component {
  render() {
    return (
      <div style={{ height: 1500, margin: "0 30px" }}>
        <h2>Content before the Sticky...</h2>
        <div style={{ marginBottom: 200 }} />
        <StickyContainer
          style={{ height: 500, background: "#ddd", padding: "0 30px" }}
        >
          <Sticky>
            {({
              isSticky,
              wasSticky,
              style,
              distanceFromTop,
              distanceFromBottom,
              calculatedHeight
            }) => {
              console.log({
                isSticky,
                wasSticky,
                style,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight
              });
              return <Header style={style} />;
            }}
          </Sticky>

          <h2 className="text-center" style={{ marginTop: 150 }}>
            &lt;StickyContainer /&gt;
          </h2>
        </StickyContainer>
        <div style={{ marginBottom: 200 }} />
        <h2>Content after the Sticky...</h2>
      </div>
    );
  }
}

export default Document;