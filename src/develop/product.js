import React from 'react';

import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import * as Validation      from '../lib/validation';

import * as Grid            from '../lib/grid';
import Layout               from './__layout';

import {
    ProductModelActions,
    ProductActions,
    ImageGalleryActions
}                           from './__actions';

import { 
    Input,
    BasicInput,
    TextArea,
    SelectInput
}                           from '../components/utility/input';

import ColorPicker          from '../components/utility/color-picker';
import ImageContainer       from '../components/utility/image-container';

import FlatButton           from 'material-ui/FlatButton';
import RaisedButton         from 'material-ui/RaisedButton';
import Dialog               from 'material-ui/Dialog';
import {fullWhite}          from 'material-ui/styles/colors';
import ActionAndroid        from 'material-ui/svg-icons/action/android';
import Reply                from 'material-ui/svg-icons/content/reply';
import Save                 from 'material-ui/svg-icons/content/save';
import RemoveCircle         from 'material-ui/svg-icons/content/remove-circle';
import DeleteForever        from 'material-ui/svg-icons/action/delete-forever';
import FormatColorReset     from 'material-ui/svg-icons/editor/format-color-reset';
import Paper                from 'material-ui/Paper';
import {Tabs, Tab}          from 'material-ui/Tabs';
import Divider              from 'material-ui/Divider';

const style = {
    buttonStyle: {
        minWidth: 40
    }
}

const ProductModel = {
    colorId: -1,
    images: {
        saved: [],
        unsaved: []
    },
    saved: false
}

const ModelData = {
    model: "",
    art: "",
    title: "",
    description: "",
    seo: "",
    seoDescription: "",
    sex: 0,
    season: 0,
    year: 17,
    manufacture: "CN",
    brand: "NB",
    materialComposition: "",
    clothingStyle: "",
    size: "",
    additional: ""
}

const ModelValidation = [
    Validation.validationModel({ field: "title", required: true }),
    Validation.validationModel({ field: "model", required: true, maxLength: 6, minLength: 6, regexp: /^\d+$/ }),
    Validation.validationModel({ field: "seo", required: true, regexp: /^\d+$/ }),
]

const ImageView = props => {
    return(
        <Grid.Col grid={16} lg={2} md={2} sm={2} xs={2}>
            <div className={`dev__image-gallery__item${props.unsaved ? " unsaved" : ""}`}>
                <ImageContainer imageUrl={props.src} />
                <div className="dev__image-gallery__item__control">
                    <FlatButton
                        style={style.buttonStyle}
                        secondary
                        icon={<DeleteForever />}/>
                </div>
            </div>
        </Grid.Col>
    )
}

const ProductLine = (props) => {
    return(
        <tr>
            <td style={{maxWidth: 60, textAlign: 'center'}}>
                {
                    props.colorId != -1 ?
                    <ColorPicker
                        count={1}
                        colors={[props.colorId]}
                        onSelectChange={props.onColorSelect}/>
                    :
                    <FlatButton
                        style={style.buttonStyle}
                        primary
                        onClick={props.onColorSelect}
                        icon={<FormatColorReset />}/>
                }
            </td>
            <td style={{maxWidth: 60, textAlign: 'center'}}>{"Нет"}</td>
            <td>               
                <Grid.Row>
                    <Grid.Container>
                        {
                            _.map(props.images.saved, (item, index) =>
                                <ImageView
                                    key={index}
                                    src={`http://192.168.1.198:55139/${item.src}`}/>
                            )
                        }
                        {
                            _.map(props.images.unsaved, (item, index) =>
                            <ImageView
                                key={index}
                                unsaved
                                src={item.src}/>
                        )
                        }
                        <Grid.Col grid={16} lg={2} md={2} sm={2} xs={2}>
                            <div className="dev__image-gallery__item add">
                                <input
                                    type="file" 
                                    multiple
                                    onChange={props.onImageAdd}/>
                            </div>
                        </Grid.Col>
                    </Grid.Container>
                </Grid.Row>
            </td>
            <td>
                <div>
                    <FlatButton
                        style={style.buttonStyle}
                        primary
                        disabled={true}
                        icon={<Save />}/>
                </div>
                <div>
                    <FlatButton
                        style={style.buttonStyle}
                        secondary
                        icon={<RemoveCircle />}/>
                </div>
            </td>
        </tr>
    )
}

