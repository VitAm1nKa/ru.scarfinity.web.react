import React                from 'react';

import { fetch, addTask }   from 'domain-task';
import __request            from '../store/__request';
import update               from 'immutability-helper';

import * as Grid            from '../lib/grid';

import ImageContainer       from '../components/utility/image-container';

import FlatButton           from 'material-ui/FlatButton';
import RaisedButton         from 'material-ui/RaisedButton';
import Paper                from 'material-ui/Paper';

class ImageGalleryController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            saved: props.images || [],
            unsaved: []
        }

        this.handleSelectFiles = this.handleSelectFiles.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleSelectFiles(event) {
        if(event.target.files) {
            this.state.test = event.target.files;
            var unsaved = [];
            _.each(event.target.files, file => {
                var reader = new FileReader();
                reader.onload = (readFile => e => {
                    this.setState({
                        unsaved: update(this.state.unsaved, {$push: [{
                            readFile,
                            src: e.target.result
                        }]})
                    })
                })(file);
                reader.readAsDataURL(file);
            })
        }
    }

    handleSave() {
        var data = new FormData();
        data.append("imageGalleryId", this.props.imageGalleryId);

        // Add images in form data
        _.each(_.map(this.state.unsaved, u => u.readFile), file => {
            data.append("files", file)
        })

        __request({
            method: 'PUT',
            url: `api/ImageGallery`,
            body: data
        })
        .then(response => response.json())
        .then(({type, data}) => {
            if(type == 'success') {
                this.setState({
                    saved: update(this.state.saved, {$push: data.images}),
                    unsaved: []
                })
            }
        });
    }

    render() {
        return(
            <Paper className="dev__image-gallery">
                <div className="dev__image-gallery__header">
                    <span>{`Галлерея: ${this.props.imageGalleryId || -1}`}</span>
                    <span>{`Изображений: ${this.state.saved.length}`}</span>
                    <span>{`Не сохранено: ${this.state.unsaved.length}`}</span>
                    <div className="dev__image-gallery__header__middle"></div>
                    <RaisedButton
                        label={"Сохранить"}
                        disabled={this.state.unsaved.length == 0}
                        onClick={this.handleSave}/>
                    <RaisedButton
                        label={"Добавить"}
                        primary
                        onClick={this.props.onAddImages}
                        containerElement="label">
                            <input
                                type="file" 
                                multiple
                                onChange={this.handleSelectFiles}/>
                    </RaisedButton>
                </div>
                <Grid.Row>
                    <Grid.Container>
                        {
                            _.map(this.state.saved, (item, index) =>
                                <Grid.Col grid={16} lg={2} md={2} sm={2} xs={2} key={index}>
                                    <div className="dev__image-gallery__item">
                                        <ImageContainer
                                            imageUrl={`http://192.168.1.198:55139/${item}`} />
                                    </div>
                                </Grid.Col>
                            )
                        }
                        {
                            _.map(this.state.unsaved, (item, index) =>
                                <Grid.Col grid={16} lg={2} md={2} sm={2} xs={2} key={index}>
                                    <div className="dev__image-gallery__item unsaved">
                                        <ImageContainer
                                            imageUrl={item.src} />
                                    </div>
                                </Grid.Col>
                            )
                        }
                    </Grid.Container>
                </Grid.Row>
            </Paper>
        )
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            galleries: []
        }

        this.handleGalleryAdd = this.handleGalleryAdd.bind(this);
        this.handleAddImages = this.handleAddImages.bind(this);
    }
    
    componentWillMount() {
        let fetchTask = 
            __request({
                method: 'GET',
                url: `api/imageGallery`
            })
            .then(response => response.json())
            .then(({data}) => {
                this.setState({
                    galleries: data.galleries
                });
            });
    }

    handleGalleryAdd() {
        __request({
            method: 'POST',
            url: `api/ImageGallery`,
            bodyType: 'form'
        })
        .then(response => response.json())
        .then(({data}) => {
            console.log(data);
            this.setState({
                galleries: update(this.state.galleries, {$unshift: [data]})
            });
        });
    }

    handleAddImages(galIndex) {

    }

    render() {
        return(
            <Grid.VerticalGrid>
                <div className="dev__gallery-header">
                    <h2>Геллереи</h2>
                    <RaisedButton
                        label={"Добавить галерею"}
                        secondary
                        onClick={this.handleGalleryAdd} />
                </div>
                {
                    _.map(this.state.galleries, (item) =>
                        <ImageGalleryController
                            key={item.imageGalleryId}
                            {...item}
                            onAddImages={() => this.handleAddImages(item.imageGalleryId)}/>
                    )
                }
            </Grid.VerticalGrid>
        )
    }
}

export default Controller;