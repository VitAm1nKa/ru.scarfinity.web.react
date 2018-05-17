import React from 'react';

import { fetch, addTask }   from 'domain-task';
import __request            from '../store/__request';
import update               from 'immutability-helper';

import * as Grid            from '../lib/grid';
import Layout               from './__layout';

import {
    ProductModelActions
}                           from './__actions';

import ColorPicker          from '../components/utility/color-picker';
import ImageContainer       from '../components/utility/image-container';

import Edit                 from 'material-ui/svg-icons/image/edit';
import Delete               from 'material-ui/svg-icons/action/delete';
import NoteAdd              from 'material-ui/svg-icons/action/note-add';
import RaisedButton         from 'material-ui/RaisedButton';
import Paper                from 'material-ui/Paper';
import Divider              from 'material-ui/Divider';

const style = {
    buttonStyle: {
        minWidth: 36
    }
}

const ProductRow = (props) => {
    const imageSrc = props.image != "" ? `http://192.168.1.198:55139/${props.image}` : "";
    return(
        <tr>
            <td></td>
            <td>
                <ImageContainer imageUrl={imageSrc}/>
            </td>
            <td>{props.title}</td>
            <td>{props.model}</td>
            <td>
                <ColorPicker
                    colors={props.colorCodes || []}
                    count={5}
                    unselectable />
            </td>
            <td></td>
            <td style={{textAlign: 'center'}}>
                <RaisedButton
                    style={style.buttonStyle}
                    primary
                    icon={<Edit color={"#ffffff"} />}/>
            </td>
        </tr>
    )
}

const ProductTable = (props) => {
    return(
        <table>   
            <thead>
                <tr>
                    <th></th>
                    <th style={{width: 70, textAlign: 'center'}}>Фото</th>
                    <th>Название</th>
                    <th>Модель</th>
                    <th className="dev__product__products__color">Цвет</th>
                    <th className="dev__product__products__color">Узор</th>
                    <th style={{width: 60, textAlign: 'center'}}>+</th>
                </tr>
            </thead>
            <tbody>
                {
                    _.map(props.products, product =>
                        <ProductRow
                            key={product.id}
                            {...product}/>
                    )
                }
            </tbody>
        </table>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            productModels: []
        }
    }

    componentWillMount() {
        ProductModelActions.all(({type, data}) => {
            if(type == 'success') {
                this.setState({
                    productModels: data
                });
            }
        })
    }

    render() {
        return(
            <Layout title="Товары">
                <ProductTable products={this.state.productModels}/>
            </Layout>
        )
    }
}

export default Controller;