const Products = (props) => {
    console.log(props.products);
    return(
        <table>
            <thead>
                <tr>
                    <th style={{width: 60, textAlign: 'center'}}>Цвет</th>
                    <th style={{width: 60, textAlign: 'center'}}>Узор</th>
                    <th style={{textAlign: 'center'}}>Фотографии</th>
                    <th style={{width: 60, textAlign: 'center'}}></th>
                </tr>
            </thead>
            <tbody>
                {
                    _.map(props.products, item =>
                        <ProductLine 
                            key={item.id}
                            onImageAdd={e => {props.onImageAdd(e, item.id)}}
                            onColorSelect={() => {props.onColorSelect(item.id)}}
                            {...item} />
                    )
                }
                <tr>
                    <td colSpan={4} style={{textAlign: 'center'}}>
                        <FlatButton
                            label="Добавить"
                            secondary
                            onClick={props.onProductAdd}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modelData: Object.assign({}, ModelData, {
                title: "Тестовый шарф",
                model: "000000",
                seo: "foretest"
            }),
            modelValidations: {},
            hotValidation: false,
            products: [],
            baseProductId: -1,
            dialogToggle: false,
            dialogProductId: -1
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleProductAdd = this.handleProductAdd.bind(this);
        this.handleImageAdd = this.handleImageAdd.bind(this);
        this.handleColorSelect = this.handleColorSelect.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);

        this.validate = this.validate.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSaveComplete = this.handleSaveComplete.bind(this);
    }

    componentWillMount() {
        const productModelId = this.props.match.params.id;
        ProductModelActions.get(productModelId, ({data, type}) => {
            if(type == 'success') {
                _.map(data.productsList, product => {
                    const productData = Object.assign({}, update(ProductModel, {images: {
                        $merge: {saved: _.map(product.images, image => ({src: image}))}
                    }}), product.productData);
                    this.state.products = update(this.state.products, {$push: [productData]});
                })
                this.setState({
                    modelData: update(ModelData, {$merge: data.productModel})
                }, () => {
                    console.log(this.state.modelData);
                    console.log(this.state.products);
                })
            }
        });
    }

    handleSaveComplete(modelData, products) {
        console.log("On complete");
        this.setState({
            saving: false
        });
    }

    handleSave() {
        if(this.validate()) {
            // Save Model first
            ProductModelActions.post(this.state.modelData, ({type, data}) => {
                if(type === 'success') {
                    this.state.modelData = data;

                    const unsavedProducts = _.filter(this.state.products, x => x.saved == false);
                    if(unsavedProducts.length == 0) 
                        this.handleSaveComplete();

                    // Save Products Iamge Gallery
                    _.each(unsavedProducts, product => {
                        // Create ImageGallery
                        const imageGalleyFormData = new FormData();
                        _.each(product.images.unsaved, image => {
                            imageGalleyFormData.append("files", image.readFile);
                        })
                    
                        ImageGalleryActions.post(imageGalleyFormData, product.imageGalleryId , ({type, data}) => {
                            if(type === 'success') {
                                const imageGallery = data;

                                product.productModelId = this.state.modelData.id;
                                product.imageGalleryId = imageGallery.imageGalleryId;
                                product.images.unsaved = update(product.images.unsaved, {$set: []});
                                product.images.saved = update(product.images.saved, {$set: _.map(imageGallery.images, image => ({ src: image }))});

                                // Save Product
                                ProductActions.post(product, ({type, data}) => {
                                    if(type === 'success') {
                                        const index = _.findIndex(this.state.products, x => x.id == product.id);
                                        const productData = Object.assign({}, data, {saved: true});
                                        this.state.products = update(this.state.products, {[index]: {$merge: productData}});

                                        // Check is last
                                        if(_.filter(this.state.products, x => x.saved == false).length == 0)
                                            this.handleSaveComplete();
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    }

    validate() {
        _.each(ModelValidation, item => {
            const validation = Validation.validate(item.field, this.state.modelData, ModelValidation);
            this.state.modelValidations = update(this.state.modelValidations, {$merge: {[item.field]: validation}});
        });

        this.setState({
            hotValidation: true
        });

        var validationArray = _.values(this.state.modelValidations);
        var hasError = _.filter(validationArray, x => x.valid == false);

        // Show errors
        // 

        return hasError.length == 0;
    }
    
    handleProductAdd() {
        var product = Object.assign({}, ProductModel, {
            id: this.state.baseProductId
        });

        this.setState({
            products: update(this.state.products, {$push: [product]}),
            baseProductId: product.id - 1
        });
    }

    handleImageAdd(event, productId) {
        if(event.target.files) {
            var unsaved = [];
            var index = _.findIndex(this.state.products, x => x.id == productId);
            this.state.products = update(this.state.products, {[index]: {$merge: {saved: false}}});
            _.each(event.target.files, file => {
                var reader = new FileReader();
                reader.onload = (readFile => e => {
                    this.setState({
                        products: update(this.state.products, {[index]: {
                            images: {unsaved: {$push: [{readFile, src: e.target.result}]}}
                        }})
                    })
                })(file);
                reader.readAsDataURL(file);
            })
        }
    }

    handleColorSelect(productId) {
        this.setState({dialogToggle: true, dialogProductId: productId});
    }

    handleDialogClose(colorId) {
        if(colorId != null) {
            var index = _.findIndex(this.state.products, x => x.id == this.state.dialogProductId);
            this.state.products = update(this.state.products, {[index]: {colorId: {$set: colorId}}});
        }

        this.setState({
            dialogToggle: false,
            dialogProductId: -1
        });
    }

    handleChange(event, type) {
        var inputData = Object.assign({}, {[type]: event.target.value});
        var modelData = update(this.state.modelData, {$merge: inputData});

        // Validation
        if(this.state.hotValidation) {
            const validation = Validation.validate(type, modelData, ModelValidation);
            this.state.modelValidations = update(this.state.modelValidations, {$merge: {[type]: validation}})
        }

        this.setState({modelData});
    }

    render() {
        const {modelData, modelValidations} = this.state;
        const valid = field => {
            const validationState = modelValidations[field];
            if(validationState != null) {
                return validationState.valid;
            }

            return null;
        }

        return(
            <Layout title="Товар(модель)">
                <Grid.VerticalGrid>
                    <div style={{textAlign: 'right'}}>
                        <RaisedButton
                            onClick={this.handleSave}
                            type="submit"
                            label={"Сохранить"}
                            primary/>
                    </div>
                    <Grid.Row>
                        <Grid.Container>
                            <Grid.Col>
                                <h3>Основное</h3>
                            </Grid.Col>
                            <Grid.Col lg={8} md={8}>
                                <Input.Basic model={modelData} field="title" placeholder="Название" onChange={this.handleChange} valid={valid("title")}/>
                                <Input.Basic model={modelData} field="seo" placeholder="Seo" onChange={this.handleChange} valid={valid("seo")}/>
                                <Input.TextArea model={modelData} field="description" placeholder="Описание" onChange={this.handleChange}/>
                            </Grid.Col>
                            <Grid.Col lg={8} md={8}>
                                <Input.Basic model={modelData} field="model" placeholder="Модель (000000)" onChange={this.handleChange} valid={valid("model")}/>
                                <Input.Basic model={modelData} field="art" placeholder="Артикул" onChange={this.handleChange}/>
                                <Input.TextArea model={modelData} field="seoDescription" placeholder="Seo описание" onChange={this.handleChange}/>
                            </Grid.Col>
                        </Grid.Container>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row>
                        <Grid.Container>
                            <Grid.Col lg={8} md={8}>
                                <h3>{"Пол и сезонность"}</h3>
                                <Input.Basic model={modelData} field="sex" placeholder="Пол" onChange={this.handleChange}/>
                                <Input.Basic model={modelData} field="season" placeholder="Сезон" onChange={this.handleChange}/>
                                <Input.Basic model={modelData} field="year" placeholder="Сезон(год)" onChange={this.handleChange}/>
                            </Grid.Col>
                            <Grid.Col lg={8} md={8}>
                                <h3>{"Произв. и бренд"}</h3>
                                <Input.Basic model={modelData} field="manufacture" placeholder="Производитель" onChange={this.handleChange}/>
                                <Input.Basic model={modelData} field="brand" placeholder="Бренд" onChange={this.handleChange}/>
                            </Grid.Col>
                        </Grid.Container>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row>
                        <Grid.Container>
                            <Grid.Col><h3>Дополнительно</h3></Grid.Col>
                            <Grid.Col lg={8} md={8}>
                                <Input.Basic model={modelData} field="materialComposition" placeholder="Материал(состав)" onChange={this.handleChange}/>
                                <Input.Basic model={modelData} field="clothingStyle" placeholder="Стиль одежды" onChange={this.handleChange}/>
                            </Grid.Col>
                            <Grid.Col lg={8} md={8}>
                                <Input.Basic model={modelData} field="size" placeholder="Размер" onChange={this.handleChange}/>
                                <Input.Basic model={modelData} field="additional" placeholder="Доп. описание(примечание)" onChange={this.handleChange}/>
                            </Grid.Col>
                        </Grid.Container>
                    </Grid.Row>
                    <Divider />
                        <Products
                            products={this.state.products}
                            onColorSelect={this.handleColorSelect}
                            onImageAdd={this.handleImageAdd}
                            onProductAdd={this.handleProductAdd}/>
                    <Divider />
                    <div style={{textAlign: 'right'}}>
                        <RaisedButton
                            onClick={this.handleSave}
                            type="submit"
                            label={"Сохранить"}
                            primary/>
                    </div>
                </Grid.VerticalGrid>
                <Dialog
                    title={"Выбор цвета"}
                    modal={false}
                    open={this.state.dialogToggle}
                    onRequestClose={this.handleDialogClose}>
                        <ColorPicker      
                            pure               
                            count={10}
                            onSelectChange={this.handleDialogClose}/>
                </Dialog>
            </Layout>
        )
    }
}

export default Controller;