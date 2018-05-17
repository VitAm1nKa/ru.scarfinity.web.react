import React from 'react';

import Paper from 'material-ui/Paper';

export const ProductCardWrapPaper = (props) => {
	return(
		<Paper
			className="product-card" 
			zDepth={1}>
				{props.children}
		</Paper>
	)
}

export const ProductCardWrapDefault = (props) => {
	return(
		<div className="product-card" >
			{props.children}
		</div>
	)
}